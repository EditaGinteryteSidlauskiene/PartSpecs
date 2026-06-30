import type { SvgVectorElement } from "./svgVectorTypes";
import { SVG_VECTOR_MARKERS, SVG_VECTOR_STROKE_WIDTHS } from "./svgVectorDefinitions";

export type DiameterDimensionProps = {
    label: string;
    centerX: number;
    targetX: number;
    y: number;
    extensionX?: number;
    extensionY1?: number;
    extensionY2?: number;
    color: string;
};

export type VerticalDimensionProps = {
    label: string;
    x: number;
    textX: number;
    y1: number;
    y2: number;
    topExtensionX1: number;
    bottomExtensionX1: number;
    extensionX2: number;
    color: string;
    textOffsetY?: number;
};

export type ExtensionLineProps = {
    x: number;
    y1: number;
    y2: number;
    color: string;
};

export type BoltHoleCalloutProps = {
    countAndDiameterLabel: string;
    boltSizeLabel: string;
    textX: number;
    textY: number;
    sizeTextY: number;
    leftExtensionX: number;
    rightExtensionX: number;
    extensionY1: number;
    extensionY2: number;
    leftArrowStartX: number;
    rightArrowStartX: number;
    arrowY: number;
    color: string;
};

export type FaceStripDimensionProps = {
    label: string;
    annotationX: number;
    labelY: number;
    topY: number;
    stripBottomY: number;
    lowerArrowEndY: number;
    extLeftX: number;
    extRightX: number;
    color: string;
};

export type FaceDiameterDimensionProps = {
    label: string;
    labelX: number;
    labelY: number;
    x1: number;
    x2: number;
    y: number;
    extensionX: number;
    extensionY1: number;
    extensionY2: number;
    color: string;
};

export type FaceGrooveDimensionProps = {
    label: string;
    leftX: number;
    rightX: number;
    labelY: number;
    topY: number;
    stripBottomY: number;
    lowerArrowEndY: number;
    upperGuideX1: number;
    upperGuideX2: number;
    lowerGuideX1: number;
    lowerGuideX2: number;
    color: string;
};

export type NeckWallDimensionProps = {
    label: string;
    labelX: number;
    boreX: number;
    outerX: number;
    y: number;
    topY: number;
    bottomY: number;
    leftArrowStartX: number;
    rightArrowStartX: number;
    color: string;
};

export type RadiusLeaderDimensionProps = {
    label: string | number;
    originX: number;
    originY: number;
    textX: number;
    textY: number;
    leaderEndX: number;
    target1X: number;
    target1Y: number;
    target2X: number;
    target2Y: number;
    color: string;
};

export type NeckStepDimensionProps = {
    label: string | number;
    x: number;
    textX: number;
    textY: number;
    stepTopY: number;
    stepBottomY: number;
    upperArrowStartY: number;
    lowerArrowEndY: number;
    extensionX1: number;
    extensionX2: number;
    color: string;
};

const DIMENSION_LAYER = "dimension";
const ARROW = SVG_VECTOR_MARKERS.dimensionArrowhead;
const ARROW_REVERSED = SVG_VECTOR_MARKERS.dimensionArrowheadReversed;
const TEXT_SIZE = "8";
const STROKE_WIDTH = SVG_VECTOR_STROKE_WIDTHS.dimension;

export function buildExtensionLineVectors({ x, y1, y2, color }: ExtensionLineProps): SvgVectorElement[] {
    return [
        { kind: "line", layer: DIMENSION_LAYER, role: "extensionLine", x1: x, y1, x2: x, y2, stroke: color, strokeWidth: STROKE_WIDTH },
    ];
}

