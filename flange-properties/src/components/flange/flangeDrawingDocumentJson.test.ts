import test from "node:test";
import assert from "node:assert/strict";
import {
    buildFlangeDrawing,
    serializeSvgVectorDocument,
    validateSvgVectorDocument,
    type FlangeDrawingVectorDocument,
    type FlangeLookupResponse,
} from "./engine/index.ts";

const flatResponse: FlangeLookupResponse = {
    count: { value: 4 },
    boltSize: "M16",
    measures: {
        D: { value: 165 },
        K: { value: 125 },
        L: { value: 18 },
        C1: { value: 18 },
        C4: { value: 22 },
        B1: { value: 100 },
        F1: { value: 2 },
        F2: { value: 4 },
        D1: { value: 120 },
    },
};

const neckResponse: FlangeLookupResponse = {
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
        F1: { value: 2 },
        F2: { value: 4 },
        D1: { value: 145 },
    },
};

const incompleteNeckResponse: FlangeLookupResponse = {
    count: { value: 8 },
    boltSize: "M20",
    measures: {
        D: { value: 220 },
        K: { value: 180 },
        L: { value: 22 },
        C2: { value: 24 },
    },
};

const roundTripDocument = (document: FlangeDrawingVectorDocument): FlangeDrawingVectorDocument =>
    JSON.parse(JSON.stringify(document)) as FlangeDrawingVectorDocument;

const assertSerializableSvg = (document: FlangeDrawingVectorDocument): string => {
    const svg = serializeSvgVectorDocument(document);

    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(svg, /viewBox="[-\d.]+ [-\d.]+ [\d.]+ [\d.]+"/);
    assert.match(svg, /<defs>/);
    assert.match(svg, /<(line|rect|path|text)\b/);
    assert.equal(svg.includes(" layer="), false);
    assert.equal(svg.includes(" role="), false);

    return svg;
};

test("flange vector documents survive JSON round-trip as plain data", () => {
    const cases = [
        { flangeType: "01", face: null, response: flatResponse },
        { flangeType: "05", face: "B", response: flatResponse },
        { flangeType: "11", face: "H", response: neckResponse },
        { flangeType: "99", face: null, response: flatResponse },
    ];

    for (const input of cases) {
        const document = buildFlangeDrawing(input);
        const parsedDocument = roundTripDocument(document);
        const validation = validateSvgVectorDocument(parsedDocument);
        const elementKinds = new Set(parsedDocument.elements.map((element) => element.kind));
        const svg = assertSerializableSvg(parsedDocument);

        assert.equal(validation.isValid, true);
        assert.deepEqual(validation.errors, []);
        assert.deepEqual(parsedDocument.bounds, document.bounds);
        assert.deepEqual(parsedDocument.metadata, document.metadata);
        assert.ok(parsedDocument.elements.length > 0);
        assert.ok(elementKinds.has("text"));

        if (input.flangeType === "99") {
            assert.deepEqual([...elementKinds], ["text"]);
            assert.equal(parsedDocument.metadata?.isSupported, false);
            assert.match(svg, /Drawing not implemented for flange type 99\./);
        } else {
            assert.ok(elementKinds.has("line"));
            assert.ok(elementKinds.has("path"));
            assert.equal(parsedDocument.metadata?.isSupported, true);
        }
    }
});

test("JSON round-trip preserves vector warnings for incomplete drawing data", () => {
    const document = buildFlangeDrawing({
        flangeType: "11",
        face: "H",
        response: incompleteNeckResponse,
    });
    const parsedDocument = roundTripDocument(document);
    const validation = validateSvgVectorDocument(parsedDocument);
    const elementKinds = new Set(parsedDocument.elements.map((element) => element.kind));

    assert.equal(validation.isValid, true);
    assert.deepEqual(validation.errors, []);
    assert.ok(parsedDocument.warnings);
    assert.deepEqual(parsedDocument.warnings, document.warnings);
    assert.match(parsedDocument.warnings?.[0] ?? "", /required measures are missing/);
    assert.ok(elementKinds.has("line"));
    assert.ok(elementKinds.has("path"));
    assert.ok(elementKinds.has("text"));
    assertSerializableSvg(parsedDocument);
});
