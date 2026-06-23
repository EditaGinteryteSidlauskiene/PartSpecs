import type { FlangePositions } from "./flangeGeometry";

type CountDto = {
    value?: number;
    instruction?: string;
};

type MeasureDto = {
    value?: number;
    instruction?: string;
};

type FlangeDimensionsResponse = {
    count?: CountDto;
    boltSize?: string;
    measures?: Record<string, MeasureDto>;
};

type FlangeDimensionsProps = {
    response: FlangeDimensionsResponse | null;
    flangeType?: string;
    face?: string | null;
    pos: FlangePositions;
};

export default function FlangeDimensions({ response, flangeType, face, pos }: FlangeDimensionsProps) {
    const isType05 = flangeType === "05" || flangeType === "5";
    const isType11 = flangeType === "11";
    const isFaceA = !face || face === "A";
    const normalizedFace = face?.toUpperCase();
    const showsF1 = normalizedFace === "B" || normalizedFace === "D" || normalizedFace === "F" || normalizedFace === "G";
    const showsD1 = normalizedFace === "B" || normalizedFace === "G";
    const showsF2 = normalizedFace === "C" || normalizedFace === "E" || normalizedFace === "G";

    const {
        centerX, topY, bottomY,
        outerLeft, outerRight,
        boltOuterLeft,
        boltCenterLeft, boltCenterRight,
        hubLeft, hubRight,
        hubFaceLeft, hubFaceRight,
        boreLeft, boreRight,
        hubNeckLeft, hubNeckRight,
        hubFaceWidth,
    } = pos;

    const cLowerLineY = isFaceA ? bottomY : bottomY + 3;

    const dimColor = "rgb(24, 93, 44)";

    const neckWall = 2;
    const neckTopY = topY - 29;
    const neckBoreLeft = boreLeft - neckWall;
    const neckBoreRight = boreRight + neckWall;
    const neckOuterLeft = hubNeckLeft + 1;
    const neckOuterRight = hubNeckRight - 1;

    const fR = (offset: number) => hubFaceRight - hubFaceWidth * (offset / 26);

    const getMeasureValue = (...keys: string[]): string | number => {
        const measures = response?.measures;
        if (!measures) {
            return "-";
        }

        for (const key of keys) {
            const byExactKey = measures[key]?.value;
            if (byExactKey !== undefined && byExactKey !== null) {
                return byExactKey;
            }

            const byLowerKey = measures[key.toLowerCase()]?.value;
            if (byLowerKey !== undefined && byLowerKey !== null) {
                return byLowerKey;
            }
        }

        return "-";
    };

    const getMeasureValueOrInstruction = (...keys: string[]): string | number => {
        const measures = response?.measures;
        if (!measures) {
            return "-";
        }

        const formatInstruction = (instruction: string): string =>
            instruction
                .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
                .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                .trim();

        for (const key of keys) {
            const exact = measures[key];
            if (exact?.value !== undefined && exact.value !== null) {
                return exact.value;
            }
            if (exact?.instruction) {
                return formatInstruction(exact.instruction);
            }

            const lower = measures[key.toLowerCase()];
            if (lower?.value !== undefined && lower.value !== null) {
                return lower.value;
            }
            if (lower?.instruction) {
                return formatInstruction(lower.instruction);
            }
        }

        return "-";
    };

    const hasMeasureNumericValue = (...keys: string[]): boolean => {
        const measures = response?.measures;
        if (!measures) {
            return false;
        }

        for (const key of keys) {
            const exactValue = measures[key]?.value;
            if (exactValue !== undefined && exactValue !== null) {
                return true;
            }

            const lowerValue = measures[key.toLowerCase()]?.value;
            if (lowerValue !== undefined && lowerValue !== null) {
                return true;
            }
        }

        return false;
    };

    // Annotation offsets
    const kTextY = isType11 ? topY - 98 : topY - 15;
    const kLineY = isType11 ? topY - 95 : topY - 12;
    const kExtTopY = isType11 ? topY - 99 : topY - 16;

    const f1AnnotX = (hubFaceRight + hubRight) / 2;
    const f1ExtLeft = hubFaceRight + 2;
    const f1ExtRight = hubRight + 6;

    return (
        <>
            {/* Bolt hole count and size */}
            <text x={boltCenterLeft} y={bottomY + 13} textAnchor="middle" fontSize="8" fill={dimColor}>
                {response?.count?.value ?? response?.count?.instruction ?? "-"}×⌀{getMeasureValue("L", "2")}
            </text>
            <line x1={boltOuterLeft} y1={bottomY + 16} x2={hubLeft} y2={bottomY + 16} stroke={dimColor} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={boltOuterLeft} y1={bottomY + 5} x2={boltOuterLeft} y2={bottomY + 20} stroke={dimColor} strokeWidth="0.5" />
            <line x1={hubLeft} y1={bottomY + 5} x2={hubLeft} y2={bottomY + 20} stroke={dimColor} strokeWidth="0.5" />
            <text x={boltCenterLeft} y={bottomY + 25} textAnchor="middle" fontSize="8" fill={dimColor}>{response?.boltSize ?? "-"}</text>

            {/* K diameter */}
            <text x={centerX} y={kTextY} textAnchor="middle" fontSize="8" fill={dimColor}>⌀{getMeasureValue("K", "1")}</text>
            <line x1={boltCenterLeft} y1={kLineY} x2={boltCenterRight} y2={kLineY} stroke={dimColor} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={boltCenterLeft} y1={topY - 5} x2={boltCenterLeft} y2={kExtTopY} stroke={dimColor} strokeWidth="0.5" />
            <line x1={boltCenterRight} y1={topY - 5} x2={boltCenterRight} y2={kExtTopY} stroke={dimColor} strokeWidth="0.5" />

            {/* Bore B diameter */}
            {!isType05 && !isType11 && (
                <>
                    <text x={centerX} y={bottomY + 15} textAnchor="middle" fontSize="8" fill={dimColor}>⌀{getMeasureValue("B1", "B2", "B3", "4", "5", "6")}</text>
                    <line x1={boreLeft} y1={bottomY + 18} x2={boreRight} y2={bottomY + 18} stroke={dimColor} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={boreLeft} y1={bottomY + 5} x2={boreLeft} y2={bottomY + 22} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={boreRight} y1={bottomY + 5} x2={boreRight} y2={bottomY + 22} stroke={dimColor} strokeWidth="0.5" />
                </>
            )}

            {/* D outer diameter */}
            <text x={centerX} y={bottomY + 43} textAnchor="middle" fontSize="8" fill={dimColor}>⌀{isType11 ? getMeasureValue("D", "0", "A") : getMeasureValue("D", "0")}</text>
            <line x1={outerLeft} y1={bottomY + 45} x2={outerRight} y2={bottomY + 45} stroke={dimColor} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={outerLeft} y1={bottomY + 5} x2={outerLeft} y2={bottomY + 49} stroke={dimColor} strokeWidth="0.5" />
            <line x1={outerRight} y1={bottomY + 5} x2={outerRight} y2={bottomY + 49} stroke={dimColor} strokeWidth="0.5" />

            {/* C thickness */}
            <text x={outerRight + 16} y={(topY + cLowerLineY) / 2 + 1} textAnchor="middle" fontSize="8" fill={dimColor}>{isType11 ? getMeasureValue("C2") : getMeasureValue("C1", "C2", "C3", "C4", "7", "8", "9", "10")}</text>
            <line x1={outerRight + 11} y1={topY} x2={outerRight + 11} y2={cLowerLineY} stroke={dimColor} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={outerRight + 3} y1={topY} x2={outerRight + 13} y2={topY} stroke={dimColor} strokeWidth="0.5" />
            <line x1={hubFaceRight - 1} y1={cLowerLineY} x2={outerRight + 13} y2={cLowerLineY} stroke={dimColor} strokeWidth="0.5" />

            {/* Type 11 specific dimensions */}
            {isType11 && (
                <>
                    {/* A (pipe bore) diameter */}
                    <text x={centerX} y={neckTopY - 29} textAnchor="middle" fontSize="8" fill={dimColor}>⌀{getMeasureValue("A", "1")}</text>
                    <line x1={neckBoreLeft} y1={neckTopY - 26} x2={neckBoreRight} y2={neckTopY - 26} stroke={dimColor} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={neckBoreLeft} y1={neckTopY - 11} x2={neckBoreLeft} y2={neckTopY - 29} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={neckBoreRight} y1={neckTopY - 1} x2={neckBoreRight} y2={neckTopY - 29} stroke={dimColor} strokeWidth="0.5" />

                    {/* S (neck wall) */}
                    <text x={hasMeasureNumericValue("S") ? neckBoreLeft + 11 : neckBoreLeft + 26} y={neckTopY - 8} textAnchor="middle" fontSize="8" fill={dimColor}>{getMeasureValueOrInstruction("S")}</text>
                    <line x1={neckBoreLeft} y1={neckTopY - 11} x2={neckBoreLeft} y2={neckTopY - 1} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={boreLeft} y1={neckTopY - 11} x2={boreLeft} y2={neckTopY - 1} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={neckBoreLeft - 9} y1={neckTopY - 6} x2={neckBoreLeft} y2={neckTopY - 6} stroke={dimColor} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={neckBoreLeft + 56} y1={neckTopY - 6} x2={boreLeft} y2={neckTopY - 6} stroke={dimColor} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />

                    {/* R1 (fillet) */}
                    <text x={hubFaceLeft - 4} y={neckTopY + 6} textAnchor="middle" fontSize="8" fill={dimColor}>{getMeasureValue("R1")}</text>
                    <line x1={hubFaceLeft + 1} y1={neckTopY + 8} x2={hubNeckLeft + 2} y2={topY - 1} stroke={dimColor} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={hubFaceLeft + 1} y1={neckTopY + 8} x2={neckBoreLeft - 1} y2={neckTopY + 3} stroke={dimColor} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={hubFaceLeft + 1} y1={neckTopY + 8} x2={hubFaceLeft - 12} y2={neckTopY + 8} stroke={dimColor} strokeWidth="0.5" />

                    {/* H3 (neck step) */}
                    <text x={neckBoreRight + 22} y={neckTopY - 4} textAnchor="middle" fontSize="8" fill={dimColor}>{getMeasureValue("H3")}</text>
                    <line x1={neckBoreRight + 17} y1={neckTopY} x2={neckBoreRight + 17} y2={neckTopY + 4} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={neckBoreRight + 17} y1={neckTopY - 11} x2={neckBoreRight + 17} y2={neckTopY} stroke={dimColor} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green-rev)" />
                    <line x1={neckBoreRight + 17} y1={neckTopY + 4} x2={neckBoreRight + 17} y2={neckTopY + 15} stroke={dimColor} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" />
                    <line x1={neckBoreRight + 2} y1={neckTopY} x2={neckBoreRight + 19} y2={neckTopY} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={neckBoreRight + 2} y1={neckTopY + 4} x2={neckBoreRight + 19} y2={neckTopY + 4} stroke={dimColor} strokeWidth="0.5" />

                    {/* N1 (outer neck) diameter */}
                    <text x={centerX} y={neckTopY - 48} textAnchor="middle" fontSize="8" fill={dimColor}>⌀{getMeasureValue("N1")}</text>
                    <line x1={neckOuterLeft} y1={neckTopY - 45} x2={neckOuterRight} y2={neckTopY - 45} stroke={dimColor} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={neckOuterLeft} y1={topY - 3} x2={neckOuterLeft} y2={neckTopY - 48} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={neckOuterRight} y1={topY - 3} x2={neckOuterRight} y2={neckTopY - 48} stroke={dimColor} strokeWidth="0.5" />

                    {/* H2 (total height) */}
                    <text x={outerRight + 33} y={(neckTopY + cLowerLineY) / 2 + 3} textAnchor="middle" fontSize="8" fill={dimColor}>{getMeasureValue("H2")}</text>
                    <line x1={outerRight + 27} y1={neckTopY} x2={outerRight + 27} y2={cLowerLineY} stroke={dimColor} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={neckBoreRight + 12} y1={neckTopY} x2={outerRight + 29} y2={neckTopY} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={hubFaceRight - 1} y1={cLowerLineY} x2={outerRight + 29} y2={cLowerLineY} stroke={dimColor} strokeWidth="0.5" />
                </>
            )}

            {/* F1 face strip dimension */}
            {showsF1 && (
                <>
                    <text x={f1AnnotX + 5} y={bottomY + 15} textAnchor="middle" fontSize="8" fill={dimColor}>F1</text>
                    <line x1={f1AnnotX} y1={bottomY} x2={f1AnnotX} y2={bottomY + 3} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={f1ExtRight} y1={bottomY} x2={f1ExtLeft} y2={bottomY} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={f1ExtRight} y1={bottomY + 3} x2={f1ExtLeft} y2={bottomY + 3} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={f1AnnotX} y1={bottomY - 10} x2={f1AnnotX} y2={bottomY} stroke={dimColor} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={f1AnnotX} y1={bottomY + 3} x2={f1AnnotX} y2={bottomY + 20} stroke={dimColor} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" />
                </>
            )}

            {/* D1 face diameter */}
            {showsD1 && (
                <>
                    <text x={centerX} y={bottomY + 20} textAnchor="middle" fontSize="8" fill={dimColor}>D1</text>
                    <line x1={hubFaceLeft} y1={bottomY + 23} x2={hubFaceRight} y2={bottomY + 23} stroke={dimColor} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={hubFaceLeft} y1={bottomY + 5} x2={hubFaceLeft} y2={bottomY + 27} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={hubFaceRight} y1={bottomY + 5} x2={hubFaceRight} y2={bottomY + 27} stroke={dimColor} strokeWidth="0.5" />
                </>
            )}

            {/* F2 face groove dimensions */}
            {showsF2 && (
                <>
                    <text x={fR(6)} y={bottomY + 15} textAnchor="middle" fontSize="8" fill={dimColor}>F2</text>
                    <text x={f1ExtRight} y={bottomY + 15} textAnchor="middle" fontSize="8" fill={dimColor}>F2</text>

                    <line x1={fR(4)} y1={cLowerLineY} x2={hubFaceRight - 1} y2={cLowerLineY} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={fR(16)} y1={cLowerLineY} x2={boreRight + 4} y2={cLowerLineY} stroke={dimColor} strokeWidth="0.5" />

                    <line x1={fR(6)} y1={bottomY + 3} x2={fR(6)} y2={bottomY} stroke={dimColor} strokeWidth="0.5" />
                    <line x1={f1ExtRight} y1={bottomY + 3} x2={f1ExtRight} y2={bottomY} stroke={dimColor} strokeWidth="0.5" />

                    <line x1={fR(6)} y1={bottomY - 10} x2={fR(6)} y2={bottomY} stroke={dimColor} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={fR(6)} y1={bottomY + 20} x2={fR(6)} y2={bottomY + 3} stroke={dimColor} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={f1ExtRight} y1={bottomY - 10} x2={f1ExtRight} y2={bottomY} stroke={dimColor} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1={f1ExtRight} y1={bottomY + 20} x2={f1ExtRight} y2={bottomY + 3} stroke={dimColor} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                </>
            )}
        </>
    );
}
