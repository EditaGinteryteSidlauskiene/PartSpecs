import test from "node:test";
import assert from "node:assert/strict";
import { buildFlangeNeckVectors } from "./engine/flangeNeckVectors.ts";
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

const byRole = (elements: SvgVectorElement[], role: string) => elements.filter((element) => element.role === role);

test("none neck mode builds no vectors", () => {
    const elements = buildFlangeNeckVectors({ neckKind: "none", halfSection, pos });

    assert.deepEqual(elements, []);
});

test("flatLine neck mode builds a tagged flat neck line", () => {
    const elements = buildFlangeNeckVectors({ neckKind: "flatLine", halfSection, pos });

    assert.equal(elements.length, 1);
    assert.equal(elements[0]?.layer, "neck");
    assert.equal(elements[0]?.role, "flatNeckLine");
    assert.equal(elements[0]?.kind, "line");
});

test("weldingNeck mode builds tagged neck fill, contour, top, and bore-wall vectors", () => {
    const elements = buildFlangeNeckVectors({ neckKind: "weldingNeck", halfSection, pos });

    assert.equal(elements.every((element) => element.layer === "neck"), true);
    assert.equal(elements.every((element) => element.role), true);
    assert.equal(byRole(elements, "neckFill").length, 1);
    assert.equal(byRole(elements, "neckOuterContour").length, 1);
    assert.equal(byRole(elements, "neckTopBoreOpening").length, 1);
    assert.equal(byRole(elements, "neckTopEndFace").length, 1);
    assert.equal(byRole(elements, "neckBoreWall").length, 1);
    assert.equal(byRole(elements, "neckFill")[0]?.kind, "path");
    assert.equal(byRole(elements, "neckOuterContour")[0]?.kind, "path");
    assert.equal(byRole(elements, "neckTopBoreOpening")[0]?.kind, "line");
    assert.equal(byRole(elements, "neckTopEndFace")[0]?.kind, "line");
    assert.equal(byRole(elements, "neckBoreWall")[0]?.kind, "line");
});
