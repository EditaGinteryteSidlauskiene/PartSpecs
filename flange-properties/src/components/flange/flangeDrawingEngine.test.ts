import test from "node:test";
import assert from "node:assert/strict";
import {
    buildFlangeDrawing,
    buildFlangeDrawingVectorDocument,
    createFlangeDrawingModel,
    serializeFlangeDrawing,
    serializeSvgVectorDocument,
    type FlangeLookupResponse,
    type FlangeDrawingModel,
    type FlangeDrawingVectorDocument,
    type SvgVectorDocument,
    type SvgVectorElement,
} from "./engine/flangeDrawingEngine.ts";

test("pure flange drawing engine builds and serializes a drawing without React imports", () => {
    const response: FlangeLookupResponse = {
        count: { value: 4 },
        boltSize: "M16",
        measures: {
            D: { value: 165 },
            K: { value: 125 },
            L: { value: 18 },
            C1: { value: 18 },
            B1: { value: 100 },
        },
    };
    const model: FlangeDrawingModel = createFlangeDrawingModel({
        flangeType: "01",
        face: "A",
        measures: response.measures,
    });
    const document: FlangeDrawingVectorDocument = buildFlangeDrawingVectorDocument(model, response);
    const genericDocument: SvgVectorDocument = document;
    const firstElement: SvgVectorElement | undefined = document.elements[0];
    const svg = serializeSvgVectorDocument(document);

    assert.equal(model.typeDefinition?.type, "01");
    assert.equal(document.metadata?.isSupported, true);
    assert.deepEqual(genericDocument.bounds, model.bounds);
    assert.ok(firstElement);
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(svg, /viewBox="[-\d.]+ [-\d.]+ [\d.]+ [\d.]+"/);
    assert.match(svg, /<defs>/);
    assert.match(svg, /<(line|rect|path|text)\b/);
});

test("pure flange drawing engine builds and serializes directly from raw flange input", () => {
    const response: FlangeLookupResponse = {
        count: { value: 8 },
        boltSize: "M20",
        measures: {
            D: { value: 220 },
            K: { value: 180 },
            L: { value: 22 },
            C2: { value: 24 },
            A: { value: 100 },
            S: { value: 8 },
            R1: { value: 6 },
            H3: { value: 12 },
            N1: { value: 128 },
            H2: { value: 100 },
        },
    };
    const input = {
        flangeType: "11",
        face: "G",
        response,
    };
    const document = buildFlangeDrawing(input);
    const svg = serializeFlangeDrawing(input);

    assert.equal(document.metadata?.flangeType, "11");
    assert.equal(document.metadata?.face, "G");
    assert.equal(document.metadata?.isSupported, true);
    assert.ok(document.elements.length > 0);
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(svg, /<defs>/);
    assert.match(svg, /<(line|rect|path|text)\b/);
});
