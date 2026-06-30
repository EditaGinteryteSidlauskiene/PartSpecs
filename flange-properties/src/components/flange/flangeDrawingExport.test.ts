import test from "node:test";
import assert from "node:assert/strict";
import {
    serializeFlangeDrawing,
    type FlangeLookupResponse,
} from "./engine/flangeDrawingEngine.ts";

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
        D1: { value: 145 },
        F2: { value: 4 },
    },
};

const assertExportSvg = (svg: string): void => {
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(svg, /viewBox="[-\d.]+ [-\d.]+ [\d.]+ [\d.]+"/);
    assert.match(svg, /<defs>[\s\S]*id="type01-hatch"[\s\S]*id="type01-arrowhead-green"[\s\S]*<\/defs>/);
    assert.match(svg, /<g>[\s\S]*<(line|rect|path|text)\b/);
    assert.equal(svg.includes(" layer="), false);
    assert.equal(svg.includes(" role="), false);
    assert.equal(svg.includes("className="), false);
    assert.equal(svg.includes("data-reactroot"), false);
};

test("serializeFlangeDrawing exports supported flange drawings as plain SVG", () => {
    const cases = [
        { flangeType: "01", face: null, response: flatResponse },
        { flangeType: "05", face: null, response: flatResponse },
        { flangeType: "11", face: "B", response: neckResponse },
    ];

    for (const input of cases) {
        const svg = serializeFlangeDrawing(input);

        assertExportSvg(svg);
        assert.equal(svg.includes("Drawing not implemented"), false);
    }
});

test("serializeFlangeDrawing exports the unknown flange fallback as plain SVG", () => {
    const svg = serializeFlangeDrawing({
        flangeType: "99",
        face: null,
        response: flatResponse,
    });

    assertExportSvg(svg);
    assert.match(svg, /Drawing not implemented for flange type 99\./);
});
