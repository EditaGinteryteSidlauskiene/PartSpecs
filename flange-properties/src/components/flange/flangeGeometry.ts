import { getNumericMeasureValue, type FlangeMeasures } from "./flangeMeasures";
import { isFlatFlangeType, isFlangeType01, isFlangeType05, isFlangeType11, normalizeFlangeType } from "./flangeTypes";

export type FlangePositions = {
    centerX: number;
    topY: number;
    bottomY: number;
    outerLeft: number;
    outerRight: number;
    boltOuterLeft: number;
    boltOuterRight: number;
    boltCenterLeft: number;
    boltCenterRight: number;
    hubLeft: number;
    hubRight: number;
    hubFaceLeft: number;
    hubFaceRight: number;
    hubNeckLeft: number;
    hubNeckRight: number;
    boreLeft: number;
    boreRight: number;
    hubFaceWidth: number;
    neckTopY: number;
    neckWall: number;
    boreDisplayRadius: number;
};

const SVG_TOTAL_WIDTH = 350;
const CENTER_X = 141;
const TOP_Y = 20;

const DEFAULT_HALF_D = 140;
const DEFAULT_HALF_K = 117.5;
const DEFAULT_BOLT_HOLE_RADIUS = 12.5;
const DEFAULT_THICKNESS = 20;

const HUB_FACE_RATIO = 4 / 30;
const HUB_NECK_RATIO = 16 / 30;

type GeometryMeasures = {
    D: number | null;
    A: number | null;
    B1: number | null;
    K: number | null;
    L: number | null;
    C: number | null;
    H2: number | null;
    S: number | null;
};

type BodyDimensions = {
    halfD: number;
    halfK: number;
    boltHoleRadius: number;
    thickness: number;
    boreDisplayRadius: number;
};

const getThicknessKeys = (flangeType?: string): string[] => {
    if (isFlangeType11(flangeType)) {
        return ["C2"];
    }

    if (isFlangeType01(flangeType)) {
        return ["C1"];
    }

    if (isFlangeType05(flangeType)) {
        return ["C4"];
    }

    return ["C1", "C2", "C3", "C4", "7", "8", "9", "10"];
};

const getGeometryMeasures = (measures: FlangeMeasures | undefined, flangeType?: string): GeometryMeasures => {
    const D = getNumericMeasureValue(measures, "D", "0");
    const thicknessKeys = getThicknessKeys(flangeType);
    let C = getNumericMeasureValue(measures, ...thicknessKeys);

    if (isFlatFlangeType(flangeType) && !C && D) {
        C = D * 0.04;
    }

    return {
        D,
        A: getNumericMeasureValue(measures, "A"),
        B1: getNumericMeasureValue(measures, "B1"),
        K: getNumericMeasureValue(measures, "K", "1"),
        L: getNumericMeasureValue(measures, "L", "2"),
        C,
        H2: isFlangeType11(flangeType) ? getNumericMeasureValue(measures, "H2") : null,
        S: isFlangeType11(flangeType) ? getNumericMeasureValue(measures, "S") : null,
    };
};

const computeBoreReference = ({ D, A, B1 }: GeometryMeasures, flangeType?: string): number | null => {
    if (isFlangeType01(flangeType)) {
        return B1 ?? (D ? D * 0.8 : null);
    }

    if (isFlangeType05(flangeType)) {
        return D ? D * 0.8 : null;
    }

    return A;
};

const computeDisplayedRadialWidth = (D: number | null, boreRef: number | null): number => {
    if (D && boreRef) {
        return (D - boreRef) / 2;
    }

    return D ? D / 2 : 1;
};

const computeScale = (
    { D, C, H2 }: GeometryMeasures,
    boreRef: number | null,
    flangeType?: string
): number => {
    const displayedRadialWidth = computeDisplayedRadialWidth(D, boreRef);
    let scale: number;

    if (isFlatFlangeType(flangeType) && C) {
        scale = 2.5;
    } else if (isFlangeType11(flangeType) && H2) {
        scale = 120 / H2;
    } else if (displayedRadialWidth > 0) {
        scale = SVG_TOTAL_WIDTH / displayedRadialWidth;
    } else {
        scale = 1;
    }

    const maxScaleForWidth = (SVG_TOTAL_WIDTH - 10) / (2 * displayedRadialWidth);
    return Math.min(scale, maxScaleForWidth);
};