export function buildDiameterDimensionVectors({
    label,
    centerX,
    targetX,
    y,
    extensionX,
    extensionY1,
    extensionY2,
    color,
}: DiameterDimensionProps): SvgVectorElement[] {
    return [
        { kind: "text", layer: DIMENSION_LAYER, role: "dimensionText", x: centerX - 4, y, text: label, textAnchor: "end", dominantBaseline: "middle", fontSize: TEXT_SIZE, fill: color },
        { kind: "line", layer: DIMENSION_LAYER, role: "diameterLine", x1: centerX, y1: y, x2: targetX, y2: y, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
        ...(extensionX !== undefined && extensionY1 !== undefined && extensionY2 !== undefined
            ? buildExtensionLineVectors({ x: extensionX, y1: extensionY1, y2: extensionY2, color })
            : []),
    ];
}

export function buildVerticalDimensionVectors({
    label,
    x,
    textX,
    y1,
    y2,
    topExtensionX1,
    bottomExtensionX1,
    extensionX2,
    color,
    textOffsetY = 1,
}: VerticalDimensionProps): SvgVectorElement[] {
    return [
        { kind: "text", layer: DIMENSION_LAYER, role: "dimensionText", x: textX, y: (y1 + y2) / 2 + textOffsetY, text: label, textAnchor: "middle", fontSize: TEXT_SIZE, fill: color },
        { kind: "line", layer: DIMENSION_LAYER, role: "verticalDimensionLine", x1: x, y1, x2: x, y2, stroke: color, strokeWidth: STROKE_WIDTH, markerStart: ARROW_REVERSED, markerEnd: ARROW },
        { kind: "line", layer: DIMENSION_LAYER, role: "extensionLine", x1: topExtensionX1, y1, x2: extensionX2, y2: y1, stroke: color, strokeWidth: STROKE_WIDTH },
        { kind: "line", layer: DIMENSION_LAYER, role: "extensionLine", x1: bottomExtensionX1, y1: y2, x2: extensionX2, y2, stroke: color, strokeWidth: STROKE_WIDTH },
    ];
}

export function buildBoltHoleCalloutVectors({
    countAndDiameterLabel,
    boltSizeLabel,
    textX,
    textY,
    sizeTextY,
    leftExtensionX,
    rightExtensionX,
    extensionY1,
    extensionY2,
    leftArrowStartX,
    rightArrowStartX,
    arrowY,
    color,
}: BoltHoleCalloutProps): SvgVectorElement[] {
    return [
        { kind: "text", layer: DIMENSION_LAYER, role: "dimensionText", x: textX, y: textY, text: countAndDiameterLabel, textAnchor: "middle", fontSize: TEXT_SIZE, fill: color },
        ...buildExtensionLineVectors({ x: leftExtensionX, y1: extensionY1, y2: extensionY2, color }),
        ...buildExtensionLineVectors({ x: rightExtensionX, y1: extensionY1, y2: extensionY2, color }),
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: leftArrowStartX, y1: arrowY, x2: leftExtensionX, y2: arrowY, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: rightArrowStartX, y1: arrowY, x2: rightExtensionX, y2: arrowY, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
        { kind: "text", layer: DIMENSION_LAYER, role: "dimensionText", x: textX, y: sizeTextY, text: boltSizeLabel, textAnchor: "middle", fontSize: TEXT_SIZE, fill: color },
    ];
}

export function buildFaceStripDimensionVectors({
    label,
    annotationX,
    labelY,
    topY,
    stripBottomY,
    lowerArrowEndY,
    extLeftX,
    extRightX,
    color,
}: FaceStripDimensionProps): SvgVectorElement[] {
    return [
        { kind: "text", layer: DIMENSION_LAYER, role: "dimensionText", x: annotationX + 5, y: labelY, text: label, textAnchor: "middle", fontSize: TEXT_SIZE, fill: color },
        { kind: "line", layer: DIMENSION_LAYER, role: "dimensionLine", x1: annotationX, y1: topY, x2: annotationX, y2: stripBottomY, stroke: color, strokeWidth: STROKE_WIDTH },
        { kind: "line", layer: DIMENSION_LAYER, role: "extensionLine", x1: extRightX, y1: topY, x2: extLeftX, y2: topY, stroke: color, strokeWidth: STROKE_WIDTH },
        { kind: "line", layer: DIMENSION_LAYER, role: "extensionLine", x1: extRightX, y1: stripBottomY, x2: extLeftX, y2: stripBottomY, stroke: color, strokeWidth: STROKE_WIDTH },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: annotationX, y1: topY - 10, x2: annotationX, y2: topY, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: annotationX, y1: stripBottomY, x2: annotationX, y2: lowerArrowEndY, stroke: color, strokeWidth: STROKE_WIDTH, markerStart: ARROW_REVERSED },
    ];
}

export function buildFaceDiameterDimensionVectors({
    label,
    labelX,
    labelY,
    x1,
    x2,
    y,
    extensionX,
    extensionY1,
    extensionY2,
    color,
}: FaceDiameterDimensionProps): SvgVectorElement[] {
    return [
        { kind: "text", layer: DIMENSION_LAYER, role: "dimensionText", x: labelX, y: labelY, text: label, textAnchor: "middle", fontSize: TEXT_SIZE, fill: color },
        { kind: "line", layer: DIMENSION_LAYER, role: "diameterLine", x1, y1: y, x2, y2: y, stroke: color, strokeWidth: STROKE_WIDTH, markerStart: ARROW_REVERSED, markerEnd: ARROW },
        ...buildExtensionLineVectors({ x: extensionX, y1: extensionY1, y2: extensionY2, color }),
    ];
}

