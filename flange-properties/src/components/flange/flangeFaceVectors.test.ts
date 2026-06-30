import test from "node:test";
import assert from "node:assert/strict";
import { buildFlangeFaceVectors } from "./engine/flangeFaceVectors.ts";
import type { FlangeFaceRenderingMode } from "./engine/flangeFaceRules.ts";
import type { FlangeHalfSectionAnchors } from "./engine/flangeDrawingModel.ts";
import type { FlangePositions } from "./engine/flangeGeometry.ts";
import type { SvgVectorElement } from "./engine/svgVectorTypes.ts";

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

const build = (renderingMode: FlangeFaceRenderingMode, usesBlindBodyFaceFill = false) =>
    buildFlangeFaceVectors({ renderingMode, halfSection, pos, usesBlindBodyFaceFill });

const byRole = (elements: SvgVectorElement[], role: string) => elements.filter((element) => element.role === role);

test("noFace builds the flat face line role", () => {
    const elements = build("noFace");

    assert.equal(elements.length, 1);
    assert.equal(elements[0]?.layer, "face");
    assert.equal(elements[0]?.role, "flatFaceLine");
    assert.equal(elements[0]?.kind, "line");
});

test("flatFace builds the flat face line role", () => {
    const elements = build("flatFace");

    assert.equal(elements.length, 1);
    assert.equal(elements[0]?.layer, "face");
    assert.equal(elements[0]?.role, "flatFaceLine");
    assert.equal(elements[0]?.kind, "line");
});

test("raisedFace builds fill and contour vectors", () => {
    const elements = build("raisedFace");

    assert.equal(elements.every((element) => element.layer === "face"), true);
    assert.equal(byRole(elements, "raisedFaceFill").length, 1);
    assert.equal(byRole(elements, "raisedFaceContour").length, 5);
    assert.equal(byRole(elements, "raisedFaceFill")[0]?.kind, "rect");
});

test("raisedFace blind-body mode adds the blind fill and removes bore-wall contours", () => {
    const elements = build("raisedFace", true);

    assert.equal(byRole(elements, "raisedFaceFill").length, 2);
    assert.equal(byRole(elements, "raisedFaceContour").length, 3);
    assert.equal(byRole(elements, "raisedFaceFill").every((element) => element.kind === "rect"), true);
});

test("grooveFace builds groove fill and contour vectors", () => {
    const elements = build("grooveFace");

    assert.equal(elements.every((element) => element.layer === "face"), true);
    assert.equal(byRole(elements, "grooveFaceFill").length, 1);
    assert.equal(byRole(elements, "grooveFaceContour").length, 5);
    assert.equal(byRole(elements, "grooveFaceFill")[0]?.kind, "rect");
});

test("steppedFace builds stepped contour vectors", () => {
    const elements = build("steppedFace");

    assert.equal(elements.every((element) => element.layer === "face"), true);
    assert.equal(byRole(elements, "steppedFaceContour").length, 8);
    assert.equal(byRole(elements, "steppedFaceFill").length, 0);
});

test("steppedFace blind-body mode adds stepped fill", () => {
    const elements = build("steppedFace", true);

    assert.equal(byRole(elements, "steppedFaceFill").length, 1);
    assert.equal(byRole(elements, "steppedFaceContour").length, 6);
    assert.equal(byRole(elements, "steppedFaceFill")[0]?.kind, "rect");
});

test("ringJointFace builds fill, arc, and contour vectors", () => {
    const elements = build("ringJointFace");

    assert.equal(elements.every((element) => element.layer === "face"), true);
    assert.equal(byRole(elements, "ringJointFill").length, 1);
    assert.equal(byRole(elements, "ringJointArc").length, 1);
    assert.equal(byRole(elements, "ringJointContour").length, 5);
    assert.equal(byRole(elements, "ringJointFill")[0]?.kind, "rect");
    assert.equal(byRole(elements, "ringJointArc")[0]?.kind, "path");
});
