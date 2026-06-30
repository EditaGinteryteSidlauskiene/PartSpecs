import test from "node:test";
import assert from "node:assert/strict";
import { FACE_LETTERS, getFlangeFaceState } from "./flangeFaceRules.ts";
import {
    BODY_RENDERER_KINDS,
    DIMENSION_GROUP_RENDERER_KEYS,
    FACE_RENDERING_MODES,
    NECK_RENDERER_KINDS,
} from "./flangeRendererKeys.ts";
import { getFlangeTypeDefinition, KNOWN_FLANGE_TYPES, type FlangeTypeDefinition } from "./flangeTypes.ts";

const flatStandardTypes = ["01", "02", "04"] as const;
const blindTypes = ["05"] as const;
const weldingNeckTypes = ["11", "12", "13", "21", "32", "33", "34", "35", "36", "37"] as const;

const assertNonEmptyKeys = (definition: FlangeTypeDefinition, propertyName: keyof FlangeTypeDefinition) => {
    const value = definition[propertyName];

    assert.ok(Array.isArray(value), `${definition.type}.${String(propertyName)} should be an array`);
    assert.ok(value.length > 0, `${definition.type}.${String(propertyName)} should not be empty`);
};

test("every known flange type has a complete supported definition", () => {
    assert.deepEqual(
        KNOWN_FLANGE_TYPES.map((type) => getFlangeTypeDefinition(type)?.type),
        [...KNOWN_FLANGE_TYPES],
    );

    for (const type of KNOWN_FLANGE_TYPES) {
        const definition = getFlangeTypeDefinition(type);

        assert.ok(definition, `${type} should have a definition`);
        assert.equal(definition.isSupportedForDrawing, true, `${type} should be supported`);
        assert.ok(BODY_RENDERER_KINDS.includes(definition.bodyKind), `${type} has an unknown body renderer`);
        assert.ok(NECK_RENDERER_KINDS.includes(definition.neckKind), `${type} has an unknown neck renderer`);

        for (const group of definition.dimensionGroups) {
            assert.ok(DIMENSION_GROUP_RENDERER_KEYS.includes(group), `${type} uses an unknown dimension group ${group}`);
        }

        assertNonEmptyKeys(definition, "outerDiameterKeys");
        assertNonEmptyKeys(definition, "thicknessKeys");
        assertNonEmptyKeys(definition, "boltCircleKeys");
        assertNonEmptyKeys(definition, "boltHoleKeys");

        if (definition.showCommonBoreDiameter) {
            assertNonEmptyKeys(definition, "boreDiameterKeys");
        }

        if (definition.hasNeck) {
            assert.equal(definition.neckKind, "weldingNeck", `${type} necked definitions should use weldingNeck renderer`);
            assert.ok(definition.dimensionGroups.includes("type11"), `${type} necked definitions should include neck dimensions`);
            assertNonEmptyKeys(definition, "neckPipeBoreKeys");
            assertNonEmptyKeys(definition, "neckOuterKeys");
            assertNonEmptyKeys(definition, "neckWallKeys");
            assertNonEmptyKeys(definition, "neckStepKeys");
            assertNonEmptyKeys(definition, "neckTotalHeightKeys");
            assertNonEmptyKeys(definition, "radiusKeys");
        }
    }
});

test("all face rules point to existing face renderers and dimension groups", () => {
    const states = [getFlangeFaceState(null), ...FACE_LETTERS.map((face) => getFlangeFaceState(face))];

    for (const state of states) {
        assert.ok(FACE_RENDERING_MODES.includes(state.renderingMode), `${state.renderingMode} should have a face renderer`);

        for (const group of state.dimensionGroups) {
            assert.ok(DIMENSION_GROUP_RENDERER_KEYS.includes(group), `${group} should have a dimension renderer`);
        }
    }
});

test("flat flange preset gives flat types shared flat behavior", () => {
    for (const type of flatStandardTypes) {
        const definition = getFlangeTypeDefinition(type)!;

        assert.equal(definition.isFlat, true);
        assert.equal(definition.hasBore, true);
        assert.equal(definition.hasNeck, false);
        assert.equal(definition.bodyKind, "standardHalfBody");
        assert.equal(definition.neckKind, "flatLine");
        assert.equal(definition.lightningStart, "topY");
        assert.deepEqual(definition.dimensionGroups, ["common"]);
        assert.equal(definition.showCommonBoreDiameter, true);
        assert.equal(definition.useDefaultThickness, true);
        assert.equal(definition.useDefaultBoreReference, 0.8);
        assert.equal(definition.boreDisplayRadius, 50);
        assert.equal(definition.topOffset, 350);
        assert.equal(definition.fixedThickness, 20);
        assert.equal(definition.fixedScale, 2.5);
    }
});

test("blind flange preset gives type 05 shared blind behavior", () => {
    for (const type of blindTypes) {
        const definition = getFlangeTypeDefinition(type)!;

        assert.equal(definition.isFlat, true);
        assert.equal(definition.hasBore, false);
        assert.equal(definition.hasNeck, false);
        assert.equal(definition.bodyKind, "blindHalfBody");
        assert.equal(definition.neckKind, "flatLine");
        assert.equal(definition.lightningStart, "topY");
        assert.deepEqual(definition.dimensionGroups, ["common"]);
        assert.equal(definition.showCommonBoreDiameter, false);
        assert.equal(definition.useDefaultThickness, true);
        assert.equal(definition.useDefaultBoreReference, 0.8);
        assert.equal(definition.boreDisplayRadius, 0);
        assert.equal(definition.topOffset, 300);
        assert.equal(definition.fixedThickness, 20);
        assert.equal(definition.fixedScale, 2.5);
    }
});

test("welding-neck preset gives all necked types shared neck metadata", () => {
    for (const type of weldingNeckTypes) {
        const definition = getFlangeTypeDefinition(type)!;

        assert.equal(definition.isFlat, false);
        assert.equal(definition.hasBore, true);
        assert.equal(definition.hasNeck, true);
        assert.equal(definition.bodyKind, "standardHalfBody");
        assert.equal(definition.neckKind, "weldingNeck");
        assert.equal(definition.lightningStart, "neckTopY");
        assert.deepEqual(definition.dimensionGroups, ["common", "type11"]);
        assert.equal(definition.showCommonBoreDiameter, false);
        assert.equal(definition.showType11DimensionGroup, true);
        assert.deepEqual(definition.outerDiameterKeys, ["D", "0", "A"]);
        assert.deepEqual(definition.thicknessKeys, ["C2"]);
        assert.deepEqual(definition.boreDiameterKeys, []);
        assert.deepEqual(definition.neckPipeBoreKeys, ["A", "1"]);
        assert.deepEqual(definition.neckOuterKeys, ["N1"]);
        assert.deepEqual(definition.neckWallKeys, ["S"]);
        assert.deepEqual(definition.neckStepKeys, ["H3"]);
        assert.deepEqual(definition.neckTotalHeightKeys, ["H2"]);
        assert.deepEqual(definition.radiusKeys, ["R1"]);
        assert.equal(definition.useDefaultThickness, false);
        assert.equal(definition.boreDisplayRadius, 50);
        assert.equal(definition.heightScaleReference, "H2");
    }
});
