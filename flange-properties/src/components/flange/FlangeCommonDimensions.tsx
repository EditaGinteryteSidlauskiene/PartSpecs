import { BoltHoleCallout, DiameterDimension, ExtensionLine, VerticalDimension } from "./FlangeDimensionPrimitives";
import type { FlangeDimensionRails } from "./flangeDrawingModel";
import type { FlangePositions } from "./flangeGeometry";
import { getMeasureValue, type FlangeLookupResponse } from "./flangeMeasures";
import { isFlangeType05, isFlangeType11 } from "./flangeTypes";

type FlangeCommonDimensionsProps = {
    response: FlangeLookupResponse | null;
    flangeType?: string;
    pos: FlangePositions;
    rails: FlangeDimensionRails;
    cLowerLineY: number;
    color: string;
};

export default function FlangeCommonDimensions({ response, flangeType, pos, rails, cLowerLineY, color }: FlangeCommonDimensionsProps) {
    const isType05 = isFlangeType05(flangeType);
    const isType11 = isFlangeType11(flangeType);

    const {
        centerX,
        topY,
        bottomY,
        outerRight,
        boltOuterRight,
        boltCenterRight,
        hubRight,
        hubFaceRight,
        boreRight,
    } = pos;

    const measureValue = (...keys: string[]): string | number => getMeasureValue(response?.measures, ...keys);
    const kLineY = rails.top.boltCircle;
    const kExtTopY = isType11 ? kLineY - 4 : topY - 16;

    return (
        <>
            {/* Bolt hole count and size */}
            <BoltHoleCallout
                countAndDiameterLabel={`${response?.count?.value ?? response?.count?.instruction ?? "-"}×⌀${measureValue("L", "2")}`}
                boltSizeLabel={response?.boltSize ?? "-"}
                textX={hubRight - 18}
                textY={rails.bottom.boltHoleText}
                sizeTextY={rails.bottom.boltSizeText}
                leftExtensionX={hubRight}
                rightExtensionX={boltOuterRight}
                extensionY1={bottomY + 2}
                extensionY2={bottomY + 19}
                leftArrowStartX={hubRight - 35}
                rightArrowStartX={boltOuterRight + 9}
                arrowY={rails.bottom.boltHoleArrow}
                color={color}
            />

            {/* K diameter */}
            <DiameterDimension
                label={`⌀${measureValue("K", "1")}`}
                centerX={centerX}
                targetX={boltCenterRight}
                y={kLineY}
                extensionX={boltCenterRight}
                extensionY1={topY - 5}
                extensionY2={kExtTopY}
                color={color}
            />

            {/* Bore B diameter */}
            {!isType05 && !isType11 && (
                <>
                    <DiameterDimension
                        label={`⌀${measureValue("B1", "B2", "B3", "4", "5", "6")}`}
                        centerX={centerX}
                        targetX={boreRight}
                        y={rails.bottom.boreDiameter}
                        color={color}
                    />
                    <ExtensionLine x={boreRight} y1={bottomY + 5} y2={bottomY + 22} color={color} />
                </>
            )}

            {/* D outer diameter */}
            <DiameterDimension
                label={`⌀${isType11 ? measureValue("D", "0", "A") : measureValue("D", "0")}`}
                centerX={centerX}
                targetX={outerRight}
                y={rails.bottom.outerDiameter}
                color={color}
            />
            <ExtensionLine x={outerRight} y1={bottomY + 5} y2={bottomY + 36} color={color} />

            {/* C thickness */}
            <VerticalDimension
                label={`${isType11 ? measureValue("C2") : measureValue("C1", "C2", "C3", "C4", "7", "8", "9", "10")}`}
                x={rails.right.thickness}
                textX={rails.right.thicknessText}
                y1={topY}
                y2={cLowerLineY}
                topExtensionX1={outerRight + 3}
                bottomExtensionX1={hubFaceRight - 1}
                extensionX2={rails.right.thickness + 2}
                color={color}
            />
        </>
    );
}
