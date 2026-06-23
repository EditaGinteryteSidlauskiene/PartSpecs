import type { FlangePositions } from "./flangeGeometry";

type FlangeNeckProps = {
    flangeType?: string;
    pos: FlangePositions;
};

export default function FlangeNeck({ flangeType, pos }: FlangeNeckProps) {
    const { topY, hubNeckLeft, hubNeckRight, boreLeft, boreRight } = pos;
    const stroke = "rgb(34, 33, 33)";

    if (flangeType === "01") {
        return (
            <>
                <line x1={hubNeckLeft} y1={topY} x2={hubNeckRight} y2={topY} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    if (flangeType === "02") {
        return null;
    }

    if (flangeType === "04") {
        return null;
    }

    if (flangeType === "05") {
        return (
            <>
                <line x1={hubNeckLeft} y1={topY} x2={hubNeckRight} y2={topY} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    if (flangeType === "11") {
        const neckWall = 2;
        const neckTopY = topY - 29;
        const junctionY1 = topY - 23;
        const junctionY2 = topY - 25;

        const neckBoreLeft = boreLeft - neckWall;
        const neckBoreRight = boreRight + neckWall;

        return (
            <>
                {/* Left neck fill */}
                <path d={`M${hubNeckLeft},${topY} A3,3,0,0,1,${hubNeckLeft + 3},${topY - 3} L${neckBoreLeft - 1},${junctionY1} A4,4,0,0,1,${neckBoreLeft},${junctionY2} L${neckBoreLeft},${neckTopY} L${boreLeft},${neckTopY} L${boreLeft},${topY} Z`}
                    fill="url(#type01-hatch)" stroke="none" />
                {/* Right neck fill */}
                <path d={`M${hubNeckRight},${topY} A3,3,0,0,0,${hubNeckRight - 3},${topY - 3} L${neckBoreRight + 1},${junctionY1} A4,4,0,0,0,${neckBoreRight},${junctionY2} L${neckBoreRight},${neckTopY} L${boreRight},${neckTopY} L${boreRight},${topY} Z`}
                    fill="url(#type01-hatch)" stroke="none" />

                {/* Left side: arc, straight, arc, vertical */}
                <path d={`M${hubNeckLeft},${topY} A3,3 0 0 0 ${hubNeckLeft + 3},${topY - 3}`} fill="none" stroke={stroke} strokeWidth="1" />
                <line x1={hubNeckLeft + 3} y1={topY - 3} x2={neckBoreLeft - 1} y2={junctionY1} stroke={stroke} strokeWidth="1" />
                <path d={`M${neckBoreLeft - 1},${junctionY1} A4,4 0 0 1 ${neckBoreLeft},${junctionY2}`} fill="none" stroke={stroke} strokeWidth="1" />
                <line x1={neckBoreLeft} y1={junctionY2} x2={neckBoreLeft} y2={neckTopY} stroke={stroke} strokeWidth="1" />

                {/* Right side: arc, straight, arc, vertical */}
                <path d={`M${hubNeckRight},${topY} A3,3 0 0 1 ${hubNeckRight - 3},${topY - 3}`} fill="none" stroke={stroke} strokeWidth="1" />
                <line x1={hubNeckRight - 3} y1={topY - 3} x2={neckBoreRight + 1} y2={junctionY1} stroke={stroke} strokeWidth="1" />
                <path d={`M${neckBoreRight + 1},${junctionY1} A4,4 0 0 0 ${neckBoreRight},${junctionY2}`} fill="none" stroke={stroke} strokeWidth="1" />
                <line x1={neckBoreRight} y1={junctionY2} x2={neckBoreRight} y2={neckTopY} stroke={stroke} strokeWidth="1" />

                {/* Top: left end face + bore opening + right end face (horizontal) */}
                <line x1={neckBoreLeft} y1={neckTopY} x2={boreLeft} y2={neckTopY} stroke={stroke} strokeWidth="1" />
                <line x1={boreLeft} y1={neckTopY} x2={boreRight} y2={neckTopY} stroke={stroke} strokeWidth="1" />
                <line x1={boreRight} y1={neckTopY} x2={neckBoreRight} y2={neckTopY} stroke={stroke} strokeWidth="1" />

                {/* Bore wall extensions upward through the neck */}
                <line x1={boreLeft} y1={neckTopY} x2={boreLeft} y2={topY} stroke={stroke} strokeWidth="1" />
                <line x1={boreRight} y1={neckTopY} x2={boreRight} y2={topY} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    if (flangeType === "12") {
        return null;
    }

    if (flangeType === "13") {
        return null;
    }

    if (flangeType === "21") {
        return null;
    }

    if (flangeType === "32") {
        return null;
    }

    if (flangeType === "33") {
        return null;
    }

    if (flangeType === "34") {
        return null;
    }

    if (flangeType === "35") {
        return null;
    }

    if (flangeType === "36") {
        return null;
    }

    if (flangeType === "37") {
        return null;
    }

    return null;
}
