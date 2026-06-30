import test from "node:test";
import assert from "node:assert/strict";
import { createFlangeDrawingModel } from "./engine/flangeDrawingModel.ts";

const buildMeasures = (extra: Record<string, { value: number }> = {}) => ({
    D: { value: 220 },
    K: { value: 180 },
    L: { value: 22 },
    C1: { value: 18 },
    C2: { value: 24 },
    C3: { value: 22 },
    C4: { value: 20 },
    B1: { value: 100 },
    A: { value: 100 },
    S: { value: 8 },
    R1: { value: 6 },
    H2: { value: 100 },
    H3: { value: 12 },
    N1: { value: 128 },
    ...extra,
});

test("type 01 with no face resolves the supported model pieces", () => {
    const model = createFlangeDrawingModel({ flangeType: "01", face: null, measures: buildMeasures() });

    assert.equal(model.flangeType, "01");
    assert.equal(model.face, null);
    assert.equal(model.typeDefinition?.type, "01");
    assert.equal(model.faceState.isNoFace, true);
    assert.equal(model.faceState.renderingMode, "noFace");
    assert.ok(model.halfSection);
    assert.ok(model.rails);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
    assert.equal(model.rails.top.pipeBore, undefined);
    assert.equal(model.rails.right.totalHeight, undefined);
});

test("type 02 with face C resolves supported flat model pieces", () => {
    const model = createFlangeDrawingModel({ flangeType: "02", face: "C", measures: buildMeasures() });

    assert.equal(model.flangeType, "02");
    assert.equal(model.typeDefinition?.type, "02");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.deepEqual(model.typeDefinition?.dimensionGroups, ["common"]);
    assert.equal(model.typeDefinition?.showCommonBoreDiameter, true);
    assert.deepEqual(model.typeDefinition?.thicknessKeys, ["C2"]);
    assert.equal(model.faceState.renderingMode, "grooveFace");
    assert.equal(model.faceState.showsF2, true);
    assert.ok(model.halfSection.breakLineX < model.halfSection.outerEdgeX);
    assert.ok(model.halfSection.boreWallX < model.halfSection.outerEdgeX);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
    assert.equal(model.rails.top.pipeBore, undefined);
    assert.equal(model.rails.right.totalHeight, undefined);
});

test("type 04 with face G resolves supported flat model pieces", () => {
    const model = createFlangeDrawingModel({ flangeType: "04", face: "G", measures: buildMeasures() });

    assert.equal(model.flangeType, "04");
    assert.equal(model.typeDefinition?.type, "04");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.deepEqual(model.typeDefinition?.dimensionGroups, ["common"]);
    assert.equal(model.typeDefinition?.showCommonBoreDiameter, true);
    assert.deepEqual(model.typeDefinition?.thicknessKeys, ["C3"]);
    assert.equal(model.faceState.renderingMode, "grooveFace");
    assert.equal(model.faceState.showsF1, true);
    assert.equal(model.faceState.showsD1, true);
    assert.equal(model.faceState.showsF2, true);
    assert.ok(model.halfSection.breakLineX < model.halfSection.outerEdgeX);
    assert.ok(model.halfSection.boreWallX < model.halfSection.outerEdgeX);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
    assert.equal(model.rails.top.pipeBore, undefined);
    assert.equal(model.rails.right.totalHeight, undefined);
});

test("type 05 with face B resolves blind body and face metadata", () => {
    const model = createFlangeDrawingModel({ flangeType: "05", face: "B", measures: buildMeasures() });

    assert.equal(model.typeDefinition?.type, "05");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.equal(model.faceState.renderingMode, "raisedFace");
    assert.equal(model.faceState.showsF1, true);
    assert.equal(model.faceState.showsD1, true);
    assert.equal(model.halfSection.breakLineX < model.halfSection.outerEdgeX, true);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
    assert.equal(model.rails.right.totalHeight, undefined);
});

test("type 11 with face H resolves welding-neck geometry", () => {
    const model = createFlangeDrawingModel({ flangeType: "11", face: "H", measures: buildMeasures() });

    assert.equal(model.typeDefinition?.type, "11");
    assert.equal(model.typeDefinition?.neckKind, "weldingNeck");
    assert.equal(model.faceState.renderingMode, "ringJointFace");
    assert.equal(model.faceState.showsF1, false);
    assert.equal(model.faceState.showsF2, false);
    assert.ok(model.rails.top.pipeBore !== undefined);
    assert.ok(model.rails.top.neckOuter !== undefined);
    assert.ok(model.rails.right.totalHeight !== undefined);
    assert.ok(model.rails.right.totalHeightText !== undefined);
    assert.ok(model.halfSection.neckTopY < model.halfSection.topY);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
});

