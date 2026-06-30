export const SVG_VECTOR_COLORS = {
    outline: "rgb(34, 33, 33)",
    dimension: "rgb(24, 93, 44)",
    breakLine: "rgb(34, 33, 33)",
} as const;

export const SVG_VECTOR_STROKE_WIDTHS = {
    hatch: "1",
    outline: "0.75",
    dimension: "0.5",
} as const;

export const SVG_VECTOR_FONT_SIZES = {
    fallback: "12",
} as const;

export const SVG_VECTOR_IDS = {
    hatchPattern: "type01-hatch",
    arrowhead: "type01-arrowhead",
    arrowheadReversed: "type01-arrowhead-rev",
    dimensionArrowhead: "type01-arrowhead-green",
    dimensionArrowheadReversed: "type01-arrowhead-green-rev",
} as const;

export const svgVectorUrl = (id: string): string => `url(#${id})`;

export const SVG_VECTOR_FILLS = {
    hatch: svgVectorUrl(SVG_VECTOR_IDS.hatchPattern),
    outline: SVG_VECTOR_COLORS.outline,
    dimension: SVG_VECTOR_COLORS.dimension,
} as const;

export const SVG_VECTOR_MARKERS = {
    arrowhead: svgVectorUrl(SVG_VECTOR_IDS.arrowhead),
    arrowheadReversed: svgVectorUrl(SVG_VECTOR_IDS.arrowheadReversed),
    dimensionArrowhead: svgVectorUrl(SVG_VECTOR_IDS.dimensionArrowhead),
    dimensionArrowheadReversed: svgVectorUrl(SVG_VECTOR_IDS.dimensionArrowheadReversed),
} as const;

export const getSvgVectorDefsMarkup = (): string => [
    "<defs>",
    `<pattern id="${SVG_VECTOR_IDS.hatchPattern}" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">`,
    `<line x1="0" y1="0" x2="0" y2="6" stroke="${SVG_VECTOR_COLORS.outline}" stroke-width="${SVG_VECTOR_STROKE_WIDTHS.hatch}" />`,
    "</pattern>",
    `<marker id="${SVG_VECTOR_IDS.arrowhead}" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">`,
    `<path d="M0,1 L6,3 L0,5 z" fill="${SVG_VECTOR_COLORS.outline}" />`,
    "</marker>",
    `<marker id="${SVG_VECTOR_IDS.arrowheadReversed}" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">`,
    `<path d="M0,1 L6,3 L0,5 z" fill="${SVG_VECTOR_COLORS.outline}" />`,
    "</marker>",
    `<marker id="${SVG_VECTOR_IDS.dimensionArrowhead}" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">`,
    `<path d="M0,1 L6,3 L0,5 z" fill="${SVG_VECTOR_COLORS.dimension}" />`,
    "</marker>",
    `<marker id="${SVG_VECTOR_IDS.dimensionArrowheadReversed}" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">`,
    `<path d="M0,1 L6,3 L0,5 z" fill="${SVG_VECTOR_COLORS.dimension}" />`,
    "</marker>",
    "</defs>",
].join("");
