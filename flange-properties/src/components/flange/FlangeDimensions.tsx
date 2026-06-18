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
};

export default function FlangeDimensions({ response, flangeType, face }: FlangeDimensionsProps) {
    const isType05 = flangeType === "05" || flangeType === "5";
    const isType11 = flangeType === "11";
    const isFaceA = !face || face === "A";
    const normalizedFace = face?.toUpperCase();
    const cLowerLineY = isFaceA ? "85" : "88";
    const showsF1 = normalizedFace === "B" || normalizedFace === "D" || normalizedFace === "F" || normalizedFace === "G";
    const showsD1 = normalizedFace === "B" || normalizedFace === "G";
    const showsF2 = normalizedFace === "C" || normalizedFace === "E" || normalizedFace === "G";

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

    return (
        <>
            <text x="23.5" y="98" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">
                {response?.count?.value ?? response?.count?.instruction ?? "-"}×⌀{getMeasureValue("L", "2")}
            </text>
            <line x1="11" y1="101" x2="36" y2="101" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
            <line x1="11" y1="90" x2="11" y2="105" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
            <line x1="36" y1="90" x2="36" y2="105" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
            <text x="23.5" y="110" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">{response?.boltSize ?? "-"}</text>

            <text x="141" y={isType11 ? "-43" : "40"} textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">⌀{getMeasureValue("K", "1")}</text>
            <line x1="23.5" y1={isType11 ? "-40" : "43"} x2="258.5" y2={isType11 ? "-40" : "43"} stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
            <line x1="23.5" y1="50" x2="23.5" y2={isType11 ? "-44" : "39"} stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
            <line x1="258.5" y1="50" x2="258.5" y2={isType11 ? "-44" : "39"} stroke="rgb(24, 93, 44)" strokeWidth="0.5" />

            {!isType05 && !isType11 && (
                <>
                    <text x="141" y="100" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">⌀{getMeasureValue("B1", "B2", "B3", "4", "5", "6")}</text>
                    <line x1="66" y1="103" x2="216" y2="103" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1="66" y1="90" x2="66" y2="107" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    <line x1="216" y1="90" x2="216" y2="107" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                </>
            )}

            <text x="141" y="128" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">⌀{isType11 ? getMeasureValue("D", "0", "A") : getMeasureValue("D", "0")}</text>
            <line x1="1" y1="130" x2="281" y2="130" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
            <line x1="1" y1="90" x2="1" y2="134" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
            <line x1="281" y1="90" x2="281" y2="134" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />

            <text x="297" y="71" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">{isType11 ? getMeasureValue("C2") : getMeasureValue("C1", "C2", "C3", "C4", "7", "8", "9", "10")}</text>
            <line x1="292" y1="55" x2="292" y2={cLowerLineY} stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
            <line x1="284" y1="55" x2="294" y2="55" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
            <line x1="245" y1={cLowerLineY} x2="294" y2={cLowerLineY} stroke="rgb(24, 93, 44)" strokeWidth="0.5" />

            {isType11 && (
                <>
                    <text x="141" y="0" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">⌀{getMeasureValue("A", "1")}</text>
                    <line x1="64" y1="3" x2="218" y2="3" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1="64" y1="15" x2="64" y2="0" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    <line x1="218" y1="25" x2="218" y2="0" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />

                    <text x={hasMeasureNumericValue("S") ? "75" : "90"} y="18" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">{getMeasureValueOrInstruction("S")}</text>
                    <line x1="64" y1="15" x2="64" y2="25" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    <line x1="66" y1="15" x2="66" y2="25" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    <line x1="55" y1="20" x2="64" y2="20" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1="120" y1="20" x2="66" y2="20" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />

                    <text x="40" y="32" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">{getMeasureValue("R1")}</text>
                    <line x1="45" y1="34" x2="54" y2="54" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1="45" y1="34" x2="63" y2="29" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1="45" y1="34" x2="32" y2="34" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                
                    <text x="240" y="22" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">{getMeasureValue("H3")}</text>
                    <line x1="235" y1="26" x2="235" y2="30" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    <line x1="235" y1="15" x2="235" y2="26" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green-rev)"/>
                    <line x1="235" y1="30" x2="235" y2="41" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)"/>
                    <line x1="220" y1="26" x2="237" y2="26" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    <line x1="220" y1="30" x2="237" y2="30" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    
                    <text x="141" y="-22" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">⌀{getMeasureValue("N1")}</text>
                    <line x1="53" y1="-19" x2="227" y2="-19" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1="53" y1="52" x2="53" y2="-22" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    <line x1="227" y1="52" x2="227" y2="-22" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />

                    <text x="314" y="58" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">{getMeasureValue("H2")}</text>
                    <line x1="308" y1="26" x2="308" y2={isFaceA ? "85" : "88"} stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1="230" y1="26" x2="310" y2="26" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    <line x1="245" y1={isFaceA ? "85" : "88"} x2="310" y2={isFaceA ? "85" : "88"} stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                
                </>
            )}

            {showsF1 && (
                        <>
                            <text x="255" y="100" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">F1</text>
                            <line x1="250" y1="85" x2="250" y2="88" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                            <line x1="252" y1="85" x2="244" y2="85" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                            <line x1="252" y1="88" x2="244" y2="88" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                            <line x1="250" y1="75" x2="250" y2="85" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                            <line x1="250" y1="88" x2="250" y2="105" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" />
                        </>
                    )}

            {showsD1 && (
                <>
                    <text x="141" y="105" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">D1</text>
                    <line x1="40" y1="108" x2="242" y2="108" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1="40" y1="90" x2="40" y2="112" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    <line x1="242" y1="90" x2="242" y2="112" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                </>
            )}

            {showsF2 && (
                <>
                    <text x="205" y="100" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">F2</text>
                    <text x="247" y="100" textAnchor="middle" fontSize="8" fill="rgb(24, 93, 44)">F2</text>
                    
                    <line x1="238" y1={cLowerLineY} x2="245" y2={cLowerLineY} stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    <line x1="200" y1={cLowerLineY} x2="220" y2={cLowerLineY} stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    
                    <line x1="210" y1="88" x2="210" y2="85" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                    <line x1="252" y1="88" x2="252" y2="85" stroke="rgb(24, 93, 44)" strokeWidth="0.5" />
                
                    <line x1="210" y1="75" x2="210" y2="85" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1="210" y1="105" x2="210" y2="88" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1="252" y1="75" x2="252" y2="85" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                    <line x1="252" y1="105" x2="252" y2="88" stroke="rgb(24, 93, 44)" strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
                
                </>
            )}
        </>
    );
}
