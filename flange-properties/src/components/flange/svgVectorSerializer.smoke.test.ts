import test from "node:test";
import assert from "node:assert/strict";
import { buildFlangeDrawingVectorDocument } from "./engine/flangeDrawingVectors.ts";
import { createFlangeDrawingModel } from "./engine/flangeDrawingModel.ts";
import { FACE_LETTERS } from "./engine/flangeFaceRules.ts";
import type { FlangeLookupResponse } from "./engine/flangeMeasures.ts";
import { getFlangeTypeDefinition, KNOWN_FLANGE_TYPES, type FlangeTypeCode } from "./engine/flangeTypes.ts";
import { serializeSvgVectorDocument } from "./engine/svgVectorSerializer.ts";

const faceCases: Array<string | null> = [null, ...FACE_LETTERS];

const flatThicknessSamples: Partial<Record<FlangeTypeCode, number>> = {
    "01": 18,
    "02": 20,
    "04": 22,
    "05": 18,
};

const createSampleResponse = (flangeType: FlangeTypeCode): FlangeLookupResponse => {
    const typeDefinition = getFlangeTypeDefinition(flangeType);
    const thicknessKey = typeDefinition?.thicknessKeys[0] ?? "C2";

    if (typeDefinition?.hasNeck) {
        return {
            count: { value: 8 },
            boltSize: "M20",
            measures: {
                D: { value: 220 },
                K: { value: 180 },
                L: { value: 22 },
                [thicknessKey]: { value: 24 },
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
    }

    return {
        count: { value: 4 },
        boltSize: "M16",
        measures: {
            D: { value: 165 },
            K: { value: 125 },
            L: { value: 18 },
            [thicknessKey]: { value: flatThicknessSamples[flangeType] ?? 18 },
            ...(typeDefinition?.hasBore ? { B1: { value: 100 } } : {}),
            F1: { value: 2 },
            F2: { value: 4 },
            D1: { value: 120 },
        },
    };
};

const serializeDrawing = (flangeType: string, face: string | null, response: FlangeLookupResponse): string => {
    const model = createFlangeDrawingModel({
        flangeType,
        face,
        measures: response.measures,
    });
    const document = buildFlangeDrawingVectorDocument(model, response);

    return serializeSvgVectorDocument(document);
};

test("every known flange type serializes with no face and faces A-H without React", () => {
    for (const flangeType of KNOWN_FLANGE_TYPES) {
        const response = createSampleResponse(flangeType);

        for (const face of faceCases) {
            const label = `type ${flangeType}, face ${face ?? "none"}`;
            let svg = "";

            assert.doesNotThrow(() => {
                svg = serializeDrawing(flangeType, face, response);
            }, label);

            assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, `${label} should serialize an SVG root`);
            assert.match(svg, /viewBox="[-\d.]+ [-\d.]+ [\d.]+ [\d.]+"/, `${label} should serialize a viewBox`);
            assert.match(svg, /<defs>[\s\S]*id="type01-hatch"[\s\S]*id="type01-arrowhead-green-rev"[\s\S]*<\/defs>/, `${label} should serialize shared defs`);
            assert.match(svg, /<g>[\s\S]*<(line|rect|path|text)\b/, `${label} should serialize drawable elements`);
            assert.equal(svg.includes("Drawing not implemented"), false, `${label} should not serialize fallback text`);
        }
    }
});

test("unknown flange type serializes the unsupported fallback without React", () => {
    const response: FlangeLookupResponse = {
        count: { value: 8 },
        boltSize: "M20",
        measures: {
            D: { value: 220 },
            K: { value: 180 },
            L: { value: 22 },
            C2: { value: 24 },
            B1: { value: 100 },
        },
    };
    const svg = serializeDrawing("99", null, response);

    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(svg, /viewBox="[-\d.]+ [-\d.]+ [\d.]+ [\d.]+"/);
    assert.match(svg, /<defs>[\s\S]*id="type01-hatch"[\s\S]*<\/defs>/);
    assert.match(svg, /Drawing not implemented for flange type 99\./);
});
