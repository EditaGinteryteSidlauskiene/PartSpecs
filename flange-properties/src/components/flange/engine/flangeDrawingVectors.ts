import { buildFlangeDimensionVectors } from "./flangeDimensionGroupVectors.ts";
import type { FlangeDrawingModel } from "./flangeDrawingModel.ts";
import { buildFlangeShapeVectors } from "./flangeShapeVectors.ts";
import type { FlangeLookupResponse } from "./flangeMeasures.ts";
import { SVG_VECTOR_COLORS, SVG_VECTOR_FONT_SIZES } from "./svgVectorDefinitions.ts";
import {
    SVG_VECTOR_DOCUMENT_SCHEMA_VERSION,
    type SvgVectorDocument,
    type SvgVectorElement,
} from "./svgVectorTypes.ts";

type BuildFlangeDrawingVectorsInput = {
    model: FlangeDrawingModel;
    response: FlangeLookupResponse | null;
};

type FlangeDrawingVectorDocumentMetadata = {
    flangeType?: string;
    face: string | null;
    isSupported: boolean;
};

export type FlangeDrawingVectorDocument = SvgVectorDocument<FlangeDrawingVectorDocumentMetadata>;

const getUnsupportedMessage = (model: FlangeDrawingModel): string | null => {
    if (model.typeDefinition?.isSupportedForDrawing === false) {
        return model.typeDefinition.unsupportedDrawingMessage ?? "Drawing not implemented for this flange type.";
    }

    if (model.flangeType && !model.typeDefinition) {
        return `Drawing not implemented for flange type ${model.flangeType}.`;
    }

    return null;
};

export const buildUnsupportedFlangeDrawingVectors = (
    model: FlangeDrawingModel,
    message: string
): SvgVectorElement[] => [
    {
        kind: "text",
        layer: "fallback",
        role: "unsupportedMessage",
        x: model.bounds.minX + model.bounds.width / 2,
        y: model.bounds.minY + model.bounds.height / 2,
        text: message,
        textAnchor: "middle",
        dominantBaseline: "middle",
        fill: SVG_VECTOR_COLORS.outline,
        fontSize: SVG_VECTOR_FONT_SIZES.fallback,
    },
];

export const buildFlangeDrawingVectors = ({
    model,
    response,
}: BuildFlangeDrawingVectorsInput): SvgVectorElement[] => {
    const unsupportedMessage = getUnsupportedMessage(model);

    if (unsupportedMessage) {
        return buildUnsupportedFlangeDrawingVectors(model, unsupportedMessage);
    }

    return [
        ...buildFlangeShapeVectors({
            typeDefinition: model.typeDefinition,
            faceState: model.faceState,
            halfSection: model.halfSection,
            pos: model.pos,
        }),
        ...buildFlangeDimensionVectors({
            response,
            typeDefinition: model.typeDefinition,
            halfSection: model.halfSection,
            pos: model.pos,
            rails: model.rails,
            faceProfile: model.faceProfile,
        }),
    ];
};

export const buildFlangeDrawingVectorDocument = (
    model: FlangeDrawingModel,
    response: FlangeLookupResponse | null
): FlangeDrawingVectorDocument => ({
    schemaVersion: SVG_VECTOR_DOCUMENT_SCHEMA_VERSION,
    bounds: model.bounds,
    elements: buildFlangeDrawingVectors({ model, response }),
    metadata: {
        flangeType: model.flangeType,
        face: model.face,
        isSupported: model.typeDefinition?.isSupportedForDrawing === true,
    },
    warnings: model.validation.hasMissingRequiredMeasures
        ? [`Some drawing dimensions are using fallback values because required measures are missing: ${model.validation.missingMeasures.join(", ")}`]
        : undefined,
});
