import test from "node:test";
import assert from "node:assert/strict";
import { createFlangeDrawingModel } from "./engine/flangeDrawingModel.ts";
import {
    buildFlangeDrawingVectorDocument,
    buildFlangeDrawingVectors,
} from "./engine/flangeDrawingVectors.ts";
import type { FlangeLookupResponse } from "./engine/flangeMeasures.ts";

const response: FlangeLookupResponse = {
    count: { value: 4 },
    boltSize: "M16",
    measures: {
        D: { value: 220 },
        K: { value: 180 },
        L: { value: 22 },
        C2: { value: 24 },
        A: { value: 100 },
        S: { value: 8 },
        R1: { value: 6 },
        H2: { value: 100 },
        H3: { value: 12 },
        N1: { value: 128 },
    },
};

test("full drawing vectors combine shape vectors before dimension vectors", () => {
    const model = createFlangeDrawingModel({
        flangeType: "11",
        face: "G",
        measures: response.measures,
    });
    const elements = buildFlangeDrawingVectors({ model, response });
    const layers = elements.map((element) => element.layer);
    const firstShapeLayer = layers.findIndex((layer) => layer === "neck" || layer === "body" || layer === "face");
    const firstDimension = layers.indexOf("dimension");
    const lastShape = Math.max(layers.lastIndexOf("neck"), layers.lastIndexOf("body"), layers.lastIndexOf("face"));

    assert.ok(firstShapeLayer >= 0);
    assert.ok(firstDimension > firstShapeLayer);
    assert.ok(lastShape < firstDimension);
});

test("full drawing vectors include shape and dimension semantics from the supported pipeline", () => {
    const model = createFlangeDrawingModel({
        flangeType: "05",
        face: "B",
        measures: response.measures,
    });
    const elements = buildFlangeDrawingVectors({ model, response });
    const roles = elements.map((element) => element.role);
    const labels = elements
        .filter((element) => element.kind === "text")
        .map((element) => element.text);

    assert.ok(roles.includes("outerRim"));
    assert.ok(roles.includes("raisedFaceFill"));
    assert.ok(labels.includes("4×⌀22"));
    assert.ok(labels.includes("F1"));
    assert.ok(labels.includes("D1"));
});

test("full drawing vectors return centered fallback text for an unknown flange type", () => {
    const model = createFlangeDrawingModel({
        flangeType: "99",
        face: null,
        measures: response.measures,
    });
    const elements = buildFlangeDrawingVectors({ model, response });

    assert.equal(elements.length, 1);
    assert.deepEqual(elements[0], {
        kind: "text",
        layer: "fallback",
        role: "unsupportedMessage",
        x: model.bounds.minX + model.bounds.width / 2,
        y: model.bounds.minY + model.bounds.height / 2,
        text: "Drawing not implemented for flange type 99.",
        textAnchor: "middle",
        dominantBaseline: "middle",
        fill: "rgb(34, 33, 33)",
        fontSize: "12",
    });
});

test("drawing vector document wraps bounds, elements, and drawing metadata", () => {
    const model = createFlangeDrawingModel({
        flangeType: "11",
        face: "G",
        measures: response.measures,
    });
    const document = buildFlangeDrawingVectorDocument(model, response);

    assert.deepEqual(document.bounds, model.bounds);
    assert.deepEqual(document.elements, buildFlangeDrawingVectors({ model, response }));
    assert.deepEqual(document.metadata, {
        flangeType: "11",
        face: "G",
        isSupported: true,
    });
    assert.equal(document.warnings, undefined);
});

test("drawing vector document wraps unsupported fallback drawings too", () => {
    const model = createFlangeDrawingModel({
        flangeType: "99",
        face: null,
        measures: response.measures,
    });
    const document = buildFlangeDrawingVectorDocument(model, response);

    assert.deepEqual(document.bounds, model.bounds);
    assert.deepEqual(document.metadata, {
        flangeType: "99",
        face: null,
        isSupported: false,
    });
    assert.equal(document.elements.length, 1);
    assert.equal(document.elements[0].role, "unsupportedMessage");
});
