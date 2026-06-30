import test from "node:test";
import assert from "node:assert/strict";
import type { FlangeDimensionRails, FlangeFaceProfile, FlangeHalfSectionAnchors } from "./engine/flangeDrawingModel.ts";
import { buildFlangeType11DimensionVectors } from "./engine/flangeType11DimensionVectors.ts";
import type { FlangePositions } from "./engine/flangeGeometry.ts";
import type { FlangeMeasures } from "./engine/flangeMeasures.ts";
import { getFlangeFaceState } from "./engine/flangeFaceRules.ts";
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
        pipeBore: 32,
        neckOuter: 17,
        boltCircle: 2,
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
        totalHeight: 210,
        totalHeightText: 222,
    },
};

const faceProfile: FlangeFaceProfile = {
    ...getFlangeFaceState(null),
    annotationScale: 1,
    f1AnnotX: 0,
    f1ExtLeft: 0,
    f1ExtRight: 0,
    f2AnnotX: 0,
    f2GuideUpperStartX: 0,
    f2GuideLowerStartX: 0,
};

const measures: FlangeMeasures = {
    A: { value: 100 },
    S: { value: 8 },
    R1: { value: 6 },
    H3: { value: 12 },
    N1: { value: 128 },
    H2: { value: 100 },
};

const textValues = (elements: SvgVectorElement[]) =>
    elements.filter((element) => element.kind === "text").map((element) => element.text);

test("type 11 dimension vectors include A, S, R1, H3, N1, and H2 labels", () => {
    const elements = buildFlangeType11DimensionVectors({
        measures,
        typeDefinition: getFlangeTypeDefinition("11"),
        halfSection,
        pos,
        rails,
        faceProfile,
        cLowerLineY: 132,
        color: "green",
    });
    const labels = textValues(elements);

    assert.equal(elements.every((element) => element.layer === "dimension"), true);
    assert.ok(labels.includes("⌀100"));
    assert.ok(labels.includes("8"));
    assert.ok(labels.includes(6));
    assert.ok(labels.includes(12));
    assert.ok(labels.includes("⌀128"));
    assert.ok(labels.includes("100"));
});
