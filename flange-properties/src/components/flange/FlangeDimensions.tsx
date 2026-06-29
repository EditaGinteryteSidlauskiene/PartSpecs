import FlangeCommonDimensions from "./FlangeCommonDimensions";
import FlangeFaceDimensions from "./FlangeFaceDimensions";
import FlangeType11Dimensions from "./FlangeType11Dimensions";
import type { FlangeDimensionRails, FlangeFaceProfile } from "./flangeDrawingModel";
import type { FlangePositions } from "./flangeGeometry";
import type { FlangeLookupResponse } from "./flangeMeasures";
import { isFlangeType11 } from "./flangeTypes";

type FlangeDimensionsProps = {
    response: FlangeLookupResponse | null;
    flangeType?: string;
    pos: FlangePositions;
    rails: FlangeDimensionRails;
    faceProfile: FlangeFaceProfile;
};

export default function FlangeDimensions({ response, flangeType, pos, rails, faceProfile }: FlangeDimensionsProps) {
    const isType11 = isFlangeType11(flangeType);

    const {
        bottomY,
    } = pos;

    const cLowerLineY = faceProfile.isFaceA ? bottomY : bottomY + 3;

    const dimColor = "rgb(24, 93, 44)";

    return (
        <>
            <FlangeCommonDimensions
                response={response}
                flangeType={flangeType}
                pos={pos}
                rails={rails}
                cLowerLineY={cLowerLineY}
                color={dimColor}
            />

            {/* Type 11 specific dimensions */}
            {isType11 && (
                <FlangeType11Dimensions
                    measures={response?.measures}
                    pos={pos}
                    rails={rails}
                    faceProfile={faceProfile}
                    cLowerLineY={cLowerLineY}
                    color={dimColor}
                />
            )}

            <FlangeFaceDimensions
                pos={pos}
                rails={rails}
                faceProfile={faceProfile}
                color={dimColor}
            />
        </>
    );
}
