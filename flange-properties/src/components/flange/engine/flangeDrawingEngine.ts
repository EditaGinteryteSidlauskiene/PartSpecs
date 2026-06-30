import { createFlangeDrawingModel } from "./flangeDrawingModel.ts";
import {
    buildFlangeDrawingVectorDocument,
    buildFlangeDrawingVectors,
} from "./flangeDrawingVectors.ts";
import { serializeSvgVectorDocument } from "./svgVectorSerializer.ts";
import type { FlangeDrawingVectorDocument } from "./flangeDrawingVectors.ts";
import type { FlangeLookupResponse } from "./flangeMeasures.ts";

export { createFlangeDrawingModel };
export {
    buildFlangeDrawingVectorDocument,
    buildFlangeDrawingVectors,
};
export {
    serializeSvgVectorDocument,
    serializeSvgVectorDocument as serializeFlangeDrawingSvg,
} from "./svgVectorSerializer.ts";
export {
    isSvgVectorDocument,
    validateSvgVectorDocument,
} from "./svgVectorValidation.ts";

export type BuildFlangeDrawingInput = {
    flangeType?: string;
    face?: string | null;
    response: FlangeLookupResponse;
};

export const buildFlangeDrawing = ({
    flangeType,
    face,
    response,
}: BuildFlangeDrawingInput): FlangeDrawingVectorDocument => {
    const model = createFlangeDrawingModel({
        flangeType,
        face,
        measures: response.measures,
    });

    return buildFlangeDrawingVectorDocument(model, response);
};

export const serializeFlangeDrawing = (input: BuildFlangeDrawingInput): string =>
    serializeSvgVectorDocument(buildFlangeDrawing(input));

export type {
    FlangeDimensionRails,
    FlangeDrawingBounds,
    FlangeDrawingModel,
    FlangeDrawingValidation,
    FlangeFaceProfile,
    FlangeHalfSectionAnchors,
} from "./flangeDrawingModel.ts";
export type { FlangeDrawingVectorDocument } from "./flangeDrawingVectors.ts";
export type {
    SvgVectorBounds,
    SvgVectorDocument,
    SvgVectorElement,
    SvgVectorLine,
    SvgVectorMetadata,
    SvgVectorPath,
    SvgVectorRect,
    SvgVectorText,
    SvgVectorDocumentSchemaVersion,
} from "./svgVectorTypes.ts";
export type { FlangeLookupResponse, FlangeMeasures } from "./flangeMeasures.ts";