export function buildFaceGrooveDimensionVectors({
    label,
    leftX,
    rightX,
    labelY,
    topY,
    stripBottomY,
    lowerArrowEndY,
    upperGuideX1,
    upperGuideX2,
    lowerGuideX1,
    lowerGuideX2,
    color,
}: FaceGrooveDimensionProps): SvgVectorElement[] {
    return [
        { kind: "text", layer: DIMENSION_LAYER, role: "dimensionText", x: leftX, y: labelY, text: label, textAnchor: "middle", fontSize: TEXT_SIZE, fill: color },
        { kind: "text", layer: DIMENSION_LAYER, role: "dimensionText", x: rightX, y: labelY, text: label, textAnchor: "middle", fontSize: TEXT_SIZE, fill: color },
        { kind: "line", layer: DIMENSION_LAYER, role: "extensionLine", x1: upperGuideX1, y1: stripBottomY, x2: upperGuideX2, y2: stripBottomY, stroke: color, strokeWidth: STROKE_WIDTH },
        { kind: "line", layer: DIMENSION_LAYER, role: "extensionLine", x1: lowerGuideX1, y1: stripBottomY, x2: lowerGuideX2, y2: stripBottomY, stroke: color, strokeWidth: STROKE_WIDTH },
        { kind: "line", layer: DIMENSION_LAYER, role: "dimensionLine", x1: leftX, y1: stripBottomY, x2: leftX, y2: topY, stroke: color, strokeWidth: STROKE_WIDTH },
        { kind: "line", layer: DIMENSION_LAYER, role: "dimensionLine", x1: rightX, y1: stripBottomY, x2: rightX, y2: topY, stroke: color, strokeWidth: STROKE_WIDTH },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: leftX, y1: topY - 10, x2: leftX, y2: topY, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: leftX, y1: lowerArrowEndY, x2: leftX, y2: stripBottomY, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: rightX, y1: topY - 10, x2: rightX, y2: topY, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: rightX, y1: lowerArrowEndY, x2: rightX, y2: stripBottomY, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
    ];
}

export function buildNeckWallDimensionVectors({
    label,
    labelX,
    boreX,
    outerX,
    y,
    topY,
    bottomY,
    leftArrowStartX,
    rightArrowStartX,
    color,
}: NeckWallDimensionProps): SvgVectorElement[] {
    return [
        { kind: "text", layer: DIMENSION_LAYER, role: "dimensionText", x: labelX, y: y - 2, text: label, textAnchor: "middle", fontSize: TEXT_SIZE, fill: color },
        ...buildExtensionLineVectors({ x: outerX, y1: topY, y2: bottomY, color }),
        ...buildExtensionLineVectors({ x: boreX, y1: topY, y2: bottomY, color }),
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: leftArrowStartX, y1: y, x2: boreX, y2: y, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: rightArrowStartX, y1: y, x2: outerX, y2: y, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
    ];
}

export function buildRadiusLeaderDimensionVectors({
    label,
    originX,
    originY,
    textX,
    textY,
    leaderEndX,
    target1X,
    target1Y,
    target2X,
    target2Y,
    color,
}: RadiusLeaderDimensionProps): SvgVectorElement[] {
    return [
        { kind: "text", layer: DIMENSION_LAYER, role: "dimensionText", x: textX, y: textY, text: label, textAnchor: "middle", fontSize: TEXT_SIZE, fill: color },
        { kind: "line", layer: DIMENSION_LAYER, role: "leaderLine", x1: originX, y1: originY, x2: leaderEndX, y2: originY, stroke: color, strokeWidth: STROKE_WIDTH },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: originX, y1: originY, x2: target1X, y2: target1Y, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: originX, y1: originY, x2: target2X, y2: target2Y, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW },
    ];
}

export function buildNeckStepDimensionVectors({
    label,
    x,
    textX,
    textY,
    stepTopY,
    stepBottomY,
    upperArrowStartY,
    lowerArrowEndY,
    extensionX1,
    extensionX2,
    color,
}: NeckStepDimensionProps): SvgVectorElement[] {
    return [
        { kind: "text", layer: DIMENSION_LAYER, role: "dimensionText", x: textX, y: textY, text: label, textAnchor: "middle", fontSize: TEXT_SIZE, fill: color },
        { kind: "line", layer: DIMENSION_LAYER, role: "dimensionLine", x1: x, y1: stepTopY, x2: x, y2: stepBottomY, stroke: color, strokeWidth: STROKE_WIDTH },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: x, y1: upperArrowStartY, x2: x, y2: stepTopY, stroke: color, strokeWidth: STROKE_WIDTH, markerEnd: ARROW_REVERSED },
        { kind: "line", layer: DIMENSION_LAYER, role: "arrowLine", x1: x, y1: stepBottomY, x2: x, y2: lowerArrowEndY, stroke: color, strokeWidth: STROKE_WIDTH, markerStart: ARROW_REVERSED },
        { kind: "line", layer: DIMENSION_LAYER, role: "extensionLine", x1: extensionX1, y1: stepTopY, x2: extensionX2, y2: stepTopY, stroke: color, strokeWidth: STROKE_WIDTH },
        { kind: "line", layer: DIMENSION_LAYER, role: "extensionLine", x1: extensionX1, y1: stepBottomY, x2: extensionX2, y2: stepBottomY, stroke: color, strokeWidth: STROKE_WIDTH },
    ];
}
