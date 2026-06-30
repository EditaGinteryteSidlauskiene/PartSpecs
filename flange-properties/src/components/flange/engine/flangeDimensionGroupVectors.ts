import { buildFlangeCommonDimensionVectors } from "./flangeCommonDimensionVectors.ts";
import { buildFlangeFaceDimensionVectors } from "./flangeFaceDimensionVectors.ts";
import { buildFlangeType11DimensionVectors } from "./flangeType11DimensionVectors.ts";
import type { FlangeDimensionRails, FlangeFaceProfile, FlangeHalfSectionAnchors } from "./flangeDrawingModel.ts";
import type { FaceDimensionGroupKey } from "./flangeFaceRules.ts";
import type { FlangePositions } from "./flangeGeometry.ts";
import type { FlangeLookupResponse } from "./flangeMeasures.ts";
import { DIMENSION_GROUP_RENDERER_KEYS } from "./flangeRendererKeys.ts";
import type { FlangeDimensionGroupKey, FlangeTypeDefinition } from "./flangeTypes.ts";
import { SVG_VECTOR_COLORS } from "./svgVectorDefinitions.ts";
import type { SvgVectorElement } from "./svgVectorTypes.ts";

type DimensionGroupKey = FlangeDimensionGroupKey | FaceDimensionGroupKey;

export type BuildFlangeDimensionVectorsInput = {
    response: FlangeLookupResponse | null;
    typeDefinition?: FlangeTypeDefinition;
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
    rails: FlangeDimensionRails;
    faceProfile: FlangeFaceProfile;
    color?: string;
};

type DimensionGroupVectorInput = BuildFlangeDimensionVectorsInput & {
    cLowerLineY: number;
    color: string;
};

const dimensionVectorBuilders = {
    common: ({ response, typeDefinition, halfSection, pos, rails, cLowerLineY, color }) =>
        buildFlangeCommonDimensionVectors({
            response,
            typeDefinition,
            halfSection,
            pos,
            rails,
            cLowerLineY,
            color,
        }),
    type11: ({ response, typeDefinition, halfSection, pos, rails, faceProfile, cLowerLineY, color }) =>
        buildFlangeType11DimensionVectors({
            measures: response?.measures,
            typeDefinition,
            halfSection,
            pos,
            rails,
            faceProfile,
            cLowerLineY,
            color,
        }),
    face: ({ pos, rails, faceProfile, color }) =>
        buildFlangeFaceDimensionVectors({
            pos,
            rails,
            faceProfile,
            color,
        }),
} satisfies Record<(typeof DIMENSION_GROUP_RENDERER_KEYS)[number], (input: DimensionGroupVectorInput) => SvgVectorElement[]>;

export const getActiveDimensionGroups = (
    typeDefinition: FlangeTypeDefinition | undefined,
    faceProfile: FlangeFaceProfile
): DimensionGroupKey[] => [
    ...(typeDefinition?.dimensionGroups ?? ["common"]),
    ...(faceProfile.dimensionGroups ?? []),
];

export const buildFlangeDimensionVectors = ({
    response,
    typeDefinition,
    halfSection,
    pos,
    rails,
    faceProfile,
    color = SVG_VECTOR_COLORS.dimension,
}: BuildFlangeDimensionVectorsInput): SvgVectorElement[] => {
    const cLowerLineY = faceProfile.isFaceA ? pos.bottomY : pos.bottomY + 3;
    const builderInput = {
        response,
        typeDefinition,
        halfSection,
        pos,
        rails,
        faceProfile,
        cLowerLineY,
        color,
    };

    return getActiveDimensionGroups(typeDefinition, faceProfile)
        .flatMap((groupKey) => dimensionVectorBuilders[groupKey](builderInput));
};
