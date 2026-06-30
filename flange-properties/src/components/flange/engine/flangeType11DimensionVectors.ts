import type { FlangeDimensionRails, FlangeFaceProfile, FlangeHalfSectionAnchors } from "./flangeDrawingModel";
import {
    buildDiameterDimensionVectors,
    buildExtensionLineVectors,
    buildNeckStepDimensionVectors,
    buildNeckWallDimensionVectors,
    buildRadiusLeaderDimensionVectors,
    buildVerticalDimensionVectors,
} from "./flangeDimensionVectors";
import type { FlangePositions } from "./flangeGeometry";
import { getMeasureValue, getMeasureValueOrInstruction, type FlangeMeasures } from "./flangeMeasures";
import type { FlangeTypeDefinition } from "./flangeTypes";
import type { SvgVectorElement } from "./svgVectorTypes";

type BuildFlangeType11DimensionVectorsInput = {
    measures?: FlangeMeasures;
    typeDefinition?: FlangeTypeDefinition;
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
    rails: FlangeDimensionRails;
    faceProfile: FlangeFaceProfile;
    cLowerLineY: number;
    color: string;
};

export const buildFlangeType11DimensionVectors = ({
    measures,
    typeDefinition,
    halfSection,
    pos,
    rails,
    faceProfile,
    cLowerLineY,
    color,
}: BuildFlangeType11DimensionVectorsInput): SvgVectorElement[] => {
    const {
        centerX,
        topY,
        boreRight,
        hubFaceRight,
        hubNeckRight,
        neckTopY,
    } = pos;

    const measureValue = (...keys: string[]): string | number => getMeasureValue(measures, ...keys);
    const measureValueOrInstruction = (...keys: string[]): string | number => getMeasureValueOrInstruction(measures, ...keys);

    const aLineY = rails.top.pipeBore!;
    const n1LineY = rails.top.neckOuter!;
    const neckBoreRight = halfSection.neckBoreWallX;
    const neckOuterRight = halfSection.neckOuterX;

    const r1OriginX = neckOuterRight + 5;
    const r1TextX = r1OriginX + 10 * faceProfile.annotationScale;
    const r1Arrow1Y = topY - 0.75;
    const r1Arrow2Y = neckTopY + 5;
    const r1OriginY = (3 * r1Arrow1Y + r1Arrow2Y) / 4;

    const h3LineX = neckOuterRight + 5;
    const h3TextX = h3LineX + 5 * faceProfile.annotationScale;

    return [
        ...buildDiameterDimensionVectors({
            label: `⌀${measureValue(...(typeDefinition?.neckPipeBoreKeys ?? ["A", "1"]))}`,
            centerX,
            targetX: neckBoreRight,
            y: aLineY,
            color,
        }),
        ...buildExtensionLineVectors({
            x: neckBoreRight,
            y1: neckTopY - 1,
            y2: neckTopY - 29,
            color,
        }),
        ...buildNeckWallDimensionVectors({
            label: `${measureValueOrInstruction(...(typeDefinition?.neckWallKeys ?? ["S"]))}`,
            labelX: neckBoreRight - 30,
            boreX: boreRight,
            outerX: neckBoreRight,
            y: neckTopY - 6,
            topY: neckTopY - 11,
            bottomY: neckTopY - 1,
            leftArrowStartX: boreRight - 56,
            rightArrowStartX: neckBoreRight + 9,
            color,
        }),
        ...buildRadiusLeaderDimensionVectors({
            label: measureValue(...(typeDefinition?.radiusKeys ?? ["R1"])),
            originX: r1OriginX,
            originY: r1OriginY,
            textX: (r1OriginX + r1TextX) / 2,
            textY: r1OriginY - 2,
            leaderEndX: r1TextX - 2,
            target1X: hubNeckRight - 1.5,
            target1Y: r1Arrow1Y,
            target2X: neckBoreRight + 0.5,
            target2Y: r1Arrow2Y,
            color,
        }),
        ...buildNeckStepDimensionVectors({
            label: measureValue(...(typeDefinition?.neckStepKeys ?? ["H3"])),
            x: h3LineX,
            textX: h3TextX,
            textY: neckTopY - 4,
            stepTopY: neckTopY,
            stepBottomY: neckTopY + 5,
            upperArrowStartY: neckTopY - 11,
            lowerArrowEndY: neckTopY + 10,
            extensionX1: neckBoreRight + 2,
            extensionX2: h3LineX + 2,
            color,
        }),
        ...buildDiameterDimensionVectors({
            label: `⌀${measureValue(...(typeDefinition?.neckOuterKeys ?? ["N1"]))}`,
            centerX,
            targetX: neckOuterRight,
            y: n1LineY,
            color,
        }),
        ...buildExtensionLineVectors({
            x: neckOuterRight,
            y1: topY - 3,
            y2: n1LineY - 2,
            color,
        }),
        ...buildVerticalDimensionVectors({
            label: `${measureValue(...(typeDefinition?.neckTotalHeightKeys ?? ["H2"]))}`,
            x: rails.right.totalHeight!,
            textX: rails.right.totalHeightText!,
            y1: neckTopY,
            y2: cLowerLineY,
            topExtensionX1: neckBoreRight + 12,
            bottomExtensionX1: hubFaceRight - 1,
            extensionX2: rails.right.totalHeight! + 2,
            color,
            textOffsetY: 3,
        }),
    ];
};