test("type 12 with face E resolves supported necked geometry", () => {
    const model = createFlangeDrawingModel({ flangeType: "12", face: "E", measures: buildMeasures() });

    assert.equal(model.typeDefinition?.type, "12");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.equal(model.typeDefinition?.bodyKind, "standardHalfBody");
    assert.equal(model.typeDefinition?.neckKind, "weldingNeck");
    assert.deepEqual(model.typeDefinition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(model.typeDefinition?.thicknessKeys, ["C2"]);
    assert.equal(model.faceState.renderingMode, "raisedFace");
    assert.equal(model.faceState.showsF2, true);
    assert.ok(model.rails.top.pipeBore !== undefined);
    assert.ok(model.rails.top.neckOuter !== undefined);
    assert.ok(model.rails.right.totalHeight !== undefined);
    assert.ok(model.rails.right.totalHeightText !== undefined);
    assert.ok(model.halfSection.neckTopY < model.halfSection.topY);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
});

test("type 13 with face F resolves supported necked geometry", () => {
    const model = createFlangeDrawingModel({ flangeType: "13", face: "F", measures: buildMeasures() });

    assert.equal(model.typeDefinition?.type, "13");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.equal(model.typeDefinition?.bodyKind, "standardHalfBody");
    assert.equal(model.typeDefinition?.neckKind, "weldingNeck");
    assert.deepEqual(model.typeDefinition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(model.typeDefinition?.thicknessKeys, ["C2"]);
    assert.equal(model.faceState.renderingMode, "grooveFace");
    assert.equal(model.faceState.showsF1, true);
    assert.ok(model.rails.top.pipeBore !== undefined);
    assert.ok(model.rails.top.neckOuter !== undefined);
    assert.ok(model.rails.right.totalHeight !== undefined);
    assert.ok(model.rails.right.totalHeightText !== undefined);
    assert.ok(model.halfSection.neckTopY < model.halfSection.topY);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
});

test("type 21 with face D resolves supported necked geometry", () => {
    const model = createFlangeDrawingModel({ flangeType: "21", face: "D", measures: buildMeasures() });

    assert.equal(model.typeDefinition?.type, "21");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.equal(model.typeDefinition?.bodyKind, "standardHalfBody");
    assert.equal(model.typeDefinition?.neckKind, "weldingNeck");
    assert.deepEqual(model.typeDefinition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(model.typeDefinition?.thicknessKeys, ["C2"]);
    assert.equal(model.faceState.renderingMode, "steppedFace");
    assert.equal(model.faceState.showsF1, true);
    assert.ok(model.rails.top.pipeBore !== undefined);
    assert.ok(model.rails.top.neckOuter !== undefined);
    assert.ok(model.rails.right.totalHeight !== undefined);
    assert.ok(model.rails.right.totalHeightText !== undefined);
    assert.ok(model.halfSection.neckTopY < model.halfSection.topY);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
});

test("type 32 with face B resolves supported necked geometry", () => {
    const model = createFlangeDrawingModel({ flangeType: "32", face: "B", measures: buildMeasures() });

    assert.equal(model.typeDefinition?.type, "32");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.equal(model.typeDefinition?.bodyKind, "standardHalfBody");
    assert.equal(model.typeDefinition?.neckKind, "weldingNeck");
    assert.deepEqual(model.typeDefinition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(model.typeDefinition?.thicknessKeys, ["C2"]);
    assert.equal(model.faceState.renderingMode, "raisedFace");
    assert.equal(model.faceState.showsF1, true);
    assert.equal(model.faceState.showsD1, true);
    assert.ok(model.rails.top.pipeBore !== undefined);
    assert.ok(model.rails.top.neckOuter !== undefined);
    assert.ok(model.rails.right.totalHeight !== undefined);
    assert.ok(model.rails.right.totalHeightText !== undefined);
    assert.ok(model.halfSection.neckTopY < model.halfSection.topY);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
});

test("type 33 with face C resolves supported necked geometry", () => {
    const model = createFlangeDrawingModel({ flangeType: "33", face: "C", measures: buildMeasures() });

    assert.equal(model.typeDefinition?.type, "33");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.equal(model.typeDefinition?.bodyKind, "standardHalfBody");
    assert.equal(model.typeDefinition?.neckKind, "weldingNeck");
    assert.deepEqual(model.typeDefinition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(model.typeDefinition?.thicknessKeys, ["C2"]);
    assert.equal(model.faceState.renderingMode, "grooveFace");
    assert.equal(model.faceState.showsF2, true);
    assert.ok(model.rails.top.pipeBore !== undefined);
    assert.ok(model.rails.top.neckOuter !== undefined);
    assert.ok(model.rails.right.totalHeight !== undefined);
    assert.ok(model.rails.right.totalHeightText !== undefined);
    assert.ok(model.halfSection.neckTopY < model.halfSection.topY);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
});

test("type 34 with face G resolves supported necked geometry", () => {
    const model = createFlangeDrawingModel({ flangeType: "34", face: "G", measures: buildMeasures() });

    assert.equal(model.typeDefinition?.type, "34");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.equal(model.typeDefinition?.bodyKind, "standardHalfBody");
    assert.equal(model.typeDefinition?.neckKind, "weldingNeck");
    assert.deepEqual(model.typeDefinition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(model.typeDefinition?.thicknessKeys, ["C2"]);
    assert.equal(model.faceState.renderingMode, "grooveFace");
    assert.equal(model.faceState.showsF1, true);
    assert.equal(model.faceState.showsD1, true);
    assert.equal(model.faceState.showsF2, true);
    assert.ok(model.rails.top.pipeBore !== undefined);
    assert.ok(model.rails.top.neckOuter !== undefined);
    assert.ok(model.rails.right.totalHeight !== undefined);
    assert.ok(model.rails.right.totalHeightText !== undefined);
    assert.ok(model.halfSection.neckTopY < model.halfSection.topY);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
});

test("type 35 with face E resolves supported necked geometry", () => {
    const model = createFlangeDrawingModel({ flangeType: "35", face: "E", measures: buildMeasures() });

    assert.equal(model.typeDefinition?.type, "35");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.equal(model.typeDefinition?.bodyKind, "standardHalfBody");
    assert.equal(model.typeDefinition?.neckKind, "weldingNeck");
    assert.deepEqual(model.typeDefinition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(model.typeDefinition?.thicknessKeys, ["C2"]);
    assert.equal(model.faceState.renderingMode, "raisedFace");
    assert.equal(model.faceState.showsF2, true);
    assert.ok(model.rails.top.pipeBore !== undefined);
    assert.ok(model.rails.top.neckOuter !== undefined);
    assert.ok(model.rails.right.totalHeight !== undefined);
    assert.ok(model.rails.right.totalHeightText !== undefined);
    assert.ok(model.halfSection.neckTopY < model.halfSection.topY);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
});

test("type 36 with face H resolves supported necked geometry", () => {
    const model = createFlangeDrawingModel({ flangeType: "36", face: "H", measures: buildMeasures() });

    assert.equal(model.typeDefinition?.type, "36");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.equal(model.typeDefinition?.bodyKind, "standardHalfBody");
    assert.equal(model.typeDefinition?.neckKind, "weldingNeck");
    assert.deepEqual(model.typeDefinition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(model.typeDefinition?.thicknessKeys, ["C2"]);
    assert.equal(model.faceState.renderingMode, "ringJointFace");
    assert.ok(model.rails.top.pipeBore !== undefined);
    assert.ok(model.rails.top.neckOuter !== undefined);
    assert.ok(model.rails.right.totalHeight !== undefined);
    assert.ok(model.rails.right.totalHeightText !== undefined);
    assert.ok(model.halfSection.neckTopY < model.halfSection.topY);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
});

test("type 37 with face A resolves supported necked geometry", () => {
    const model = createFlangeDrawingModel({ flangeType: "37", face: "A", measures: buildMeasures() });

    assert.equal(model.typeDefinition?.type, "37");
    assert.equal(model.typeDefinition?.isSupportedForDrawing, true);
    assert.equal(model.typeDefinition?.bodyKind, "standardHalfBody");
    assert.equal(model.typeDefinition?.neckKind, "weldingNeck");
    assert.deepEqual(model.typeDefinition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(model.typeDefinition?.thicknessKeys, ["C2"]);
    assert.equal(model.faceState.renderingMode, "flatFace");
    assert.ok(model.rails.top.pipeBore !== undefined);
    assert.ok(model.rails.top.neckOuter !== undefined);
    assert.ok(model.rails.right.totalHeight !== undefined);
    assert.ok(model.rails.right.totalHeightText !== undefined);
    assert.ok(model.halfSection.neckTopY < model.halfSection.topY);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
});

test("unknown type 99 resolves fallback model state without a type definition", () => {
    const model = createFlangeDrawingModel({ flangeType: "99", face: null, measures: buildMeasures() });

    assert.equal(model.flangeType, "99");
    assert.equal(model.typeDefinition, undefined);
    assert.equal(model.faceState.isNoFace, true);
    assert.equal(model.faceState.renderingMode, "noFace");
    assert.ok(model.halfSection);
    assert.ok(model.rails);
    assert.ok(model.bounds.width > 0);
    assert.ok(model.bounds.height > 0);
});
