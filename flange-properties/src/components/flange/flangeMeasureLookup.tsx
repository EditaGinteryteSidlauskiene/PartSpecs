import { useEffect, useState } from "react";
import SelectField from "../ui/selectField";

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

export default function FlangeMeasureLookup() {
    const [flangeType, setFlangeType] = useState<string | null>(null);
    const [dn, setDn] = useState<string | null>(null);
    const [pn, setPn] = useState<string | null>(null);
    const [response, setResponse] = useState<FlangeLookupResponse | null>(null);

    const [pnOptions, setPnOptions] = useState<string[]>([]);
    const [dnOptions, setDnOptions] = useState<string[]>([]);
    const [flangeTypeOptions, setFlangeTypeOptions] = useState<string[]>([]);

    useEffect(() => {
        Promise.all([
            fetch("http://localhost:5192/api/FlangeProperties/pnValues").then((res) => res.json()),
            fetch("http://localhost:5192/api/FlangeProperties/dnValues").then((res) => res.json()),
            fetch("http://localhost:5192/api/FlangeProperties/flangeTypes").then((res) => res.json()),
        ])
            .then(([pnData, dnData, flangeTypeData]) => {
                setPnOptions(pnData);
                setDnOptions(dnData);
                setFlangeTypeOptions(flangeTypeData);
            })
            .catch((error) => {
                console.error("Error loading options:", error);
            });
    }, []);

    const handleSearch = async () => {
        if (!pn || !dn || !flangeType) return;

        const response = await fetch(
            `http://localhost:5192/api/FlangeProperties/measures?pn=${pn}&dn=${dn}&flangeType=${flangeType}`
        );
        const data = await response.json();
        setResponse(data);
    };

    return (
        <div>
            <h1>Flange Measure Lookup</h1>
            <SelectField label="PN" options={pnOptions} value={pn} onChange={setPn} />
            <SelectField label="DN" options={dnOptions} value={dn} onChange={setDn} />
            <SelectField label="Flange Type" options={flangeTypeOptions} value={flangeType} onChange={setFlangeType} />
            <button onClick={handleSearch}>Search</button>
            {response && (
                <table>
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
                        </tr>
                        <tr key="Bolting Size">
                            <td>Bolting Size</td>
                            <td>{response.boltSize ?? "-"}</td>
                        </tr>
                    </tbody>
                </table>
            )}

        </div>
    )
}
