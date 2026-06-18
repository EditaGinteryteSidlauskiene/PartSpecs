import { useEffect, useMemo, useState } from "react";
import FlangeBody from "./FlangeBody";
import FlangeFace from "./FlangeFace.tsx";
import FlangeNeck from "./FlangeNeck";
import FlangeDimensions from "./FlangeDimensions";
import "./flangeMeasureLookup.css";

type CountDto = {
    value?: number;
    instruction?: string;
};

type MeasureDto = {
    value?: number;
    instruction?: string;
    measureType: string;
};

type FlangeLookupResponse = {
    count?: CountDto;
    boltSize?: string;
    measures: Record<string, MeasureDto>;
};

type Combination = {
    pn: string;
    dn: string;
    flangeType: string;
};

const FACE_VALUES = ["A", "B", "C", "D", "E", "F", "G", "H"];

const formatPnLabel = (value: string): string => {
    if (value === "Pn002_5") {
        return "2.5";
    }

    const numericPart = value.replace("Pn", "");
    return String(parseInt(numericPart, 10));
};

const formatDnLabel = (value: string): string => value.replace("Dn", "");

const formatFlangeTypeLabel = (value: string): string => value.replace("Type", "");

const isPnInputValid = (input: string, pnValues: string[]): boolean => {
    return input.length === 0 || pnValues.some((value) => formatPnLabel(value) === input);
};

const isDnInputValid = (input: string, dnValues: string[]): boolean => {
    return input.length === 0 || (/^\d+$/.test(input) && dnValues.some((value) => formatDnLabel(value) === input));
};

const isFlangeTypeInputValid = (input: string, flangeTypeValues: string[]): boolean => {
    if (input.length === 0) {
        return true;
    }

    if (!/^\d{1,2}$/.test(input)) {
        return false;
    }

    const normalized = input.padStart(2, "0");
    return flangeTypeValues.some((value) => formatFlangeTypeLabel(value) === normalized);
};

const isFaceInputValid = (input: string): boolean => {
    return input.length === 0 || FACE_VALUES.includes(input);
};

