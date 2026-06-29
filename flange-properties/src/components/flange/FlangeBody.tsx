import type { FlangePositions } from "./flangeGeometry";
import { isFlangeType05, isFlangeType11 } from "./flangeTypes";

type FlangeBodyProps = {
    flangeType?: string;
    pos: FlangePositions;
};

export default function FlangeBody({ flangeType, pos }: FlangeBodyProps) {
    const isType05 = isFlangeType05(flangeType);
    const isType11 = isFlangeType11(flangeType);

    const {
        topY, bottomY, outerRight,
        boltOuterRight,
        boltCenterRight,
        hubRight,
        hubFaceRight,
        hubNeckRight,
        boreLeft, boreRight,
        neckTopY,
    } = pos;

    const thickness = bottomY - topY;
    const centerLineTopY = topY - 2;
    const stroke = "rgb(34, 33, 33)";
    const dashStroke = "rgb(100, 97, 97)";
    
    const lightningTopY = isType11 ? neckTopY : topY;
    const hubFillStartX = boreRight;

    return (
        <>
            {/* Right hub */}
            <rect x={hubFillStartX} y={topY} width={hubRight - hubFillStartX} height={thickness} fill="url(#type01-hatch)" />
            {isType05 ? (
                // Type 5: lightning bolt at center, no bore area
                <>
                    <path d={`M${boreRight + 2},${topY} L${boreRight + 5},${topY + 8} L${boreRight},${topY + 12} L${boreRight + 5},${bottomY}`}
                          fill="none" stroke={dashStroke} strokeWidth="1.5" />
                    <path d={`M${boreRight + 2},${topY} L${boreRight + 5},${topY + 8} L${boreRight},${topY + 12} L${boreRight + 5},${bottomY}`}
                          fill="none" stroke="rgb(255, 255, 255)" strokeWidth="0.5" opacity="0.6" />
                </>
            ) : (
                <>
                    {/* Bore line */}
                    <line x1={boreRight} y1={topY} x2={boreRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
                    {/* Lightning bolt at bore middle to show missing half */}
                    <path d={`M${(boreLeft + boreRight) / 2 + 2},${lightningTopY} L${(boreLeft + boreRight) / 2 + 5},${lightningTopY + 8} L${(boreLeft + boreRight) / 2},${lightningTopY + 12} L${(boreLeft + boreRight) / 2 + 5},${bottomY}`}
                          fill="none" stroke={dashStroke} strokeWidth="1.5" />
                    <path d={`M${(boreLeft + boreRight) / 2 + 2},${lightningTopY} L${(boreLeft + boreRight) / 2 + 5},${lightningTopY + 8} L${(boreLeft + boreRight) / 2},${lightningTopY + 12} L${(boreLeft + boreRight) / 2 + 5},${bottomY}`}
                          fill="none" stroke="rgb(255, 255, 255)" strokeWidth="0.5" opacity="0.6" />
                    {/* Bore fill area */}
                    <rect x={(boreLeft + boreRight) / 2 + 4} y={topY} width={(boreRight - boreLeft) / 2 - 2} height={lightningTopY + 8 - lightningTopY} fill="none" />
                    <rect x={(boreLeft + boreRight) / 2 + 1.5} y={lightningTopY + 8} width={(boreRight - boreLeft) / 2 - 1.5} height={(bottomY - (lightningTopY + 12)) / 2} fill="none" />
                    <rect x={(boreLeft + boreRight) / 2 + 3.5} y={lightningTopY + (bottomY - (lightningTopY + 12)) / 2} width={(boreRight - boreLeft) / 2 - 1.5} height={bottomY - (lightningTopY + (bottomY - (lightningTopY + 12)) / 2)} fill="none" />
                </>
            )}
            <line x1={hubNeckRight} y1={topY} x2={hubFaceRight} y2={topY} stroke={stroke} strokeWidth="1" />
            <line x1={hubFaceRight} y1={topY} x2={hubRight} y2={topY} stroke={stroke} strokeWidth="1" />
            <line x1={hubRight} y1={topY} x2={hubRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={hubFaceRight} y1={bottomY} x2={hubRight} y2={bottomY} stroke={stroke} strokeWidth="1" />

            {/* Right bolt zone */}
            <rect x={hubRight} y={topY} width={boltOuterRight - hubRight} height={thickness} fill="none" />
            <line x1={hubRight} y1={topY} x2={boltOuterRight} y2={topY} stroke={stroke} strokeWidth="1" />
            <line x1={hubRight} y1={topY} x2={hubRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={hubRight} y1={bottomY} x2={boltOuterRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={boltOuterRight} y1={topY} x2={boltOuterRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={boltCenterRight} y1={centerLineTopY} x2={boltCenterRight} y2={bottomY} stroke={dashStroke} strokeWidth="0.75" strokeDasharray="8,3" />

            {/* Right outer rim */}
            <rect x={boltOuterRight} y={topY} width={outerRight - boltOuterRight} height={thickness} fill="url(#type01-hatch)" />
            <line x1={boltOuterRight} y1={topY} x2={outerRight} y2={topY} stroke={stroke} strokeWidth="1" />
            <line x1={boltOuterRight} y1={bottomY} x2={outerRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={outerRight} y1={topY} x2={outerRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
        </>
    );
}
