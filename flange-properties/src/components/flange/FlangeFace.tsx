import type { FlangePositions } from "./flangeGeometry";

type FlangeFaceProps = {
    face?: string | null;
    flangeType?: string;
    pos: FlangePositions;
};

const FACE_STRIP = 3;

export default function FlangeFace({ face, flangeType, pos }: FlangeFaceProps) {
    const isType05 = flangeType === "05" || flangeType === "5";
    const { bottomY, hubFaceLeft, hubFaceRight, boreLeft, boreRight, hubFaceWidth } = pos;

    const stroke = "rgb(34, 33, 33)";
    const fL = (offset: number) => hubFaceLeft + hubFaceWidth * (offset / 26);
    const fR = (offset: number) => hubFaceRight - hubFaceWidth * (offset / 26);

    if (face === "A" || face === null) {
        const stripTop = bottomY - FACE_STRIP;
        return (
            <>
                <rect x={hubFaceLeft} y={stripTop} width={hubFaceWidth} height={FACE_STRIP} fill="url(#type01-hatch)" />
                <line x1={hubFaceLeft} y1={bottomY} x2={boreLeft} y2={bottomY} stroke={stroke} strokeWidth="1" />
                <line x1={boreLeft} y1={bottomY} x2={boreRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
                <rect x={boreRight} y={stripTop} width={hubFaceWidth} height={FACE_STRIP} fill="url(#type01-hatch)" />
                <line x1={boreRight} y1={bottomY} x2={hubFaceRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    const stripBottom = bottomY + FACE_STRIP;

    if (face === "B" || face === "E") {
        return (
            <>
                <rect x={hubFaceLeft} y={bottomY} width={hubFaceWidth} height={FACE_STRIP} fill="url(#type01-hatch)" />
                {isType05 && <rect x={boreLeft} y={bottomY} width={boreRight - boreLeft} height={FACE_STRIP} fill="url(#type01-hatch)" />}
                <line x1={hubFaceLeft} y1={bottomY} x2={hubFaceLeft} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={hubFaceLeft} y1={stripBottom} x2={boreLeft} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                {!isType05 && <line x1={boreLeft} y1={bottomY} x2={boreLeft} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
                <line x1={boreLeft} y1={stripBottom} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                {!isType05 && <line x1={boreRight} y1={bottomY} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
                <rect x={boreRight} y={bottomY} width={hubFaceWidth} height={FACE_STRIP} fill="url(#type01-hatch)" />
                <line x1={boreRight} y1={stripBottom} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={hubFaceRight} y1={bottomY} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    if (face === "C" || face === "F" || face === "G") {
        const cl1 = fL(5);
        const cl2 = fL(20);
        const cr1 = fR(20);
        const cr2 = fR(5);
        return (
            <>
                <rect x={cl1} y={bottomY} width={cl2 - cl1} height={FACE_STRIP} fill="url(#type01-hatch)" />
                <line x1={hubFaceLeft} y1={bottomY} x2={cl1} y2={bottomY} stroke={stroke} strokeWidth="1" />
                <line x1={cl1} y1={bottomY} x2={cl1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={cl1} y1={stripBottom} x2={cl2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={cl2} y1={bottomY} x2={cl2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={cl2} y1={bottomY} x2={cr1} y2={bottomY} stroke={stroke} strokeWidth="1" />
                <line x1={cr1} y1={bottomY} x2={cr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <rect x={cr1} y={bottomY} width={cr2 - cr1} height={FACE_STRIP} fill="url(#type01-hatch)" />
                <line x1={cr1} y1={stripBottom} x2={cr2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={cr2} y1={bottomY} x2={cr2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={cr2} y1={bottomY} x2={hubFaceRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    if (face === "D") {
        const dl1 = fL(2);
        const dl2 = fL(10);
        const dl3 = fL(17);
        const dr1 = fR(15);
        const dr2 = fR(8);
        const smallW = hubFaceWidth * 5 / 26;
        return (
            <>
                <rect x={dl1} y={bottomY} width={dl3 - dl1} height={FACE_STRIP} fill="url(#type01-hatch)" />
                <rect x={dl3} y={bottomY} width={smallW} height={FACE_STRIP} fill="url(#type01-hatch)" />
                {isType05 && <rect x={fL(22)} y={bottomY} width={boreRight - boreLeft} height={FACE_STRIP} fill="url(#type01-hatch)" />}
                <line x1={hubFaceLeft} y1={bottomY} x2={dl1} y2={bottomY} stroke={stroke} strokeWidth="1" />
                <line x1={dl1} y1={bottomY} x2={dl1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={dl1} y1={stripBottom} x2={dl2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={dl2} y1={bottomY} x2={dl2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={dl2} y1={bottomY} x2={dl3} y2={bottomY} stroke={stroke} strokeWidth="1" />
                <line x1={dl3} y1={bottomY} x2={dl3} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                {!isType05 && <line x1={boreLeft} y1={bottomY} x2={boreLeft} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
                {!isType05 && <line x1={boreRight} y1={bottomY} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
                <rect x={boreRight} y={bottomY} width={smallW} height={FACE_STRIP} fill="url(#type01-hatch)" />
                <rect x={dr2} y={bottomY} width={smallW} height={FACE_STRIP} fill="url(#type01-hatch)" />

                <line x1={dl3} y1={stripBottom} x2={dr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={dr1} y1={bottomY} x2={dr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={dr1} y1={bottomY} x2={dr2} y2={bottomY} stroke={stroke} strokeWidth="1" />
                <line x1={dr2} y1={bottomY} x2={dr2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={dr2} y1={stripBottom} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={hubFaceRight} y1={bottomY} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    if (face === "H") {
        const hl2 = fL(10);
        const hl3 = fL(15);
        const hl4 = fL(17);
        const hr1 = fR(17);
        const hr2 = fR(15);
        const hr3 = fR(10);
        const arcR = hubFaceWidth * 2 / 26;
        const hatchW = hubFaceWidth * 6 / 26;
        const hl1 = fL(2);
        const rRectX = boreRight - hubFaceWidth / 26;

        return (
            <>
                <rect x={hl1} y={bottomY - FACE_STRIP} width={hl4 - hl1} height={FACE_STRIP} fill="url(#type01-hatch)" />
                <rect x={hl4} y={bottomY - 2} width={hatchW} height={5} fill="url(#type01-hatch)" />
                {isType05 && <rect x={fL(22)} y={bottomY} width={boreRight - boreLeft} height={FACE_STRIP} fill="url(#type01-hatch)" />}
                <line x1={hubFaceLeft} y1={bottomY} x2={hl2} y2={bottomY} stroke={stroke} strokeWidth="1" />
                <line x1={hl2} y1={bottomY} x2={hl3} y2={bottomY - 2} stroke={stroke} strokeWidth="1" />
                <path d={`M${hl3} ${bottomY - 2} A${arcR} ${arcR} 0 0 1 ${hl4} ${bottomY}`} fill="none" stroke={stroke} strokeWidth="1" />

                <line x1={hl4} y1={bottomY} x2={hl4} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                {!isType05 && <line x1={boreLeft} y1={bottomY} x2={boreLeft} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
                {!isType05 && <line x1={boreRight} y1={bottomY} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />}

                <rect x={rRectX} y={bottomY - 2} width={hatchW} height={5} fill="url(#type01-hatch)" />

                <line x1={hl4} y1={stripBottom} x2={hr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <line x1={hr1} y1={bottomY} x2={hr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
                <path d={`M${hr1} ${bottomY} A${arcR} ${arcR} 0 0 1 ${hr2} ${bottomY - 2}`} fill="none" stroke={stroke} strokeWidth="1" />
                <line x1={hr2} y1={bottomY - 2} x2={hr3} y2={bottomY} stroke={stroke} strokeWidth="1" />
                <line x1={hr3} y1={bottomY} x2={hubFaceRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
            </>
        );
    }

    return null;
}