export default function FlangeMeasureLookup() {
    const [flangeType, setFlangeType] = useState("");
    const [face, setFace] = useState("");
    const [dn, setDn] = useState("");
    const [pn, setPn] = useState("");
    const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
    const [selectedCombination, setSelectedCombination] = useState<Combination | null>(null);
    const [response, setResponse] = useState<FlangeLookupResponse | null>(null);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [responseError, setResponseError] = useState<string | null>(null);
    const [pnValues, setPnValues] = useState<string[]>([]);
    const [dnValues, setDnValues] = useState<string[]>([]);
    const [flangeTypeValues, setFlangeTypeValues] = useState<string[]>([]);

    useEffect(() => {
        const loadCombinationValues = async () => {
            try {
                const [pnRes, dnRes, flangeRes] = await Promise.all([
                    fetch("http://localhost:5192/api/FlangeProperties/pnValues"),
                    fetch("http://localhost:5192/api/FlangeProperties/dnValues"),
                    fetch("http://localhost:5192/api/FlangeProperties/flangeTypes"),
                ]);

                if (!pnRes.ok || !dnRes.ok || !flangeRes.ok) {
                    return;
                }

                const [pnData, dnData, flangeTypeData] = await Promise.all([
                    pnRes.json(),
                    dnRes.json(),
                    flangeRes.json(),
                ]);

                setPnValues(pnData);
                setDnValues(dnData);
                setFlangeTypeValues(flangeTypeData);
            } catch {
                setPnValues([]);
                setDnValues([]);
                setFlangeTypeValues([]);
            }
        };

        void loadCombinationValues();
    }, []);

    const allCombinations = useMemo(() => {
        return pnValues.flatMap((pnValue) =>
            dnValues.flatMap((dnValue) =>
                flangeTypeValues.map((flangeTypeValue) => ({
                    pn: formatPnLabel(pnValue),
                    dn: formatDnLabel(dnValue),
                    flangeType: formatFlangeTypeLabel(flangeTypeValue),
                }))
            )
        );
    }, [pnValues, dnValues, flangeTypeValues]);

    const pnInput = pn.trim().replace(",", ".");
    const dnInput = dn.trim();
    const flangeTypeInput = flangeType.trim();
    const faceInput = face.trim().toUpperCase();

    const normalizedFlangeTypeInput = /^\d{1,2}$/.test(flangeTypeInput)
        ? flangeTypeInput.padStart(2, "0")
        : flangeTypeInput;

    const isPnValid = isPnInputValid(pnInput, pnValues);
    const isDnValid = isDnInputValid(dnInput, dnValues);
    const isFlangeTypeValid = isFlangeTypeInputValid(flangeTypeInput, flangeTypeValues);
    const isFaceValid = isFaceInputValid(faceInput);
    const hasAnyInvalidInput = !isPnValid || !isDnValid || !isFlangeTypeValid || !isFaceValid;

    const activeFace = faceInput.length === 0 ? "A" : isFaceValid ? faceInput : null;

    const activePnFilter = isPnValid && pnInput.length > 0 ? pnInput : null;
    const activeDnFilter = isDnValid && dnInput.length > 0 ? dnInput : null;
    const activeFlangeTypeFilter = isFlangeTypeValid && flangeTypeInput.length > 0 ? normalizedFlangeTypeInput : null;
    const fullyDefinedByInputs = activePnFilter !== null && activeDnFilter !== null && activeFlangeTypeFilter !== null;

    const fullyDefinedInputCombination = useMemo(
        () => fullyDefinedByInputs
            ? {
                pn: activePnFilter,
                dn: activeDnFilter,
                flangeType: activeFlangeTypeFilter,
            }
            : null,
        [fullyDefinedByInputs, activePnFilter, activeDnFilter, activeFlangeTypeFilter]
    );

    useEffect(() => {
        if (!fullyDefinedInputCombination) {
            return;
        }

        setSelectedCombination((previous) => {
            if (
                previous &&
                previous.pn === fullyDefinedInputCombination.pn &&
                previous.dn === fullyDefinedInputCombination.dn &&
                previous.flangeType === fullyDefinedInputCombination.flangeType
            ) {
                return previous;
            }

            return fullyDefinedInputCombination;
        });
    }, [fullyDefinedInputCombination]);

    const effectiveCombination = useMemo(() => {
        if (fullyDefinedInputCombination) {
            return fullyDefinedInputCombination;
        }

        if (hasAnyInvalidInput) {
            return selectedCombination;
        }

        return null;
    }, [fullyDefinedInputCombination, hasAnyInvalidInput, selectedCombination]);

    const shouldShowCombinationsTable = effectiveCombination === null;

    const filteredCombinations = useMemo(() => {
        return allCombinations.filter((row) => {
            const matchesPn = activePnFilter === null || row.pn === activePnFilter;
            const matchesDn = activeDnFilter === null || row.dn === activeDnFilter;
            const matchesFlangeType = activeFlangeTypeFilter === null || row.flangeType === activeFlangeTypeFilter;

            return matchesPn && matchesDn && matchesFlangeType;
        });
    }, [allCombinations, activePnFilter, activeDnFilter, activeFlangeTypeFilter]);

    useEffect(() => {
        const loadFlangeDetails = async () => {
            if (!effectiveCombination) {
                setResponse(null);
                setResponseError(null);
                return;
            }

            const pnEnum = pnValues.find((value) => formatPnLabel(value) === effectiveCombination.pn);
            const dnEnum = dnValues.find((value) => formatDnLabel(value) === effectiveCombination.dn);
            const flangeTypeEnum = flangeTypeValues.find((value) => formatFlangeTypeLabel(value) === effectiveCombination.flangeType);

            if (!pnEnum || !dnEnum || !flangeTypeEnum) {
                setResponse(null);
                setResponseError("The selected combination is not available.");
                return;
            }

            try {
                setIsLoadingResponse(true);
                setResponseError(null);

                const result = await fetch(
                    `http://localhost:5192/api/FlangeProperties/measures?pn=${encodeURIComponent(pnEnum)}&dn=${encodeURIComponent(dnEnum)}&flangeType=${encodeURIComponent(flangeTypeEnum)}`
                );

                if (!result.ok) {
                    setResponse(null);
                    setResponseError("Could not load flange details for this combination.");
                    return;
                }

                const data = await result.json();
                setResponse(data);
            } catch {
                setResponse(null);
                setResponseError("Could not load flange details for this combination.");
            } finally {
                setIsLoadingResponse(false);
            }
        };

        void loadFlangeDetails();
    }, [effectiveCombination, pnValues, dnValues, flangeTypeValues]);

    return (
        <div>
            <div className="lookup-form">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Type</span>
                    <input type="text" className={`form-control lookup-input ${isFlangeTypeValid ? "" : "lookup-input-invalid"}`} aria-label="Flange Type" aria-describedby="basic-addon1" value={flangeType} onChange={(event) => {
                        const nextValue = event.target.value;
                        setFlangeType(nextValue);

                        if (isFlangeTypeInputValid(nextValue.trim(), flangeTypeValues)) {
                            setSelectedCombination(null);
                            setSelectedRowKey(null);
                        }
                    }} />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">DN</span>
                    <input type="text" className={`form-control lookup-input ${isDnValid ? "" : "lookup-input-invalid"}`} aria-label="DN" aria-describedby="basic-addon1" value={dn} onChange={(event) => {
                        const nextValue = event.target.value;
                        setDn(nextValue);

                        if (isDnInputValid(nextValue.trim(), dnValues)) {
                            setSelectedCombination(null);
                            setSelectedRowKey(null);
                        }
                    }} />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">PN</span>
                    <input type="text" className={`form-control lookup-input ${isPnValid ? "" : "lookup-input-invalid"}`} aria-label="PN" aria-describedby="basic-addon1" value={pn} onChange={(event) => {
                        const nextValue = event.target.value;
                        setPn(nextValue);

                        if (isPnInputValid(nextValue.trim().replace(",", "."), pnValues)) {
                            setSelectedCombination(null);
                            setSelectedRowKey(null);
                        }
                    }} />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Face</span>
                    <input type="text" className={`form-control lookup-input ${isFaceValid ? "" : "lookup-input-invalid"}`} aria-label="Face" aria-describedby="basic-addon1" value={face} onChange={(event) => {
                        const nextValue = event.target.value.toUpperCase();
                        setFace(nextValue);

                        if (isFaceInputValid(nextValue.trim().toUpperCase())) {
                            setSelectedCombination(null);
                            setSelectedRowKey(null);
                        }
                    }} />
                </div>

            </div>
            {shouldShowCombinationsTable && (
                <div className="combinations-section">
                    <div className="combinations-table-wrap">
                        <table className="table table-striped combinations-table">
                            <thead>
                                <tr>
                                    <th>Flange Type</th>
                                    <th>DN</th>
                                    <th>PN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCombinations.map((row, index) => {
                                    const rowKey = `${row.pn}-${row.dn}-${row.flangeType}-${index}`;

                                    return (
                                        <tr
                                            key={rowKey}
                                            className={`combinations-row ${selectedRowKey === rowKey ? "combinations-row-selected" : ""}`}
                                            onClick={() => {
                                                setSelectedRowKey(rowKey);
                                                setSelectedCombination(row);
                                                setPn(row.pn);
                                                setDn(row.dn);
                                                setFlangeType(row.flangeType);
                                            }}
                                        >
                                            <td>{row.flangeType}</td>
                                            <td>{row.dn}</td>
                                            <td>{row.pn}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!shouldShowCombinationsTable && (
                <section className="lookup-data-panel" style={{ marginTop: "30px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", width: "100%" }}>
                        <svg viewBox="-5 -80 335 225" role="img" aria-label="Type 01 flange visualization" style={{ width: "100%", maxWidth: "800px", height: "auto" }}>
                            <defs>
                                <pattern id="type01-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                                    <line x1="0" y1="0" x2="0" y2="6" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                                </pattern>
                                <marker id="type01-arrowhead" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                                    <path d="M0,1 L6,3 L0,5 z" fill="rgb(34, 33, 33)" />
                                </marker>
                                <marker id="type01-arrowhead-rev" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">
                                    <path d="M0,1 L6,3 L0,5 z" fill="rgb(34, 33, 33)" />
                                </marker>
                                <marker id="type01-arrowhead-green" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                                    <path d="M0,1 L6,3 L0,5 z" fill="rgb(24, 93, 44)" />
                                </marker>
                                <marker id="type01-arrowhead-green-rev" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">
                                    <path d="M0,1 L6,3 L0,5 z" fill="rgb(24, 93, 44)" />
                                </marker>
                            </defs>

                            <g transform="translate(-5 0)">
                                <FlangeNeck flangeType={effectiveCombination?.flangeType} />
                                <FlangeBody flangeType={effectiveCombination?.flangeType} />
                                <FlangeFace face={activeFace} flangeType={effectiveCombination?.flangeType} />
                                <FlangeDimensions response={response} flangeType={effectiveCombination?.flangeType} face={activeFace} />

                            </g>
                        </svg>
                    </div>

                    {isLoadingResponse && <p>Loading flange details...</p>}
                    {responseError && <p>{responseError}</p>}

                    {response && (
                        <table className="lookup-table">
                            <thead>
                                <tr>
                                    <th>Measure</th>
                                    <th>Value</th>
                                    <th>Instruction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(response.measures).map(([key, { value, instruction }]) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{value ?? "-"}</td>
                                        <td>{instruction ?? "-"}</td>
                                    </tr>
                                ))}
                                <tr key="Bolting Count">
                                    <td>Bolting Count</td>
                                    <td>{response.count?.value ?? response.count?.instruction ?? "-"}</td>
                                    <td>-</td>
                                </tr>
                                <tr key="Bolting Size">
                                    <td>Bolting Size</td>
                                    <td>{response.boltSize ?? "-"}</td>
                                    <td>-</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </section>
            )}

        </div>
    )
}
