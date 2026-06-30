import type { ReactNode } from "react";
import FlangeCommonDimensions from "./FlangeCommonDimensions";
import FlangeFaceDimensions from "./FlangeFaceDimensions";
import FlangeType11Dimensions from "./FlangeType11Dimensions";
import type { FlangeDimensionRails, FlangeFaceProfile, FlangeHalfSectionAnchors } from "./flangeDrawingModel";
import type { FaceDimensionGroupKey } from "./flangeFaceRules";
import type { FlangePositions } from "./flangeGeometry";
import type { FlangeLookupResponse } from "./flangeMeasures";
import { DIMENSION_GROUP_RENDERER_KEYS } from "./flangeRendererKeys";
import type { FlangeDimensionGroupKey, FlangeTypeDefinition } from "./flangeTypes";

type DimensionGroupKey = FlangeDimensionGroupKey | FaceDimensionGroupKey;

type FlangeDimensionsProps = {
    response: FlangeLookupResponse | null;
    typeDefinition?: FlangeTypeDefinition;
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
    rails: FlangeDimensionRails;
    faceProfile: FlangeFaceProfile;
};

type DimensionRendererInput = FlangeDimensionsProps & {
    cLowerLineY: number;
    color: string;
};

const dimensionRenderers = {
    common: ({ response, typeDefinition, halfSection, pos, rails, cLowerLineY, color }) => (
        <FlangeCommonDimensions
            response={response}
            typeDefinition={typeDefinition}
            halfSection={halfSection}
            pos={pos}
            rails={rails}
            cLowerLineY={cLowerLineY}
            color={color}
        />
    ),
    type11: ({ response, typeDefinition, halfSection, pos, rails, faceProfile, cLowerLineY, color }) => (
        <FlangeType11Dimensions
            measures={response?.measures}
            typeDefinition={typeDefinition}
            halfSection={halfSection}
            pos={pos}
            rails={rails}
            faceProfile={faceProfile}
            cLowerLineY={cLowerLineY}
            color={color}
        />
    ),
    face: ({ pos, rails, faceProfile, color }) => (
        <FlangeFaceDimensions
            pos={pos}
            rails={rails}
            faceProfile={faceProfile}
            color={color}
        />
    ),
} satisfies Record<(typeof DIMENSION_GROUP_RENDERER_KEYS)[number], (input: DimensionRendererInput) => ReactNode>;

const getActiveDimensionGroups = (
    typeDefinition: FlangeTypeDefinition | undefined,
    faceProfile: FlangeFaceProfile
): DimensionGroupKey[] => [
    ...(typeDefinition?.dimensionGroups ?? ["common"]),
    ...(faceProfile.dimensionGroups ?? []),
];

export default function FlangeDimensions({ response, typeDefinition, halfSection, pos, rails, faceProfile }: FlangeDimensionsProps) {
    const cLowerLineY = faceProfile.isFaceA ? pos.bottomY : pos.bottomY + 3;
    const dimColor = "rgb(24, 93, 44)";
    const rendererInput = {
        response,
        typeDefinition,
        halfSection,
        pos,
        rails,
        faceProfile,
        cLowerLineY,
        color: dimColor,
    };

    return (
        <>
            {getActiveDimensionGroups(typeDefinition, faceProfile).map((groupKey) => (
                <g key={groupKey}>
                    {dimensionRenderers[groupKey](rendererInput)}
                </g>
            ))}
        </>
    );
}
