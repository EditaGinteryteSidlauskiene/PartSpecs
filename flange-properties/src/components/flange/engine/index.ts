export {
    buildFlangeDrawing,
    buildFlangeDrawingVectorDocument,
    buildFlangeDrawingVectors,
    createFlangeDrawingModel,
    serializeFlangeDrawing,
    serializeFlangeDrawingSvg,
    serializeSvgVectorDocument,
    validateSvgVectorDocument,
    isSvgVectorDocument,
} from "./flangeDrawingEngine.ts";

export { FACE_LETTERS, isValidFaceLetter } from "./flangeFaceRules.ts";
export {
    getFlangeTypeDefinition,
    KNOWN_FLANGE_TYPES,
    normalizeFlangeType,
} from "./flangeTypes.ts";
export { buildFlangeSvgFilename } from "./flangeSvgExport.ts";
export {
    SVG_VECTOR_COLORS,
    SVG_VECTOR_IDS,
    SVG_VECTOR_STROKE_WIDTHS,
} from "./svgVectorDefinitions.ts";

export type {
    BuildFlangeDrawingInput,
    FlangeDimensionRails,
    FlangeDrawingBounds,
    FlangeDrawingModel,
    FlangeDrawingValidation,
    FlangeDrawingVectorDocument,
    FlangeFaceProfile,
    FlangeHalfSectionAnchors,
    FlangeLookupResponse,
    FlangeMeasures,
    SvgVectorBounds,
    SvgVectorDocument,
    SvgVectorElement,
    SvgVectorLine,
    SvgVectorMetadata,
    SvgVectorPath,
    SvgVectorRect,
    SvgVectorText,
    SvgVectorDocumentSchemaVersion,
} from "./flangeDrawingEngine.ts";
export { SVG_VECTOR_DOCUMENT_SCHEMA_VERSION } from "./svgVectorTypes.ts";
export type { SvgVectorDocumentValidationResult } from "./svgVectorValidation.ts";
export type { FlangeTypeCode, FlangeTypeDefinition } from "./flangeTypes.ts";
