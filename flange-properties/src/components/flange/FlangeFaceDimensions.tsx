import { FaceDiameterDimension, FaceGrooveDimension, FaceStripDimension } from "./FlangeDimensionPrimitives";
import type { FlangeDimensionRails, FlangeFaceProfile } from "./flangeDrawingModel";
import type { FlangePositions } from "./flangeGeometry";

type FlangeFaceDimensionsProps = {
    pos: FlangePositions;
    rails: FlangeDimensionRails;
    faceProfile: FlangeFaceProfile;
    color: string;
};

export default function FlangeFaceDimensions({ pos, rails, faceProfile, color }: FlangeFaceDimensionsProps) {
    const {
        centerX,
        bottomY,
        hubFaceLeft,
        hubFaceRight,
        boreRight,
    } = pos;

    return (
        <>
            {/* F1 face strip dimension */}
            {faceProfile.showsF1 && (
                <FaceStripDimension
                    label="F1"
                    annotationX={faceProfile.f1AnnotX}
                    labelY={rails.bottom.faceLabel}
                    topY={bottomY}
                    stripBottomY={bottomY + 3}
                    lowerArrowEndY={bottomY + 20}
                    extLeftX={faceProfile.f1ExtLeft}
                    extRightX={faceProfile.f1ExtRight}
                    color={color}
                />
            )}

            {/* D1 face diameter */}
            {faceProfile.showsD1 && (
                <FaceDiameterDimension
                    label="D1"
                    labelX={centerX}
                    labelY={rails.bottom.faceDiameter - 3}
                    x1={hubFaceLeft}
                    x2={hubFaceRight}
                    y={rails.bottom.faceDiameter}
                    extensionX={hubFaceRight}
                    extensionY1={bottomY + 5}
                    extensionY2={bottomY + 27}
                    color={color}
                />
            )}

            {/* F2 face groove dimensions */}
            {faceProfile.showsF2 && (
                <FaceGrooveDimension
                    label="F2"
                    leftX={faceProfile.f2AnnotX}
                    rightX={faceProfile.f1ExtRight}
                    labelY={rails.bottom.faceLabel}
                    topY={bottomY}
                    stripBottomY={bottomY + 3}
                    lowerArrowEndY={bottomY + 20}
                    upperGuideX1={faceProfile.f2GuideUpperStartX}
                    upperGuideX2={hubFaceRight - 1}
                    lowerGuideX1={faceProfile.f2GuideLowerStartX}
                    lowerGuideX2={boreRight + 4}
                    color={color}
                />
            )}
        </>
    );
}
