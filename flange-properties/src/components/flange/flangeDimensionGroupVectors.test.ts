import test from "node:test";
import assert from "node:assert/strict";
import {
    buildFlangeDimensionVectors,
    getActiveDimensionGroups,
} from "./engine/flangeDimensionGroupVectors.ts";
import type { FlangeDimensionRails, FlangeFaceProfile, FlangeHalfSectionAnchors } from "./engine/flangeDrawingModel.ts";
import { getFlangeFaceState } from "./engine/flangeFaceRules.ts";
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

const createFaceProfile = (face: string | null): FlangeFaceProfile => ({
    ...getFlangeFaceState(face),
    annotationScale: 1,
    f1AnnotX: 105,
    f1ExtLeft: 94,
    f1ExtRight: 122,
    f2AnnotX: 88,
    f2GuideUpperStartX: 84,
    f2GuideLowerStartX: 76,
});

const response: FlangeLookupResponse = {
    count: { value: 4 },
    boltSize: "M16",
    measures: {
        D: { value: 165 },
        K: { value: 125 },
        L: { value: 18 },
        B1: { value: 100 },
        C1: { value: 18 },
        C2: { value: 22 },
        A: { value: 90 },
        S: { value: 8 },
        R1: { value: 6 },
        H3: { value: 12 },
        N1: { value: 128 },
        H2: { value: 120 },
    },
};

const textValues = (elements: SvgVectorElement[]) =>
    elements.filter((element) => element.kind === "text").map((element) => element.text);

test("active dimension groups come from type definition first and face profile second", () => {
    assert.deepEqual(
        getActiveDimensionGroups(getFlangeTypeDefinition("01"), createFaceProfile(null)),
        ["common"]
    );

    assert.deepEqual(
        getActiveDimensionGroups(getFlangeTypeDefinition("11"), createFaceProfile("G")),
        ["common", "type11", "face"]
    );
});

test("combined dimension vectors render only common dimensions for a flat no-face flange", () => {
    const elements = buildFlangeDimensionVectors({
        response,
        typeDefinition: getFlangeTypeDefinition("01"),
        halfSection,
        pos,
        rails,
        faceProfile: createFaceProfile(null),
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
    assert.equal(labels.includes("F1"), false);
    assert.equal(labels.includes("D1"), false);
    assert.equal(labels.includes("F2"), false);
    assert.equal(labels.includes("⌀128"), false);
});

test("combined dimension vectors preserve common, type, then face dimension order", () => {
    const elements = buildFlangeDimensionVectors({
        response,
        typeDefinition: getFlangeTypeDefinition("11"),
        halfSection,
        pos,
        rails,
        faceProfile: createFaceProfile("G"),
        color: "green",
    });
    const labels = textValues(elements);

    const commonIndex = labels.indexOf("4×⌀18");
    const typeIndex = labels.indexOf("⌀90");
    const faceIndex = labels.indexOf("F1");

    assert.ok(commonIndex >= 0);
    assert.ok(typeIndex > commonIndex);
    assert.ok(faceIndex > typeIndex);
    assert.ok(labels.includes("⌀128"));
    assert.ok(labels.includes("8"));
    assert.ok(labels.includes(6));
    assert.ok(labels.includes(12));
    assert.ok(labels.includes("120"));
    assert.ok(labels.includes("D1"));
    assert.equal(labels.filter((label) => label === "F2").length, 2);
});
