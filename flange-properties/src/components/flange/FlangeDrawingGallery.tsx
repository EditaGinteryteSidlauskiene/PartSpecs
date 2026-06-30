import "./FlangeDrawingGallery.css";
import FlangeDrawing from "./FlangeDrawing";
import { createFlangeDrawingModel } from "./flangeDrawingModel";
import { FACE_LETTERS } from "./flangeFaceRules";
import type { FlangeLookupResponse } from "./flangeMeasures";
import { getFlangeTypeDefinition, KNOWN_FLANGE_TYPES, type FlangeTypeCode } from "./flangeTypes";

type GalleryCase = {
    flangeType: string;
    face: string | null;
};

const faceCases: Array<{ label: string; value: string | null }> = [
    { label: "No face", value: null },
    ...FACE_LETTERS.map((face) => ({ label: `Face ${face}`, value: face })),
];

const flatThicknessSamples: Partial<Record<FlangeTypeCode, number>> = {
    "01": 18,
    "02": 20,
    "04": 22,
    "05": 18,
};

const createKnownTypeSampleResponse = (flangeType: FlangeTypeCode): FlangeLookupResponse => {
    const typeDefinition = getFlangeTypeDefinition(flangeType);
    const thicknessKey = typeDefinition?.thicknessKeys[0] ?? "C2";

    if (typeDefinition?.hasNeck) {
        return {
            count: { value: 8 },
            boltSize: "M20",
            measures: {
                D: { value: 220 },
                K: { value: 180 },
                L: { value: 22 },
                [thicknessKey]: { value: 24 },
                A: { value: 100 },
                S: { value: 8 },
                R1: { value: 6 },
                H3: { value: 12 },
                N1: { value: 128 },
                H2: { value: 100 },
                F1: { value: 2 },
                F2: { value: 4 },
                D1: { value: 145 },
            },
        };
    }

    return {
        count: { value: 4 },
        boltSize: "M16",
        measures: {
            D: { value: 165 },
            K: { value: 125 },
            L: { value: 18 },
            [thicknessKey]: { value: flatThicknessSamples[flangeType] ?? 18 },
            ...(typeDefinition?.hasBore ? { B1: { value: 100 } } : {}),
            F1: { value: 2 },
            F2: { value: 4 },
            D1: { value: 120 },
        },
    };
};

const unknownFallbackResponse: FlangeLookupResponse = {
        count: { value: 8 },
        boltSize: "M20",
        measures: {
            D: { value: 220 },
            K: { value: 180 },
            L: { value: 22 },
            C2: { value: 24 },
            B1: { value: 100 },
        },
};

const sampleResponses: Record<string, FlangeLookupResponse> = {
    ...Object.fromEntries(KNOWN_FLANGE_TYPES.map((flangeType) => [flangeType, createKnownTypeSampleResponse(flangeType)])),
    "99": unknownFallbackResponse,
};

const galleryCases: GalleryCase[] = [
    ...KNOWN_FLANGE_TYPES.flatMap((flangeType) =>
        faceCases.map(({ value }) => ({
            flangeType,
            face: value,
        })),
    ),
    { flangeType: "99", face: null },
];

const getFaceLabel = (face: string | null): string => {
    const match = faceCases.find(({ value }) => value === face);
    return match?.label ?? `Face ${face}`;
};

export default function FlangeDrawingGallery() {
    return (
        <main className="flange-drawing-gallery">
            <header className="flange-drawing-gallery__header">
                <h2>Flange Drawing Gallery</h2>
                <p>Development preview for supported flange types, face states, and unsupported drawing fallback.</p>
            </header>

            <div className="flange-drawing-gallery__grid">
                {galleryCases.map(({ flangeType, face }) => {
                    const response = sampleResponses[flangeType];
                    const model = createFlangeDrawingModel({
                        flangeType,
                        face,
                        measures: response.measures,
                    });
                    const title = `Type ${flangeType} - ${getFaceLabel(face)}`;

                    return (
                        <section className="flange-drawing-gallery__preview" key={`${flangeType}-${face ?? "no-face"}`}>
                            <h3>{title}</h3>
                            <div className="flange-drawing-gallery__drawing">
                                <FlangeDrawing model={model} response={response} availableHeight={250} />
                            </div>
                        </section>
                    );
                })}
            </div>
        </main>
    );
}
