export type SvgVectorMetadata = {
    layer?: string;
    role?: string;
};

export type SvgVectorMarker = string;
export type SvgVectorStrokeLineCap = "butt" | "round" | "square";
export type SvgVectorStrokeLineJoin = "bevel" | "inherit" | "miter" | "round";
export type SvgVectorTextAnchor = "start" | "middle" | "end" | "inherit";
export type SvgVectorDominantBaseline =
    | "auto"
    | "alphabetic"
    | "ideographic"
    | "middle"
    | "central"
    | "mathematical"
    | "hanging"
    | "use-script"
    | "no-change"
    | "reset-size"
    | "text-after-edge"
    | "text-before-edge"
    | "inherit";

export type SvgVectorPaint = string;

export type SvgVectorLine = SvgVectorMetadata & {
    kind: "line";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    stroke?: SvgVectorPaint;
    strokeWidth?: string | number;
    strokeDasharray?: string;
    markerStart?: SvgVectorMarker;
    markerEnd?: SvgVectorMarker;
};

export type SvgVectorRect = SvgVectorMetadata & {
    kind: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    fill?: SvgVectorPaint;
    stroke?: SvgVectorPaint;
    strokeWidth?: string | number;
};

export type SvgVectorPath = SvgVectorMetadata & {
    kind: "path";
    d: string;
    fill?: SvgVectorPaint;
    stroke?: SvgVectorPaint;
    strokeWidth?: string | number;
    strokeLinecap?: SvgVectorStrokeLineCap;
    strokeLinejoin?: SvgVectorStrokeLineJoin;
    markerStart?: SvgVectorMarker;
    markerEnd?: SvgVectorMarker;
    opacity?: string | number;
};

export type SvgVectorText = SvgVectorMetadata & {
    kind: "text";
    x: number;
    y: number;
    text: string | number;
    fill?: SvgVectorPaint;
    fontSize?: string | number;
    dominantBaseline?: SvgVectorDominantBaseline;
    textAnchor?: SvgVectorTextAnchor;
};

export type SvgVectorElement = SvgVectorLine | SvgVectorRect | SvgVectorPath | SvgVectorText;

export type SvgVectorBounds = {
    minX: number;
    minY: number;
    width: number;
    height: number;
};

export const SVG_VECTOR_DOCUMENT_SCHEMA_VERSION = "1.0" as const;
export type SvgVectorDocumentSchemaVersion = typeof SVG_VECTOR_DOCUMENT_SCHEMA_VERSION;

export type SvgVectorDocument<Metadata = Record<string, unknown>> = {
    schemaVersion: SvgVectorDocumentSchemaVersion;
    bounds: SvgVectorBounds;
    elements: SvgVectorElement[];
    metadata?: Metadata;
    warnings?: string[];
};
