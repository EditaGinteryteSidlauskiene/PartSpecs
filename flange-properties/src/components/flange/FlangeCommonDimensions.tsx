import { BoltHoleCallout, DiameterDimension, ExtensionLine, VerticalDimension } from "./FlangeDimensionPrimitives";
import type { FlangeDimensionRails, FlangeHalfSectionAnchors } from "./flangeDrawingModel";
import type { FlangePositions } from "./flangeGeometry";
import { getMeasureValue, type FlangeLookupResponse } from "./flangeMeasures";
import type { FlangeTypeDefinition } from "./flangeTypes";

type FlangeCommonDimensionsProps = {
    response: FlangeLookupResponse | null;
    typeDefinition?: FlangeTypeDefinition;
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
    rails: FlangeDimensionRails;
    cLowerLineY: number;
    color: string;
};

export default function FlangeCommonDimensions({ response, typeDefinition, halfSection, pos, rails, cLowerLineY, color }: FlangeCommonDimensionsProps) {
    const definition = typeDefinition;

    const {
        centerX,
        topY,
        bottomY,
        boltOuterRight,
        hubRight,
    } = pos;

    const measureValue = (...keys: string[]): string | number => getMeasureValue(response?.measures, ...keys);
    const kLineY = rails.top.boltCircle;
    const kExtTopY = definition?.type === "11" ? kLineY - 4 : topY - 16;
    const boreDiameterKeys = definition?.boreDiameterKeys ?? ["B1", "B2", "B3", "4", "5", "6"];
    const outerDiameterKeys = definition?.outerDiameterKeys ?? ["D", "0"];
    const thicknessKeys = definition?.thicknessKeys ?? ["C1", "C2", "C3", "C4", "7", "8", "9", "10"];
    const boltCircleKeys = definition?.boltCircleKeys ?? ["K", "1"];
    const boltHoleKeys = definition?.boltHoleKeys ?? ["L", "2"];

    return (
        <>
            {/* Bolt hole count and size */}
            <BoltHoleCallout
                countAndDiameterLabel={`${response?.count?.value ?? response?.count?.instruction ?? "-"}×⌀${measureValue(...boltHoleKeys)}`}
                boltSizeLabel={response?.boltSize ?? "-"}
                textX={hubRight - 18}
                textY={rails.bottom.boltHoleText}
                sizeTextY={rails.bottom.boltSizeText}
                leftExtensionX={hubRight}
                rightExtensionX={boltOuterRight}
                extensionY1={bottomY + 2}
                extensionY2={bottomY + 19}
                leftArrowStartX={hubRight - 35}
                rightArrowStartX={halfSection.boltOuterX + 9}
                arrowY={rails.bottom.boltHoleArrow}
                color={color}
            />

            {/* K diameter */}
            <DiameterDimension
                label={`⌀${measureValue(...boltCircleKeys)}`}
                centerX={centerX}
                targetX={halfSection.boltCenterX}
                y={kLineY}
                extensionX={halfSection.boltCenterX}
                extensionY1={topY - 5}
                extensionY2={kExtTopY}
                color={color}
            />

            {/* Bore B diameter */}
            {definition?.showCommonBoreDiameter !== false && (
                <>
                    <DiameterDimension
                        label={`⌀${measureValue(...boreDiameterKeys)}`}
                        centerX={centerX}
                        targetX={halfSection.boreWallX}
                        y={rails.bottom.boreDiameter}
                        color={color}
                    />
                    <ExtensionLine x={halfSection.boreWallX} y1={bottomY + 5} y2={bottomY + 22} color={color} />
                </>
            )}

            {/* D outer diameter */}
            <DiameterDimension
                label={`⌀${measureValue(...outerDiameterKeys)}`}
                centerX={centerX}
                targetX={halfSection.outerEdgeX}
                y={rails.bottom.outerDiameter}
                color={color}
            />
            <ExtensionLine x={halfSection.outerEdgeX} y1={bottomY + 5} y2={bottomY + 36} color={color} />

            {/* C thickness */}
            <VerticalDimension
                label={`${measureValue(...thicknessKeys)}`}
                x={rails.right.thickness}
                textX={rails.right.thicknessText}
                y1={topY}
                y2={cLowerLineY}
                topExtensionX1={halfSection.outerEdgeX + 3}
                bottomExtensionX1={halfSection.hubFaceX - 1}
                extensionX2={rails.right.thickness + 2}
                color={color}
            />
        </>
    );
}
