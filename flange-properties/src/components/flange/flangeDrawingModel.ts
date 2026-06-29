import { computeFlangePositions, type FlangePositions } from "./flangeGeometry";
import type { FlangeMeasures } from "./flangeMeasures";
import { isFlatFlangeType, isFlangeType11, normalizeFlangeType } from "./flangeTypes";

export type FlangeDrawingBounds = {
    minX: number;
    minY: number;
    width: number;
    height: number;
};

export type FlangeDimensionRails = {
    top: {
        pipeBore?: number;
        neckOuter?: number;
        boltCircle: number;
    };
    bottom: {
        boltHoleText: number;
        boltHoleArrow: number;
        boltSizeText: number;
        boreDiameter: number;
        outerDiameter: number;
        faceLabel: number;
        faceDiameter: number;
    };
    right: {
        thickness: number;
        thicknessText: number;
        totalHeight?: number;
        totalHeightText?: number;
    };
};

export type FlangeFaceProfile = {
    isFaceA: boolean;
    showsF1: boolean;
    showsD1: boolean;
    showsF2: boolean;
    annotationScale: number;
    f1AnnotX: number;
    f1ExtLeft: number;
    f1ExtRight: number;
    f2AnnotX: number;
    f2GuideUpperStartX: number;
    f2GuideLowerStartX: number;
};

export type FlangeDrawingModel = {
    flangeType?: string;
    face: string;
    pos: FlangePositions;
    rails: FlangeDimensionRails;
    faceProfile: FlangeFaceProfile;
    bounds: FlangeDrawingBounds;
};

type CreateFlangeDrawingModelInput = {
    measures?: FlangeMeasures;
    flangeType?: string;
    face?: string | null;
};

const computeDimensionRails = (pos: FlangePositions, flangeType?: string): FlangeDimensionRails => {
    const isType11 = isFlangeType11(flangeType);
    const pipeBore = isType11 ? pos.neckTopY - 26 : undefined;
    const neckOuter = pipeBore !== undefined ? pipeBore - 15 : undefined;
    const boltCircle = neckOuter !== undefined ? neckOuter - 15 : pos.topY - 12;

    return {
        top: {
            pipeBore,
            neckOuter,
            boltCircle,
        },
        bottom: {
            boltHoleText: pos.bottomY + 10,
            boltHoleArrow: pos.bottomY + 12,
            boltSizeText: pos.bottomY + 22,
            boreDiameter: pos.bottomY + 18,
            outerDiameter: pos.bottomY + 32,
            faceLabel: pos.bottomY + 15,
            faceDiameter: pos.bottomY + 23,
        },
        right: {
            thickness: pos.outerRight + 10,
            thicknessText: pos.outerRight + 18,
            totalHeight: isType11 ? pos.outerRight + 30 : undefined,
            totalHeightText: isType11 ? pos.outerRight + 40 : undefined,
        },
    };
};

const computeFaceProfile = (pos: FlangePositions, face: string): FlangeFaceProfile => {
    const normalizedFace = face.toUpperCase();
    const isFaceA = normalizedFace === "A";
    const showsF1 = normalizedFace === "B" || normalizedFace === "D" || normalizedFace === "F" || normalizedFace === "G";
    const showsD1 = normalizedFace === "B" || normalizedFace === "G";
    const showsF2 = normalizedFace === "C" || normalizedFace === "E" || normalizedFace === "G";
    const geometryWidth = pos.outerRight * 2 - pos.centerX * 2;
    const scaleMultiplier = geometryWidth > 0 ? (350 * 1.36) / geometryWidth : 1;
    const faceRelativeX = (offset: number): number => pos.hubFaceRight - pos.hubFaceWidth * (offset / 26);

    return {
        isFaceA,
        showsF1,
        showsD1,
        showsF2,
        annotationScale: scaleMultiplier,
        f1AnnotX: (pos.hubFaceRight + pos.hubRight) / 2,
        f1ExtLeft: pos.hubFaceRight + 2 * scaleMultiplier,
        f1ExtRight: pos.hubRight + 6 * scaleMultiplier,
        f2AnnotX: faceRelativeX(6),
        f2GuideUpperStartX: faceRelativeX(4),
        f2GuideLowerStartX: faceRelativeX(16),
    };
};

const computeBounds = (pos: FlangePositions, rails: FlangeDimensionRails, flangeType?: string): FlangeDrawingBounds => {
    const isFlatType = isFlatFlangeType(flangeType);
    const leftPadding = 30;
    const rightPadding = isFlangeType11(flangeType) ? 70 : 45;
    const topPadding = isFlatType ? 150 : 60;
    const bottomPadding = 40;

    const minX = Math.floor(pos.centerX - leftPadding);
    const maxX = Math.ceil(Math.max(pos.outerRight + rightPadding, rails.right.totalHeightText ?? rails.right.thicknessText));
    const minY = Math.floor(Math.min(pos.neckTopY - topPadding, rails.top.boltCircle - 12));
    const maxY = Math.ceil(Math.max(pos.bottomY + bottomPadding, rails.bottom.outerDiameter + 8));

    return {
        minX,
        minY,
        width: maxX - minX,
        height: maxY - minY,
    };
};

export function createFlangeDrawingModel(input: CreateFlangeDrawingModelInput): FlangeDrawingModel {
    const flangeType = normalizeFlangeType(input.flangeType);
    const face = input.face ?? "A";
    const pos = computeFlangePositions(input.measures, flangeType);
    const rails = computeDimensionRails(pos, flangeType);
    const faceProfile = computeFaceProfile(pos, face);

    return {
        flangeType,
        face,
        pos,
        rails,
        faceProfile,
        bounds: computeBounds(pos, rails, flangeType),
    };
}
