import {
    buildFlangeDrawing,
    serializeFlangeDrawing,
    validateSvgVectorDocument,
    type FlangeLookupResponse,
} from "../index.ts";

const sampleResponse: FlangeLookupResponse = {
    count: { value: 8 },
    boltSize: "M20",
    measures: {
        D: { value: 220 },
        K: { value: 180 },
        L: { value: 22 },
        C2: { value: 24 },
        A: { value: 100 },
        S: { value: 8 },
        R1: { value: 6 },
        H3: { value: 12 },
        N1: { value: 128 },
        H2: { value: 100 },
        F1: { value: 2 },
        D1: { value: 145 },
        F2: { value: 4 },
    },
};

const drawingInput = {
    flangeType: "11",
    face: "B",
    response: sampleResponse,
};

const document = buildFlangeDrawing(drawingInput);
const validation = validateSvgVectorDocument(document);

if (!validation.isValid) {
    throw new Error(`Invalid flange drawing document: ${validation.errors.join(", ")}`);
}

const svgText = serializeFlangeDrawing(drawingInput);

// In a Node script, write svgText with fs.writeFileSync("flange-type-11-face-b.svg", svgText).
// In a browser UI, pass svgText to a download helper that creates a Blob and object URL.
export { document, svgText };
