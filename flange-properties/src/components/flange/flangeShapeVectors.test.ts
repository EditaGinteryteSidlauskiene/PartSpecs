import test from "node:test";
import assert from "node:assert/strict";
import { getFlangeFaceState } from "./engine/flangeFaceRules.ts";
import type { FlangeHalfSectionAnchors } from "./engine/flangeDrawingModel.ts";
import type { FlangePositions } from "./engine/flangeGeometry.ts";
import { buildFlangeShapeVectors } from "./engine/flangeShapeVectors.ts";
import { getFlangeTypeDefinition } from "./engine/flangeTypes.ts";

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

test("shape vectors are composed in neck, body, face order", () => {
    const elements = buildFlangeShapeVectors({
        typeDefinition: getFlangeTypeDefinition("11"),
        faceState: getFlangeFaceState("B"),
        halfSection,
        pos,
    });
    const layers = elements.map((element) => element.layer);
    const firstNeck = layers.indexOf("neck");
    const firstBody = layers.indexOf("body");
    const firstFace = layers.indexOf("face");
    const lastNeck = layers.lastIndexOf("neck");
    const lastBody = layers.lastIndexOf("body");

    assert.ok(firstNeck >= 0);
    assert.ok(firstBody > firstNeck);
    assert.ok(firstFace > firstBody);
    assert.ok(lastNeck < firstBody);
    assert.ok(lastBody < firstFace);
});

test("shape vectors include blind-body face fill behavior from the type definition", () => {
    const elements = buildFlangeShapeVectors({
        typeDefinition: getFlangeTypeDefinition("05"),
        faceState: getFlangeFaceState("B"),
        halfSection,
        pos,
    });
    const raisedFaceFills = elements.filter((element) => element.layer === "face" && element.role === "raisedFaceFill");

    assert.equal(raisedFaceFills.length, 2);
    assert.equal(raisedFaceFills.every((element) => element.kind === "rect"), true);
});
