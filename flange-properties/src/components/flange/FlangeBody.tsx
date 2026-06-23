import type { FlangePositions } from "./flangeGeometry";

type FlangeBodyProps = {
    flangeType?: string;
    pos: FlangePositions;
};

export default function FlangeBody({ flangeType, pos }: FlangeBodyProps) {
    const isType05 = flangeType === "05";
    const boreFill = isType05 ? "url(#type01-hatch)" : "none";

    const {
        topY, bottomY, outerLeft, outerRight,
        boltOuterLeft, boltOuterRight,
        boltCenterLeft, boltCenterRight,
        hubLeft, hubRight,
        hubFaceLeft, hubFaceRight,
        hubNeckLeft, hubNeckRight,
        boreLeft, boreRight,
    } = pos;

    const thickness = bottomY - topY;
    const centerLineTopY = topY - 2;
    const stroke = "rgb(34, 33, 33)";
    const dashStroke = "rgb(100, 97, 97)";

    return (
        <>
            {/* Left outer rim */}
            <rect x={outerLeft} y={topY} width={boltOuterLeft - outerLeft} height={thickness} fill="url(#type01-hatch)" />
            <line x1={outerLeft} y1={topY} x2={boltOuterLeft} y2={topY} stroke={stroke} strokeWidth="1" />
            <line x1={outerLeft} y1={topY} x2={outerLeft} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={outerLeft} y1={bottomY} x2={boltOuterLeft} y2={bottomY} stroke={stroke} strokeWidth="1" />

            {/* Left bolt zone */}
            <rect x={boltOuterLeft} y={topY} width={hubLeft - boltOuterLeft} height={thickness} fill="none" />
            <line x1={boltOuterLeft} y1={topY} x2={hubLeft} y2={topY} stroke={stroke} strokeWidth="1" />
            <line x1={boltOuterLeft} y1={topY} x2={boltOuterLeft} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={boltOuterLeft} y1={bottomY} x2={hubLeft} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={hubLeft} y1={topY} x2={hubLeft} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={boltCenterLeft} y1={centerLineTopY} x2={boltCenterLeft} y2={bottomY} stroke={dashStroke} strokeWidth="0.75" strokeDasharray="8,3" />

            {/* Left hub */}
            <rect x={hubLeft} y={topY} width={boreLeft - hubLeft} height={thickness} fill="url(#type01-hatch)" />
            <line x1={hubLeft} y1={topY} x2={hubFaceLeft} y2={topY} stroke={stroke} strokeWidth="1" />
            <line x1={hubLeft} y1={topY} x2={hubLeft} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={hubLeft} y1={bottomY} x2={hubFaceLeft} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={hubFaceLeft} y1={topY} x2={hubNeckLeft} y2={topY} stroke={stroke} strokeWidth="1" />

            {/* Right hub */}
            <rect x={boreRight} y={topY} width={hubRight - boreRight} height={thickness} fill="url(#type01-hatch)" />
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

            {/* Bore */}
            <rect x={boreLeft} y={topY} width={boreRight - boreLeft} height={thickness} fill={boreFill} />
            {!isType05 && <line x1={boreLeft} y1={topY} x2={boreLeft} y2={bottomY} stroke={stroke} strokeWidth="1" />}
            {!isType05 && <line x1={boreRight} y1={topY} x2={boreRight} y2={bottomY} stroke={stroke} strokeWidth="1" />}
        </>
    );
}
