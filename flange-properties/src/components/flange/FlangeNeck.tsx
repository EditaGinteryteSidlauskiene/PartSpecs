import type { FlangePositions } from "./flangeGeometry";

type FlangeNeckProps = {
    flangeType?: string;
    pos: FlangePositions;
};

export default function FlangeNeck({ flangeType, pos }: FlangeNeckProps) {
    const { topY, hubNeckRight, boreLeft, boreRight, neckTopY, neckWall } = pos;
    const stroke = "rgb(34, 33, 33)";
    const boreMid = (boreLeft + boreRight) / 2 + 2;

    if (flangeType === "01") {
        return (
            <>
                <line x1={boreMid} y1={topY} x2={hubNeckRight} y2={topY} stroke={stroke} strokeWidth="1" />
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
                <line x1={boreMid} y1={topY} x2={hubNeckRight} y2={topY} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    if (flangeType === "11") {
        const junctionY1 = neckTopY + 6;
        const junctionY2 = neckTopY + 4;

        const neckBoreRight = boreRight + neckWall;
        const rightContour = `M${hubNeckRight},${topY} A3,3,0,0,1,${hubNeckRight - 3},${topY - 1.5} L${neckBoreRight + 0.5},${junctionY1} A3,5,0,0,1,${neckBoreRight},${junctionY2} L${neckBoreRight},${neckTopY}`;

        return (
            <>
                {/* Right neck fill */}
                <path d={`${rightContour} L${boreRight},${neckTopY} L${boreRight},${topY} Z`}
                    fill="url(#type01-hatch)" stroke="none" />


                {/* Right side contour */}
                <path d={rightContour} fill="none" stroke={stroke} strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />

                {/* Top: bore opening from center to right + right end face (horizontal) */}
                <line x1={boreMid} y1={neckTopY} x2={boreRight} y2={neckTopY} stroke={stroke} strokeWidth="1" />
                <line x1={boreRight} y1={neckTopY} x2={neckBoreRight} y2={neckTopY} stroke={stroke} strokeWidth="1" />

                {/* Right bore wall extension upward through the neck */}
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