const computeBodyDimensions = (
    { D, K, L, C }: GeometryMeasures,
    boreRef: number | null,
    scale: number,
    flangeType?: string
): BodyDimensions => {
    const boreDisplayRadius = isFlangeType01(flangeType) || isFlangeType11(flangeType) ? 50 : 0;
    const boltHoleRadius = L ? (L / 2) * scale * 0.5 : DEFAULT_BOLT_HOLE_RADIUS;
    const thickness = isFlatFlangeType(flangeType) ? DEFAULT_THICKNESS : C ? C * scale : DEFAULT_THICKNESS;

    if (isFlangeType05(flangeType)) {
        return {
            halfD: DEFAULT_HALF_D,
            halfK: DEFAULT_HALF_K,
            boltHoleRadius,
            thickness,
            boreDisplayRadius,
        };
    }

    return {
        halfD: boreDisplayRadius + (D && boreRef ? (D - boreRef) / 2 * scale : D ? (D / 2) * scale : DEFAULT_HALF_D),
        halfK: boreDisplayRadius + (K && boreRef ? (K - boreRef) / 2 * scale : K ? (K / 2) * scale : DEFAULT_HALF_K),
        boltHoleRadius,
        thickness,
        boreDisplayRadius,
    };
};

export function computeFlangePositions(
    measures?: FlangeMeasures,
    flangeType?: string
): FlangePositions {
    const normalizedType = normalizeFlangeType(flangeType);
    const geometryMeasures = getGeometryMeasures(measures, normalizedType);
    const boreRef = computeBoreReference(geometryMeasures, normalizedType);
    const scale = computeScale(geometryMeasures, boreRef, normalizedType);
    const { halfD, halfK, boltHoleRadius, thickness, boreDisplayRadius } = computeBodyDimensions(
        geometryMeasures,
        boreRef,
        scale,
        normalizedType
    );

    const centerX = CENTER_X;
    const topY = isFlangeType01(normalizedType) ? TOP_Y + 350 : (isFlangeType05(normalizedType) ? TOP_Y + 300 : TOP_Y);
    const bottomY = topY + thickness;

    const neckHeight = geometryMeasures.H2 && geometryMeasures.C
        ? (geometryMeasures.H2 - geometryMeasures.C) * scale
        : (isFlatFlangeType(normalizedType) ? 0 : 29);
    const neckTopY = topY - neckHeight;
    const neckWall = geometryMeasures.S ? geometryMeasures.S * scale * 0.5 : 2;

    const outerLeft = centerX - halfD;
    const outerRight = centerX + halfD;
    const boltOuterLeft = centerX - halfK - boltHoleRadius;
    const boltOuterRight = centerX + halfK + boltHoleRadius;
    const boltCenterLeft = centerX - halfK;
    const boltCenterRight = centerX + halfK;
    const hubLeft = centerX - halfK + boltHoleRadius;
    const hubRight = centerX + halfK - boltHoleRadius;
    const boreLeft = centerX - boreDisplayRadius;
    const boreRight = centerX + boreDisplayRadius;

    const hubWidth = boreLeft - hubLeft;
    const hubFaceLeft = hubLeft + hubWidth * HUB_FACE_RATIO;
    const hubFaceRight = hubRight - hubWidth * HUB_FACE_RATIO;
    const hubNeckLeft = hubLeft + hubWidth * HUB_NECK_RATIO;
    const hubNeckRight = hubRight - hubWidth * HUB_NECK_RATIO;
    const hubFaceWidth = boreLeft - hubFaceLeft;

    return {
        centerX, topY, bottomY,
        outerLeft, outerRight,
        boltOuterLeft, boltOuterRight,
        boltCenterLeft, boltCenterRight,
        hubLeft, hubRight,
        hubFaceLeft, hubFaceRight,
        hubNeckLeft, hubNeckRight,
        boreLeft, boreRight,
        hubFaceWidth,
        neckTopY, neckWall,
        boreDisplayRadius,
    };
}
