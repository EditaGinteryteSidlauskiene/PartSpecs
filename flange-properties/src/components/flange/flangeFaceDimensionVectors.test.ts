import test from "node:test";
import assert from "node:assert/strict";
import type { FlangeDimensionRails, FlangeFaceProfile } from "./engine/flangeDrawingModel.ts";
import { buildFlangeFaceDimensionVectors } from "./engine/flangeFaceDimensionVectors.ts";
import { getFlangeFaceState } from "./engine/flangeFaceRules.ts";
import type { FlangePositions } from "./engine/flangeGeometry.ts";
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

const createFaceProfile = (overrides: Partial<FlangeFaceProfile>): FlangeFaceProfile => ({
    ...getFlangeFaceState(null),
    annotationScale: 1,
    f1AnnotX: 105,
    f1ExtLeft: 94,
    f1ExtRight: 122,
    f2AnnotX: 88,
    f2GuideUpperStartX: 84,
    f2GuideLowerStartX: 76,
    ...overrides,
});

const textValues = (elements: SvgVectorElement[]) =>
    elements.filter((element) => element.kind === "text").map((element) => element.text);

test("face dimension vectors return no vectors for no-face state", () => {
    const elements = buildFlangeFaceDimensionVectors({
        pos,
        rails,
        faceProfile: createFaceProfile({ isNoFace: true }),
        color: "green",
    });

    assert.deepEqual(elements, []);
});

test("face dimension vectors render F1, D1, and F2 only when enabled", () => {
    const elements = buildFlangeFaceDimensionVectors({
        pos,
        rails,
        faceProfile: createFaceProfile({
            isNoFace: false,
            showsF1: true,
            showsD1: true,
            showsF2: true,
        }),
        color: "green",
    });
    const labels = textValues(elements);

    assert.equal(elements.every((element) => element.layer === "dimension"), true);
    assert.ok(labels.includes("F1"));
    assert.ok(labels.includes("D1"));
    assert.equal(labels.filter((label) => label === "F2").length, 2);
});

test("face dimension vectors omit disabled face dimensions", () => {
    const elements = buildFlangeFaceDimensionVectors({
        pos,
        rails,
        faceProfile: createFaceProfile({
            isNoFace: false,
            showsF1: false,
            showsD1: true,
            showsF2: false,
        }),
        color: "green",
    });
    const labels = textValues(elements);

    assert.equal(labels.includes("F1"), false);
    assert.ok(labels.includes("D1"));
    assert.equal(labels.includes("F2"), false);
});
