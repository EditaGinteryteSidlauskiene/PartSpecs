import type { FlangePositions } from "./flangeGeometry";
import { isFlangeType05 } from "./flangeTypes";

type FlangeFaceProps = {
    face?: string | null;
    flangeType?: string;
    pos: FlangePositions;
};

const FACE_STRIP = 3;

export default function FlangeFace({ face, flangeType, pos }: FlangeFaceProps) {
    const isType05 = isFlangeType05(flangeType);
    const { bottomY, hubFaceRight, boreLeft, boreRight, hubFaceWidth } = pos;

    const stroke = "rgb(34, 33, 33)";
    const fR = (offset: number) => hubFaceRight - hubFaceWidth * (offset / 26);
    const boreMidLightning = (boreLeft + boreRight) / 2 + 5;

    if (face === "A" || face === null) {
        return (
            <>
              <line x1={boreMidLightning} y1={bottomY} x2={hubFaceRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    const stripBottom = bottomY + FACE_STRIP;

    if (face === "B" || face === "E") {
        return (
            <>
                {isType05 && <rect x={boreMidLightning} y={bottomY} width={(boreRight - boreLeft) / 2} height={FACE_STRIP} fill="url(#type01-hatch)" />}
                {!isType05 && <line x1={boreMidLightning} y1={bottomY} x2={boreMidLightning} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
                <line x1={boreMidLightning} y1={stripBottom} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                {!isType05 && <line x1={boreRight} y1={bottomY} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
                <rect x={boreRight} y={bottomY} width={hubFaceWidth} height={FACE_STRIP} fill="url(#type01-hatch)" />
                <line x1={boreRight} y1={stripBottom} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={hubFaceRight} y1={bottomY} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    if (face === "C" || face === "F" || face === "G") {
        const cr1 = fR(20);
        const cr2 = fR(5);
        return (
            <>
                <line x1={boreMidLightning} y1={bottomY + 2} x2={cr1} y2={bottomY + 2} stroke={stroke} strokeWidth="1" />
                <line x1={cr1} y1={bottomY} x2={cr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <rect x={cr1} y={bottomY} width={cr2 - cr1} height={FACE_STRIP} fill="url(#type01-hatch)" />
                <line x1={cr1} y1={stripBottom} x2={cr2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={cr2} y1={bottomY} x2={cr2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={cr2} y1={bottomY} x2={hubFaceRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    if (face === "D") {
        const dr1 = fR(15);
        const dr2 = fR(8);
        return (
            <>
                {isType05 && <rect x={boreMidLightning} y={bottomY} width={dr2 - boreMidLightning} height={FACE_STRIP} fill="url(#type01-hatch)" />}
                {!isType05 && <line x1={boreMidLightning} y1={bottomY} x2={boreMidLightning} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
                {!isType05 && <line x1={boreRight} y1={bottomY} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />}

                <line x1={boreMidLightning} y1={stripBottom} x2={dr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={dr1} y1={bottomY} x2={dr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={dr1} y1={bottomY} x2={dr2} y2={bottomY} stroke={stroke} strokeWidth="1" />
                <line x1={dr2} y1={bottomY} x2={dr2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={dr2} y1={stripBottom} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={hubFaceRight} y1={bottomY} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    if (face === "H") {
        const hr1 = fR(17);
        const hr2 = fR(15);
        const hr3 = fR(10);
        const arcR = hubFaceWidth * 2 / 26;
        const hatchW = hubFaceWidth * 6 / 26;
        const rRectX = boreRight - hubFaceWidth / 26;

        return (
            <>
                {!isType05 && <line x1={boreRight} y1={bottomY} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
                <rect x={rRectX} y={bottomY - 2} width={hatchW} height={5} fill="url(#type01-hatch)" />

                <line x1={boreMidLightning} y1={stripBottom} x2={isType05 ? boreMidLightning + 20 : hr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={isType05 ? boreMidLightning + 20 : hr1} y1={bottomY} x2={isType05 ? boreMidLightning + 20 : hr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <path d={`M${isType05 ? boreMidLightning + 20 : hr1} ${bottomY} A${arcR} ${arcR} 0 0 1 ${isType05 ? boreMidLightning + 22 : hr2} ${bottomY - 2}`} fill="none" stroke={stroke} strokeWidth="1" />
                <line x1={isType05 ? boreMidLightning + 22 : hr2} y1={bottomY - 2} x2={isType05 ? boreMidLightning + 27 : hr3} y2={bottomY} stroke={stroke} strokeWidth="1" />
                <line x1={isType05 ? boreMidLightning + 27 : hr3} y1={bottomY} x2={hubFaceRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    return null;
}
