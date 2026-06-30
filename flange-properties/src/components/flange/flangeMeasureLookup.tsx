import { useEffect, useMemo, useRef, useState } from "react";
import { downloadSvgFile } from "./downloadSvgFile";
import FlangeDrawing from "./FlangeDrawing";
import {
    buildFlangeSvgFilename,
    createFlangeDrawingModel,
    isValidFaceLetter,
    normalizeFlangeType,
    serializeFlangeDrawing,
    type FlangeLookupResponse,
} from "./engine/index";
import "./flangeMeasureLookup.css";

type Combination = {
    pn: string;
    dn: string;
    flangeType: string;
};

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

    const normalized = normalizeFlangeType(input);
    return flangeTypeValues.some((value) => formatFlangeTypeLabel(value) === normalized);
};

const isFaceInputValid = (input: string): boolean => {
    return input.length === 0 || isValidFaceLetter(input);
};

export default function FlangeMeasureLookup() {
    const drawingPanelRef = useRef<HTMLDivElement | null>(null);
    const [flangeType, setFlangeType] = useState("");
    const [face, setFace] = useState("");
    const [dn, setDn] = useState("");
    const [pn, setPn] = useState("");
    const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
    const [selectedCombination, setSelectedCombination] = useState<Combination | null>(null);
    const [response, setResponse] = useState<FlangeLookupResponse | null>(null);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [responseError, setResponseError] = useState<string | null>(null);
    const [availableDrawingHeight, setAvailableDrawingHeight] = useState<number | null>(null);
    const [pnValues, setPnValues] = useState<string[]>([]);
    const [dnValues, setDnValues] = useState<string[]>([]);
    const [flangeTypeValues, setFlangeTypeValues] = useState<string[]>([]);
    const [allCombinations, setAllCombinations] = useState<Combination[]>([]);
    const [lastValidCombination, setLastValidCombination] = useState<Combination | null>(null);

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

        const loadValidCombinations = async () => {
            try {
                const res = await fetch("http://localhost:5192/api/FlangeProperties/validCombinations");
                if (!res.ok) return;
                const data: { pn: string; dn: string; flangeType: string }[] = await res.json();
                setAllCombinations(data.map((c) => ({
                    pn: formatPnLabel(c.pn),
                    dn: formatDnLabel(c.dn),
                    flangeType: formatFlangeTypeLabel(c.flangeType),
                })));
            } catch {
                setAllCombinations([]);
            }
        };

        void loadCombinationValues();
        void loadValidCombinations();
    }, []);

    const pnInput = pn.trim().replace(",", ".");
    const dnInput = dn.trim();
    const flangeTypeInput = flangeType.trim();
    const faceInput = face.trim().toUpperCase();

    const normalizedFlangeTypeInput = normalizeFlangeType(flangeTypeInput) ?? flangeTypeInput;

    const isPnValid = isPnInputValid(pnInput, pnValues);
    const isDnValid = isDnInputValid(dnInput, dnValues);
    const isFlangeTypeValid = isFlangeTypeInputValid(flangeTypeInput, flangeTypeValues);
    const isFaceValid = isFaceInputValid(faceInput);
    const hasAnyInvalidInput = !isPnValid || !isDnValid || !isFlangeTypeValid || !isFaceValid;

    const activeFace = faceInput.length === 0 ? null : isFaceValid ? faceInput : null;

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

    const isInputCombinationInvalid = useMemo(() => {
        if (!fullyDefinedInputCombination) return false;
        return !allCombinations.some(
            (c) => c.pn === fullyDefinedInputCombination.pn && c.dn === fullyDefinedInputCombination.dn && c.flangeType === fullyDefinedInputCombination.flangeType
        );
    }, [fullyDefinedInputCombination, allCombinations]);

    useEffect(() => {
        if (!fullyDefinedInputCombination || isInputCombinationInvalid) {
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
    }, [fullyDefinedInputCombination, isInputCombinationInvalid]);

    useEffect(() => {
        if (isInputCombinationInvalid && lastValidCombination) {
            setPn(lastValidCombination.pn);
            setDn(lastValidCombination.dn);
            setFlangeType(lastValidCombination.flangeType);
        }
    }, [isInputCombinationInvalid, lastValidCombination]);

    const effectiveCombination = useMemo(() => {
        if (fullyDefinedInputCombination && !isInputCombinationInvalid) {
            return fullyDefinedInputCombination;
        }

        if (isInputCombinationInvalid) {
            return lastValidCombination;
        }

        if (hasAnyInvalidInput) {
            return selectedCombination;
        }

        return null;
    }, [fullyDefinedInputCombination, hasAnyInvalidInput, selectedCombination, isInputCombinationInvalid, lastValidCombination]);

    const shouldShowCombinationsTable = effectiveCombination === null && !isInputCombinationInvalid;
    const drawingModel = useMemo(
        () => createFlangeDrawingModel({
            measures: response?.measures,
            flangeType: effectiveCombination?.flangeType,
            face: activeFace,
        }),
        [response?.measures, effectiveCombination?.flangeType, activeFace]
    );
    const missingMeasureWarning = drawingModel.validation.hasMissingRequiredMeasures
        ? `Some drawing dimensions are using fallback values because required measures are missing: ${drawingModel.validation.missingMeasures.join(", ")}`
        : null;

    const exportCurrentDrawing = () => {
        if (!effectiveCombination || !response) {
            return;
        }

        const svg = serializeFlangeDrawing({
            flangeType: effectiveCombination.flangeType,
            face: activeFace,
            response,
        });

        downloadSvgFile(
            buildFlangeSvgFilename({
                flangeType: effectiveCombination.flangeType,
                dn: effectiveCombination.dn,
                pn: effectiveCombination.pn,
                face: activeFace,
            }),
            svg
        );
    };

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
                    setResponseError("Could not load flange details for this combination.");
                    return;
                }

                const data: FlangeLookupResponse = await result.json();
                setResponse(data);
                setLastValidCombination(effectiveCombination);
                setResponseError(null);
            } catch {
                setResponseError("Could not load flange details for this combination.");
            } finally {
                setIsLoadingResponse(false);
            }
        };

        void loadFlangeDetails();
    }, [effectiveCombination, pnValues, dnValues, flangeTypeValues]);

    useEffect(() => {
        if (shouldShowCombinationsTable) {
            return;
        }

        const updateDrawingHeight = () => {
            const panel = drawingPanelRef.current;
            if (!panel) {
                return;
            }

            const rect = panel.getBoundingClientRect();
            const bottomGap = 48;
            const nextHeight = Math.max(120, Math.floor(window.innerHeight - rect.top - bottomGap));
            setAvailableDrawingHeight(nextHeight);
        };

        updateDrawingHeight();
        window.addEventListener("resize", updateDrawingHeight);

        return () => {
            window.removeEventListener("resize", updateDrawingHeight);
        };
    }, [shouldShowCombinationsTable, face, dn, pn, flangeType, response]);

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

                <div className="input-group mb-3 dn-input-group">
                    <span className="input-group-text" id="basic-addon1">DN</span>
                    <input type="text" className={`form-control lookup-input dn-input ${isDnValid ? "" : "lookup-input-invalid"}`} aria-label="DN" aria-describedby="basic-addon1" value={dn} onChange={(event) => {
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

                <div className="input-group mb-3 face-input-group">
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

            {isInputCombinationInvalid && (
                <p style={{ marginTop: "10px", color: "#721c24" }}>Please, enter valid combination.</p>
            )}

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

            {!shouldShowCombinationsTable && response && (
                <section className="lookup-data-panel" style={{ marginTop: "30px" }}>
                    <div
                        ref={drawingPanelRef}
                        className="lookup-drawing-panel"
                        style={availableDrawingHeight ? { height: `${availableDrawingHeight}px` } : undefined}
                    >
                        {missingMeasureWarning && (
                            <p className="lookup-drawing-warning">{missingMeasureWarning}</p>
                        )}
                        {effectiveCombination && (
                            <button
                                className="lookup-export-svg"
                                type="button"
                                onClick={exportCurrentDrawing}
                            >
                                Export SVG
                            </button>
                        )}
                        <FlangeDrawing model={drawingModel} response={response} availableHeight={availableDrawingHeight} />
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
