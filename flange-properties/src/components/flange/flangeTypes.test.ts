import test from "node:test";
import assert from "node:assert/strict";
import { getFlangeTypeDefinition } from "./flangeTypes.ts";

test("type 01 resolves the supported drawing behavior", () => {
    const definition = getFlangeTypeDefinition("01");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "flatLine");
    assert.equal(definition?.showCommonBoreDiameter, true);
    assert.equal(definition?.showType11DimensionGroup, false);
    assert.deepEqual(definition?.dimensionGroups, ["common"]);
    assert.deepEqual(definition?.thicknessKeys, ["C1"]);
    assert.deepEqual(definition?.boreDiameterKeys, ["B1", "B2", "B3", "4", "5", "6"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, false);
});

test("type 02 resolves the supported flat bored drawing behavior", () => {
    const definition = getFlangeTypeDefinition("02");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "flatLine");
    assert.equal(definition?.showCommonBoreDiameter, true);
    assert.equal(definition?.showType11DimensionGroup, false);
    assert.deepEqual(definition?.dimensionGroups, ["common"]);
    assert.deepEqual(definition?.thicknessKeys, ["C2"]);
    assert.deepEqual(definition?.boreDiameterKeys, ["B1", "B2", "B3", "4", "5", "6"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, false);
});

test("type 04 resolves the supported flat bored drawing behavior", () => {
    const definition = getFlangeTypeDefinition("04");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "flatLine");
    assert.equal(definition?.showCommonBoreDiameter, true);
    assert.equal(definition?.showType11DimensionGroup, false);
    assert.deepEqual(definition?.dimensionGroups, ["common"]);
    assert.deepEqual(definition?.thicknessKeys, ["C3"]);
    assert.deepEqual(definition?.boreDiameterKeys, ["B1", "B2", "B3", "4", "5", "6"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, false);
});

test("type 05 resolves the blind body behavior", () => {
    const definition = getFlangeTypeDefinition("05");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "blindHalfBody");
    assert.equal(definition?.neckKind, "flatLine");
    assert.equal(definition?.showCommonBoreDiameter, false);
    assert.equal(definition?.showType11DimensionGroup, false);
    assert.deepEqual(definition?.dimensionGroups, ["common"]);
    assert.deepEqual(definition?.thicknessKeys, ["C4"]);
    assert.equal(definition?.hasBore, false);
    assert.equal(definition?.hasNeck, false);
});

