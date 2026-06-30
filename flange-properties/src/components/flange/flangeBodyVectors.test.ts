import test from "node:test";
import assert from "node:assert/strict";
import { buildFlangeBodyVectors } from "./engine/flangeBodyVectors.ts";
import type { FlangeHalfSectionAnchors } from "./engine/flangeDrawingModel.ts";
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

const roles = (elements: SvgVectorElement[]) => new Set(elements.map((element) => element.role));
const byRole = (elements: SvgVectorElement[], role: string) => elements.filter((element) => element.role === role);

test("standardHalfBody builds tagged body vectors with semantic roles", () => {
    const elements = buildFlangeBodyVectors({
        bodyKind: "standardHalfBody",
        lightningStart: "topY",
        halfSection,
    });
    const elementRoles = roles(elements);

    assert.ok(elements.length > 0);
    assert.equal(elements.every((element) => element.layer === "body"), true);
    assert.equal(elements.every((element) => element.role), true);
    assert.equal(byRole(elements, "hubFill").length, 1);
    assert.equal(byRole(elements, "boreWall").length, 1);
    assert.equal(byRole(elements, "breakLine").length, 2);
    assert.equal(byRole(elements, "boltZone").length, 5);
    assert.equal(byRole(elements, "boltCenterLine").length, 1);
    assert.equal(byRole(elements, "outerRim").length, 3);
    assert.equal(byRole(elements, "outerEdge").length, 1);
    assert.equal(elementRoles.has("boreOpening"), true);
    assert.equal(byRole(elements, "boreWall")[0]?.kind, "line");
    assert.equal(byRole(elements, "breakLine").every((element) => element.kind === "path"), true);
});

test("blindHalfBody builds the blind body mode without standard bore-wall vectors", () => {
    const elements = buildFlangeBodyVectors({
        bodyKind: "blindHalfBody",
        lightningStart: "topY",
        halfSection,
    });

    assert.equal(elements.every((element) => element.layer === "body"), true);
    assert.equal(byRole(elements, "hubFill").length, 1);
    assert.equal(byRole(elements, "breakLine").length, 2);
    assert.equal(byRole(elements, "boreWall").length, 0);
    assert.equal(byRole(elements, "boreOpening").length, 0);
    assert.equal(byRole(elements, "boltZone").length, 5);
    assert.equal(byRole(elements, "boltCenterLine").length, 1);
    assert.equal(byRole(elements, "outerRim").length, 3);
    assert.equal(byRole(elements, "outerEdge").length, 1);
    assert.equal(byRole(elements, "breakLine").every((element) => element.kind === "path"), true);
});
