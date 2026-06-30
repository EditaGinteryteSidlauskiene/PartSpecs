import type { BodyRendererKind, NeckRendererKind } from "./flangeRendererKeys.ts";

export const normalizeFlangeType = (flangeType?: string): string | undefined => {
    if (!flangeType || !/^\d{1,2}$/.test(flangeType)) {
        return flangeType;
    }

    return flangeType.padStart(2, "0");
};

export type FlangeDimensionGroupKey = "common" | "type11";
export const KNOWN_FLANGE_TYPES = ["01", "02", "04", "05", "11", "12", "13", "21", "32", "33", "34", "35", "36", "37"] as const;
export type FlangeTypeCode = (typeof KNOWN_FLANGE_TYPES)[number];

export type FlangeTypeDefinition = {
    type: FlangeTypeCode;
    isSupportedForDrawing: boolean;
    unsupportedDrawingMessage?: string;
    isFlat: boolean;
    hasBore: boolean;
    hasNeck: boolean;
    bodyKind: BodyRendererKind;
    neckKind: NeckRendererKind;
    lightningStart: "topY" | "neckTopY";
    showCommonBoreDiameter: boolean;
    showType11DimensionGroup: boolean;
    dimensionGroups: FlangeDimensionGroupKey[];
    outerDiameterKeys: string[];
    thicknessKeys: string[];
    boreDiameterKeys: string[];
    boltCircleKeys: string[];
    boltHoleKeys: string[];
    neckPipeBoreKeys: string[];
    neckOuterKeys: string[];
    neckWallKeys: string[];
    neckStepKeys: string[];
    neckTotalHeightKeys: string[];
    radiusKeys: string[];
    useDefaultThickness: boolean;
    useDefaultBoreReference?: number;
    boreDisplayRadius: number;
    topOffset?: number;
    fixedThickness?: number;
    fixedScale?: number;
    heightScaleReference?: "H2";
};

type FlangeTypeDefinitionInput = {
    type: FlangeTypeCode;
    thicknessKeys: string[];
};

const commonMeasureKeys = {
    outerDiameterKeys: ["D", "0"],
    boreDiameterKeys: ["B1", "B2", "B3", "4", "5", "6"],
    boltCircleKeys: ["K", "1"],
    boltHoleKeys: ["L", "2"],
} as const;

const emptyNeckMeasureKeys = {
    neckPipeBoreKeys: [],
    neckOuterKeys: [],
    neckWallKeys: [],
    neckStepKeys: [],
    neckTotalHeightKeys: [],
    radiusKeys: [],
};

const weldingNeckMeasureKeys = {
    neckPipeBoreKeys: ["A", "1"],
    neckOuterKeys: ["N1"],
    neckWallKeys: ["S"],
    neckStepKeys: ["H3"],
    neckTotalHeightKeys: ["H2"],
    radiusKeys: ["R1"],
};

const createFlatFlangeDefinition = ({ type, thicknessKeys }: FlangeTypeDefinitionInput): FlangeTypeDefinition => ({
    type,
    isSupportedForDrawing: true,
    isFlat: true,
    hasBore: true,
    hasNeck: false,
    bodyKind: "standardHalfBody",
    neckKind: "flatLine",
    lightningStart: "topY",
    showCommonBoreDiameter: true,
    showType11DimensionGroup: false,
    dimensionGroups: ["common"],
    outerDiameterKeys: [...commonMeasureKeys.outerDiameterKeys],
    thicknessKeys,
    boreDiameterKeys: [...commonMeasureKeys.boreDiameterKeys],
    boltCircleKeys: [...commonMeasureKeys.boltCircleKeys],
    boltHoleKeys: [...commonMeasureKeys.boltHoleKeys],
    ...emptyNeckMeasureKeys,
    useDefaultThickness: true,
    useDefaultBoreReference: 0.8,
    boreDisplayRadius: 50,
    topOffset: 350,
    fixedThickness: 20,
    fixedScale: 2.5,
});

