type MeasureDto = {
    value?: number;
    instruction?: string;
};

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
};

const SVG_TOTAL_WIDTH = 280;
const CENTER_X = 141;
const TOP_Y = 55;

const DEFAULT_HALF_D = 140;
const DEFAULT_HALF_K = 117.5;
const DEFAULT_HALF_B = 75;
const DEFAULT_BOLT_HOLE_RADIUS = 12.5;
const DEFAULT_THICKNESS = 30;

const HUB_FACE_RATIO = 4 / 30;
const HUB_NECK_RATIO = 16 / 30;

function findMeasureValue(measures: Record<string, MeasureDto> | undefined, ...keys: string[]): number | null {
    if (!measures) return null;
    for (const key of keys) {
        const exact = measures[key]?.value;
        if (exact !== undefined && exact !== null) return exact;
        const lower = measures[key.toLowerCase()]?.value;
        if (lower !== undefined && lower !== null) return lower;
    }
    return null;
}

export function computeFlangePositions(
    measures?: Record<string, MeasureDto>,
    flangeType?: string
): FlangePositions {
    const D = findMeasureValue(measures, "D", "0");
    const K = findMeasureValue(measures, "K", "1");
    const B = findMeasureValue(measures, "B1", "B2", "B3", "4", "5", "6");
    const L = findMeasureValue(measures, "L", "2");

    const cKeys = flangeType === "11"
        ? ["C2"]
        : ["C1", "C2", "C3", "C4", "7", "8", "9", "10"];
    const C = findMeasureValue(measures, ...cKeys);

    const scale = D ? SVG_TOTAL_WIDTH / D : 1;
    const halfD = D ? (D / 2) * scale : DEFAULT_HALF_D;
    const halfK = K ? (K / 2) * scale : DEFAULT_HALF_K;
    const halfB = B ? (B / 2) * scale : DEFAULT_HALF_B;
    const boltHoleRadius = L ? (L / 2) * scale : DEFAULT_BOLT_HOLE_RADIUS;
    const thickness = C ? C * scale : DEFAULT_THICKNESS;

    const centerX = CENTER_X;
    const topY = TOP_Y;
    const bottomY = topY + thickness;

    const outerLeft = centerX - halfD;
    const outerRight = centerX + halfD;
    const boltOuterLeft = centerX - halfK - boltHoleRadius;
    const boltOuterRight = centerX + halfK + boltHoleRadius;
    const boltCenterLeft = centerX - halfK;
    const boltCenterRight = centerX + halfK;
    const hubLeft = centerX - halfK + boltHoleRadius;
    const hubRight = centerX + halfK - boltHoleRadius;
    const boreLeft = centerX - halfB;
    const boreRight = centerX + halfB;

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
    };
}