test("type 11 resolves the welding-neck behavior", () => {
    const definition = getFlangeTypeDefinition("11");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "weldingNeck");
    assert.equal(definition?.lightningStart, "neckTopY");
    assert.equal(definition?.showCommonBoreDiameter, false);
    assert.equal(definition?.showType11DimensionGroup, true);
    assert.deepEqual(definition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(definition?.thicknessKeys, ["C2"]);
    assert.deepEqual(definition?.neckPipeBoreKeys, ["A", "1"]);
    assert.deepEqual(definition?.neckOuterKeys, ["N1"]);
    assert.deepEqual(definition?.neckWallKeys, ["S"]);
    assert.deepEqual(definition?.neckStepKeys, ["H3"]);
    assert.deepEqual(definition?.neckTotalHeightKeys, ["H2"]);
    assert.deepEqual(definition?.radiusKeys, ["R1"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, true);
});

test("type 12 resolves the supported necked drawing behavior", () => {
    const definition = getFlangeTypeDefinition("12");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "weldingNeck");
    assert.equal(definition?.lightningStart, "neckTopY");
    assert.equal(definition?.showCommonBoreDiameter, false);
    assert.equal(definition?.showType11DimensionGroup, true);
    assert.deepEqual(definition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(definition?.thicknessKeys, ["C2"]);
    assert.deepEqual(definition?.neckPipeBoreKeys, ["A", "1"]);
    assert.deepEqual(definition?.neckOuterKeys, ["N1"]);
    assert.deepEqual(definition?.neckWallKeys, ["S"]);
    assert.deepEqual(definition?.neckStepKeys, ["H3"]);
    assert.deepEqual(definition?.neckTotalHeightKeys, ["H2"]);
    assert.deepEqual(definition?.radiusKeys, ["R1"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, true);
});

test("type 13 resolves the supported necked drawing behavior", () => {
    const definition = getFlangeTypeDefinition("13");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "weldingNeck");
    assert.equal(definition?.lightningStart, "neckTopY");
    assert.equal(definition?.showCommonBoreDiameter, false);
    assert.equal(definition?.showType11DimensionGroup, true);
    assert.deepEqual(definition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(definition?.thicknessKeys, ["C2"]);
    assert.deepEqual(definition?.neckPipeBoreKeys, ["A", "1"]);
    assert.deepEqual(definition?.neckOuterKeys, ["N1"]);
    assert.deepEqual(definition?.neckWallKeys, ["S"]);
    assert.deepEqual(definition?.neckStepKeys, ["H3"]);
    assert.deepEqual(definition?.neckTotalHeightKeys, ["H2"]);
    assert.deepEqual(definition?.radiusKeys, ["R1"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, true);
});

test("type 21 resolves the supported necked drawing behavior", () => {
    const definition = getFlangeTypeDefinition("21");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "weldingNeck");
    assert.equal(definition?.lightningStart, "neckTopY");
    assert.equal(definition?.showCommonBoreDiameter, false);
    assert.equal(definition?.showType11DimensionGroup, true);
    assert.deepEqual(definition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(definition?.thicknessKeys, ["C2"]);
    assert.deepEqual(definition?.neckPipeBoreKeys, ["A", "1"]);
    assert.deepEqual(definition?.neckOuterKeys, ["N1"]);
    assert.deepEqual(definition?.neckWallKeys, ["S"]);
    assert.deepEqual(definition?.neckStepKeys, ["H3"]);
    assert.deepEqual(definition?.neckTotalHeightKeys, ["H2"]);
    assert.deepEqual(definition?.radiusKeys, ["R1"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, true);
});

test("type 32 resolves the supported necked drawing behavior", () => {
    const definition = getFlangeTypeDefinition("32");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "weldingNeck");
    assert.equal(definition?.lightningStart, "neckTopY");
    assert.equal(definition?.showCommonBoreDiameter, false);
    assert.equal(definition?.showType11DimensionGroup, true);
    assert.deepEqual(definition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(definition?.thicknessKeys, ["C2"]);
    assert.deepEqual(definition?.neckPipeBoreKeys, ["A", "1"]);
    assert.deepEqual(definition?.neckOuterKeys, ["N1"]);
    assert.deepEqual(definition?.neckWallKeys, ["S"]);
    assert.deepEqual(definition?.neckStepKeys, ["H3"]);
    assert.deepEqual(definition?.neckTotalHeightKeys, ["H2"]);
    assert.deepEqual(definition?.radiusKeys, ["R1"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, true);
});

test("type 33 resolves the supported necked drawing behavior", () => {
    const definition = getFlangeTypeDefinition("33");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "weldingNeck");
    assert.equal(definition?.lightningStart, "neckTopY");
    assert.equal(definition?.showCommonBoreDiameter, false);
    assert.equal(definition?.showType11DimensionGroup, true);
    assert.deepEqual(definition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(definition?.thicknessKeys, ["C2"]);
    assert.deepEqual(definition?.neckPipeBoreKeys, ["A", "1"]);
    assert.deepEqual(definition?.neckOuterKeys, ["N1"]);
    assert.deepEqual(definition?.neckWallKeys, ["S"]);
    assert.deepEqual(definition?.neckStepKeys, ["H3"]);
    assert.deepEqual(definition?.neckTotalHeightKeys, ["H2"]);
    assert.deepEqual(definition?.radiusKeys, ["R1"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, true);
});

test("type 34 resolves the supported necked drawing behavior", () => {
    const definition = getFlangeTypeDefinition("34");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "weldingNeck");
    assert.equal(definition?.lightningStart, "neckTopY");
    assert.equal(definition?.showCommonBoreDiameter, false);
    assert.equal(definition?.showType11DimensionGroup, true);
    assert.deepEqual(definition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(definition?.thicknessKeys, ["C2"]);
    assert.deepEqual(definition?.neckPipeBoreKeys, ["A", "1"]);
    assert.deepEqual(definition?.neckOuterKeys, ["N1"]);
    assert.deepEqual(definition?.neckWallKeys, ["S"]);
    assert.deepEqual(definition?.neckStepKeys, ["H3"]);
    assert.deepEqual(definition?.neckTotalHeightKeys, ["H2"]);
    assert.deepEqual(definition?.radiusKeys, ["R1"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, true);
});

test("type 35 resolves the supported necked drawing behavior", () => {
    const definition = getFlangeTypeDefinition("35");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "weldingNeck");
    assert.equal(definition?.lightningStart, "neckTopY");
    assert.equal(definition?.showCommonBoreDiameter, false);
    assert.equal(definition?.showType11DimensionGroup, true);
    assert.deepEqual(definition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(definition?.thicknessKeys, ["C2"]);
    assert.deepEqual(definition?.neckPipeBoreKeys, ["A", "1"]);
    assert.deepEqual(definition?.neckOuterKeys, ["N1"]);
    assert.deepEqual(definition?.neckWallKeys, ["S"]);
    assert.deepEqual(definition?.neckStepKeys, ["H3"]);
    assert.deepEqual(definition?.neckTotalHeightKeys, ["H2"]);
    assert.deepEqual(definition?.radiusKeys, ["R1"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, true);
});

test("type 36 resolves the supported necked drawing behavior", () => {
    const definition = getFlangeTypeDefinition("36");

    assert.ok(definition);
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.neckKind, "weldingNeck");
    assert.equal(definition?.lightningStart, "neckTopY");
    assert.equal(definition?.showCommonBoreDiameter, false);
    assert.equal(definition?.showType11DimensionGroup, true);
    assert.deepEqual(definition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(definition?.thicknessKeys, ["C2"]);
    assert.deepEqual(definition?.neckPipeBoreKeys, ["A", "1"]);
    assert.deepEqual(definition?.neckOuterKeys, ["N1"]);
    assert.deepEqual(definition?.neckWallKeys, ["S"]);
    assert.deepEqual(definition?.neckStepKeys, ["H3"]);
    assert.deepEqual(definition?.neckTotalHeightKeys, ["H2"]);
    assert.deepEqual(definition?.radiusKeys, ["R1"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, true);
});

test("type 37 resolves the supported necked drawing behavior", () => {
    const definition = getFlangeTypeDefinition("37");

    assert.ok(definition);
    assert.equal(definition?.bodyKind, "standardHalfBody");
    assert.equal(definition?.isSupportedForDrawing, true);
    assert.equal(definition?.neckKind, "weldingNeck");
    assert.equal(definition?.lightningStart, "neckTopY");
    assert.equal(definition?.showCommonBoreDiameter, false);
    assert.equal(definition?.showType11DimensionGroup, true);
    assert.deepEqual(definition?.dimensionGroups, ["common", "type11"]);
    assert.deepEqual(definition?.thicknessKeys, ["C2"]);
    assert.deepEqual(definition?.neckPipeBoreKeys, ["A", "1"]);
    assert.deepEqual(definition?.neckOuterKeys, ["N1"]);
    assert.deepEqual(definition?.neckWallKeys, ["S"]);
    assert.deepEqual(definition?.neckStepKeys, ["H3"]);
    assert.deepEqual(definition?.neckTotalHeightKeys, ["H2"]);
    assert.deepEqual(definition?.radiusKeys, ["R1"]);
    assert.equal(definition?.hasBore, true);
    assert.equal(definition?.hasNeck, true);
});

test("unknown type 99 resolves without a known type definition", () => {
    const definition = getFlangeTypeDefinition("99");

    assert.equal(definition, undefined);
});
