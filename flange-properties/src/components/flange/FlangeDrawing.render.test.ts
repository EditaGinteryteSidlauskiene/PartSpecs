import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FlangeDrawing from "./FlangeDrawing.tsx";
import { createFlangeDrawingModel } from "./flangeDrawingModel.ts";
import { FACE_LETTERS } from "./flangeFaceRules.ts";
import type { FlangeLookupResponse } from "./flangeMeasures.ts";
import { getFlangeTypeDefinition, KNOWN_FLANGE_TYPES, type FlangeTypeCode } from "./flangeTypes.ts";

const fallbackMessage = "Drawing not implemented";
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

const renderDrawing = (flangeType: string, face: string | null, response: FlangeLookupResponse) => {
    const model = createFlangeDrawingModel({
        flangeType,
        face,
        measures: response.measures,
    });

    return renderToStaticMarkup(createElement(FlangeDrawing, { model, response, availableHeight: 250 }));
};

test("every known flange type renders with no face and faces A-H", () => {
    for (const flangeType of KNOWN_FLANGE_TYPES) {
        const response = createSampleResponse(flangeType);

        for (const face of faceCases) {
            const label = `type ${flangeType}, face ${face ?? "none"}`;
            let markup = "";

            assert.doesNotThrow(() => {
                markup = renderDrawing(flangeType, face, response);
            }, label);

            assert.equal(markup.includes(fallbackMessage), false, `${label} should render the supported drawing`);
            assert.match(markup, /<svg/, `${label} should produce SVG markup`);
        }
    }
});

test("unknown flange type renders the unsupported fallback message", () => {
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

    let markup = "";

    assert.doesNotThrow(() => {
        markup = renderDrawing("99", null, response);
    });

    assert.match(markup, /Drawing not implemented for flange type 99/);
});
