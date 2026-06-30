import test from "node:test";
import assert from "node:assert/strict";
import { buildFlangeCommonDimensionVectors } from "./engine/flangeCommonDimensionVectors.ts";
import type { FlangeDimensionRails, FlangeHalfSectionAnchors } from "./engine/flangeDrawingModel.ts";
import type { FlangePositions } from "./engine/flangeGeometry.ts";
import type { FlangeLookupResponse } from "./engine/flangeMeasures.ts";
import { getFlangeTypeDefinition } from "./engine/flangeTypes.ts";
import type { SvgVectorElement } from "./engine/svgVectorTypes.ts";

const pos: FlangePositions = {
    centerX: 141,
    topY: 100,
    bottomY: 132,
    outerLeft: 20,
    outerRight: 180,
    boltOuterLeft: 30,
    boltOuterRight: 155,
    boltCenterLeft: 40,
    boltCenterRight: 145,
    hubLeft: 52,
    hubRight: 120,
    hubFaceLeft: 61,
    hubFaceRight: 92,
    hubNeckLeft: 68,
    hubNeckRight: 85,
    boreLeft: 45,
    boreRight: 70,
    hubFaceWidth: 16,
    neckTopY: 58,
    neckWall: 8,
    boreDisplayRadius: 50,
};

const halfSection: FlangeHalfSectionAnchors = {
    breakLineX: 55,
    boreWallX: 70,
    hubFaceX: 92,
    hubNeckX: 85,
    hubOuterX: 120,
    boltCenterX: 145,
    boltOuterX: 155,
    outerEdgeX: 180,
    topY: 100,
    bottomY: 132,
    neckTopY: 58,
    neckBoreWallX: 78,
    neckOuterX: 112,
};

const rails: FlangeDimensionRails = {
    top: {
        boltCircle: 88,
    },
    bottom: {
        boltHoleText: 142,
        boltHoleArrow: 144,
        boltSizeText: 154,
        boreDiameter: 150,
        outerDiameter: 164,
        faceLabel: 147,
        faceDiameter: 155,
    },
    right: {
        thickness: 190,
        thicknessText: 198,
    },
};

const response: FlangeLookupResponse = {
    count: { value: 4 },
    boltSize: "M16",
    measures: {
        D: { value: 165 },
        K: { value: 125 },
        L: { value: 18 },
        B1: { value: 100 },
        C1: { value: 18 },
        C4: { value: 22 },
    },
};

const textValues = (elements: SvgVectorElement[]) =>
    elements.filter((element) => element.kind === "text").map((element) => element.text);

test("common dimension vectors include bolt hole, K, bore, D, and C dimensions", () => {
    const elements = buildFlangeCommonDimensionVectors({
        response,
        typeDefinition: getFlangeTypeDefinition("01"),
        halfSection,
        pos,
        rails,
        cLowerLineY: 132,
        color: "green",
    });
    const labels = textValues(elements);

    assert.equal(elements.every((element) => element.layer === "dimension"), true);
    assert.ok(labels.includes("4×⌀18"));
    assert.ok(labels.includes("M16"));
    assert.ok(labels.includes("⌀125"));
    assert.ok(labels.includes("⌀100"));
    assert.ok(labels.includes("⌀165"));
    assert.ok(labels.includes("18"));
});

test("common dimension vectors hide bore diameter when the type definition disables it", () => {
    const elements = buildFlangeCommonDimensionVectors({
        response,
        typeDefinition: getFlangeTypeDefinition("05"),
        halfSection,
        pos,
        rails,
        cLowerLineY: 132,
        color: "green",
    });
    const labels = textValues(elements);

    assert.equal(labels.includes("⌀100"), false);
    assert.ok(labels.includes("22"));
    assert.ok(labels.includes("⌀165"));
});
