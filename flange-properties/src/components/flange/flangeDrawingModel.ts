import { computeFlangePositions, type FlangePositions } from "./flangeGeometry.ts";
import type { FlangeMeasures } from "./flangeMeasures.ts";
import { getFlangeFaceState, type FaceDimensionGroupKey, type FlangeFaceState } from "./flangeFaceRules.ts";
import { getFlangeTypeDefinition, normalizeFlangeType, type FlangeTypeDefinition } from "./flangeTypes.ts";

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
    isNoFace: boolean;
    isFaceA: boolean;
    showsF1: boolean;
    showsD1: boolean;
    showsF2: boolean;
    dimensionGroups: FaceDimensionGroupKey[];
    annotationScale: number;
    f1AnnotX: number;
    f1ExtLeft: number;
    f1ExtRight: number;
    f2AnnotX: number;
    f2GuideUpperStartX: number;
    f2GuideLowerStartX: number;
};

export type FlangeHalfSectionAnchors = {
    breakLineX: number;
    boreWallX: number;
    hubFaceX: number;
    hubNeckX: number;
    hubOuterX: number;
    boltCenterX: number;
    boltOuterX: number;
    outerEdgeX: number;
    topY: number;
    bottomY: number;
    neckTopY: number;
    neckBoreWallX: number;
    neckOuterX: number;
};

export type FlangeDrawingValidation = {
    missingMeasures: string[];
    hasMissingRequiredMeasures: boolean;
};

export type FlangeDrawingModel = {
    flangeType?: string;
    face: string | null;
    typeDefinition?: FlangeTypeDefinition;
    faceState: FlangeFaceState;
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
    rails: FlangeDimensionRails;
    faceProfile: FlangeFaceProfile;
    validation: FlangeDrawingValidation;
    bounds: FlangeDrawingBounds;
};

type CreateFlangeDrawingModelInput = {
    measures?: FlangeMeasures;
    flangeType?: string;
    face?: string | null;
};

const computeDimensionRails = (pos: FlangePositions, flangeType?: string): FlangeDimensionRails => {
    const definition = getFlangeTypeDefinition(flangeType);
    const hasNeckDimensions = definition?.dimensionGroups.includes("type11") ?? false;
    const pipeBore = hasNeckDimensions ? pos.neckTopY - 26 : undefined;
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
            totalHeight: hasNeckDimensions ? pos.outerRight + 30 : undefined,
            totalHeightText: hasNeckDimensions ? pos.outerRight + 40 : undefined,
        },
    };
};

const computeFaceProfile = (pos: FlangePositions, face: string | null): FlangeFaceProfile => {
    const faceState = getFlangeFaceState(face);
    const geometryWidth = pos.outerRight * 2 - pos.centerX * 2;
    const scaleMultiplier = geometryWidth > 0 ? (350 * 1.36) / geometryWidth : 1;
    const faceRelativeX = (offset: number): number => pos.hubFaceRight - pos.hubFaceWidth * (offset / 26);

    return {
        ...faceState,
        annotationScale: scaleMultiplier,
        f1AnnotX: (pos.hubFaceRight + pos.hubRight) / 2,
        f1ExtLeft: pos.hubFaceRight + 2 * scaleMultiplier,
        f1ExtRight: pos.hubRight + 6 * scaleMultiplier,
        f2AnnotX: faceRelativeX(6),
        f2GuideUpperStartX: faceRelativeX(4),
        f2GuideLowerStartX: faceRelativeX(16),
    };
};

const computeHalfSectionAnchors = (pos: FlangePositions): FlangeHalfSectionAnchors => ({
    breakLineX: (pos.boreLeft + pos.boreRight) / 2 + 5,
    boreWallX: pos.boreRight,
    hubFaceX: pos.hubFaceRight,
    hubNeckX: pos.hubNeckRight,
    hubOuterX: pos.hubRight,
    boltCenterX: pos.boltCenterRight,
    boltOuterX: pos.boltOuterRight,
    outerEdgeX: pos.outerRight,
    topY: pos.topY,
    bottomY: pos.bottomY,
    neckTopY: pos.neckTopY,
    neckBoreWallX: pos.boreRight + pos.neckWall,
    neckOuterX: pos.hubNeckRight - 1,
});

const hasMeasureValue = (measures: FlangeMeasures | undefined, keys: string[]): boolean => {
    if (!measures || keys.length === 0) {
        return false;
    }

    return keys.some((key) => {
        const exactValue = measures[key]?.value;
        const lowerValue = measures[key.toLowerCase()]?.value;

        return exactValue !== undefined && exactValue !== null
            || lowerValue !== undefined && lowerValue !== null;
    });
};

const computeValidation = (
    measures: FlangeMeasures | undefined,
    typeDefinition?: FlangeTypeDefinition,
): FlangeDrawingValidation => {
    if (!typeDefinition) {
        return {
            missingMeasures: [],
            hasMissingRequiredMeasures: false,
        };
    }

    const requiredKeyGroups = [
        typeDefinition.outerDiameterKeys,
        typeDefinition.boltCircleKeys,
        typeDefinition.boltHoleKeys,
        typeDefinition.thicknessKeys,
        ...(typeDefinition.hasBore ? [typeDefinition.boreDiameterKeys] : []),
        ...(typeDefinition.hasNeck
            ? [
                typeDefinition.neckPipeBoreKeys,
                typeDefinition.neckOuterKeys,
                typeDefinition.neckWallKeys,
                typeDefinition.neckStepKeys,
                typeDefinition.neckTotalHeightKeys,
                typeDefinition.radiusKeys,
            ]
            : []),
    ];

    const missingMeasures = Array.from(new Set(
        requiredKeyGroups
            .filter((keys) => keys.length > 0 && !hasMeasureValue(measures, keys))
            .map((keys) => keys[0])
    ));

    return {
        missingMeasures,
        hasMissingRequiredMeasures: missingMeasures.length > 0,
    };
};

const computeBounds = (pos: FlangePositions, rails: FlangeDimensionRails, flangeType?: string): FlangeDrawingBounds => {
    const definition = getFlangeTypeDefinition(flangeType);
    const leftPadding = 30;
    const rightPadding = definition?.hasNeck ? 70 : 45;
    const topPadding = definition?.isFlat ?? false ? 150 : 60;
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
    const face = input.face?.trim().length ? input.face.trim().toUpperCase() : null;
    const typeDefinition = getFlangeTypeDefinition(flangeType);
    const faceState = getFlangeFaceState(face);
    const pos = computeFlangePositions(input.measures, flangeType);
    const halfSection = computeHalfSectionAnchors(pos);
    const rails = computeDimensionRails(pos, flangeType);
    const faceProfile = computeFaceProfile(pos, face);
    const validation = computeValidation(input.measures, typeDefinition);

    return {
        flangeType,
        face,
        typeDefinition,
        faceState,
        halfSection,
        pos,
        rails,
        faceProfile,
        validation,
        bounds: computeBounds(pos, rails, flangeType),
    };
}
