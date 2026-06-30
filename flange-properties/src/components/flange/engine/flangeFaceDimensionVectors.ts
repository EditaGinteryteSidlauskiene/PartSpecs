import type { FlangeDimensionRails, FlangeFaceProfile } from "./flangeDrawingModel";
import {
    buildFaceDiameterDimensionVectors,
    buildFaceGrooveDimensionVectors,
    buildFaceStripDimensionVectors,
} from "./flangeDimensionVectors";
import type { FlangePositions } from "./flangeGeometry";
import type { SvgVectorElement } from "./svgVectorTypes";

type BuildFlangeFaceDimensionVectorsInput = {
    pos: FlangePositions;
    rails: FlangeDimensionRails;
    faceProfile: FlangeFaceProfile;
    color: string;
};

export const buildFlangeFaceDimensionVectors = ({
    pos,
    rails,
    faceProfile,
    color,
}: BuildFlangeFaceDimensionVectorsInput): SvgVectorElement[] => {
    if (faceProfile.isNoFace) {
        return [];
    }

    const {
        centerX,
        bottomY,
        hubFaceLeft,
        hubFaceRight,
        boreRight,
    } = pos;

    return [
        ...(faceProfile.showsF1
            ? buildFaceStripDimensionVectors({
                label: "F1",
                annotationX: faceProfile.f1AnnotX,
                labelY: rails.bottom.faceLabel,
                topY: bottomY,
                stripBottomY: bottomY + 3,
                lowerArrowEndY: bottomY + 20,
                extLeftX: faceProfile.f1ExtLeft,
                extRightX: faceProfile.f1ExtRight,
                color,
            })
            : []),
        ...(faceProfile.showsD1
            ? buildFaceDiameterDimensionVectors({
                label: "D1",
                labelX: centerX,
                labelY: rails.bottom.faceDiameter - 3,
                x1: hubFaceLeft,
                x2: hubFaceRight,
                y: rails.bottom.faceDiameter,
                extensionX: hubFaceRight,
                extensionY1: bottomY + 5,
                extensionY2: bottomY + 27,
                color,
            })
            : []),
        ...(faceProfile.showsF2
            ? buildFaceGrooveDimensionVectors({
                label: "F2",
                leftX: faceProfile.f2AnnotX,
                rightX: faceProfile.f1ExtRight,
                labelY: rails.bottom.faceLabel,
                topY: bottomY,
                stripBottomY: bottomY + 3,
                lowerArrowEndY: bottomY + 20,
                upperGuideX1: faceProfile.f2GuideUpperStartX,
                upperGuideX2: hubFaceRight - 1,
                lowerGuideX1: faceProfile.f2GuideLowerStartX,
                lowerGuideX2: boreRight + 4,
                color,
            })
            : []),
    ];
};