const createBlindFlangeDefinition = ({ type, thicknessKeys }: FlangeTypeDefinitionInput): FlangeTypeDefinition => ({
    type,
    isSupportedForDrawing: true,
    isFlat: true,
    hasBore: false,
    hasNeck: false,
    bodyKind: "blindHalfBody",
    neckKind: "flatLine",
    lightningStart: "topY",
    showCommonBoreDiameter: false,
    showType11DimensionGroup: false,
    dimensionGroups: ["common"],
    outerDiameterKeys: [...commonMeasureKeys.outerDiameterKeys],
    thicknessKeys,
    boreDiameterKeys: [...commonMeasureKeys.boreDiameterKeys],
    boltCircleKeys: [...commonMeasureKeys.boltCircleKeys],
    boltHoleKeys: [...commonMeasureKeys.boltHoleKeys],
    ...emptyNeckMeasureKeys,
    useDefaultThickness: true,
    useDefaultBoreReference: 0.8,
    boreDisplayRadius: 0,
    topOffset: 300,
    fixedThickness: 20,
    fixedScale: 2.5,
});

const createWeldingNeckFlangeDefinition = ({ type, thicknessKeys }: FlangeTypeDefinitionInput): FlangeTypeDefinition => ({
    type,
    isSupportedForDrawing: true,
    isFlat: false,
    hasBore: true,
    hasNeck: true,
    bodyKind: "standardHalfBody",
    neckKind: "weldingNeck",
    lightningStart: "neckTopY",
    showCommonBoreDiameter: false,
    showType11DimensionGroup: true,
    dimensionGroups: ["common", "type11"],
    outerDiameterKeys: ["D", "0", "A"],
    thicknessKeys,
    boreDiameterKeys: [],
    boltCircleKeys: [...commonMeasureKeys.boltCircleKeys],
    boltHoleKeys: [...commonMeasureKeys.boltHoleKeys],
    ...weldingNeckMeasureKeys,
    useDefaultThickness: false,
    boreDisplayRadius: 50,
    heightScaleReference: "H2",
});

const FLANGE_TYPE_DEFINITIONS: Record<FlangeTypeCode, FlangeTypeDefinition> = {
    "01": createFlatFlangeDefinition({ type: "01", thicknessKeys: ["C1"] }),
    "02": createFlatFlangeDefinition({ type: "02", thicknessKeys: ["C2"] }),
    "04": createFlatFlangeDefinition({ type: "04", thicknessKeys: ["C3"] }),
    "05": createBlindFlangeDefinition({ type: "05", thicknessKeys: ["C4"] }),
    "11": createWeldingNeckFlangeDefinition({ type: "11", thicknessKeys: ["C2"] }),
    "12": createWeldingNeckFlangeDefinition({ type: "12", thicknessKeys: ["C2"] }),
    "13": createWeldingNeckFlangeDefinition({ type: "13", thicknessKeys: ["C2"] }),
    "21": createWeldingNeckFlangeDefinition({ type: "21", thicknessKeys: ["C2"] }),
    "32": createWeldingNeckFlangeDefinition({ type: "32", thicknessKeys: ["C2"] }),
    "33": createWeldingNeckFlangeDefinition({ type: "33", thicknessKeys: ["C2"] }),
    "34": createWeldingNeckFlangeDefinition({ type: "34", thicknessKeys: ["C2"] }),
    "35": createWeldingNeckFlangeDefinition({ type: "35", thicknessKeys: ["C2"] }),
    "36": createWeldingNeckFlangeDefinition({ type: "36", thicknessKeys: ["C2"] }),
    "37": createWeldingNeckFlangeDefinition({ type: "37", thicknessKeys: ["C2"] }),
};

const isKnownFlangeTypeCode = (flangeType?: string): flangeType is FlangeTypeCode =>
    !!flangeType && flangeType in FLANGE_TYPE_DEFINITIONS;

export const getFlangeTypeDefinition = (flangeType?: string): FlangeTypeDefinition | undefined => {
    const normalizedFlangeType = normalizeFlangeType(flangeType);
    if (isKnownFlangeTypeCode(normalizedFlangeType)) {
        return FLANGE_TYPE_DEFINITIONS[normalizedFlangeType];
    }

    return undefined;
};
