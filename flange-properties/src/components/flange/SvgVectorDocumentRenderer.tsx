import type { CSSProperties, AriaRole } from "react";
import SvgVectorRenderer from "./SvgVectorRenderer";
import {
    SVG_VECTOR_COLORS,
    SVG_VECTOR_IDS,
    SVG_VECTOR_STROKE_WIDTHS,
    type SvgVectorDocument,
} from "./engine/index";

type SvgVectorDocumentRendererProps = {
    document: SvgVectorDocument;
    className?: string;
    style?: CSSProperties;
    role?: AriaRole;
    "aria-label"?: string;
    preserveAspectRatio?: string;
};

function SvgVectorDefs() {
    return (
        <defs>
            <pattern id={SVG_VECTOR_IDS.hatchPattern} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke={SVG_VECTOR_COLORS.outline} strokeWidth={SVG_VECTOR_STROKE_WIDTHS.hatch} />
            </pattern>
            <marker id={SVG_VECTOR_IDS.arrowhead} markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                <path d="M0,1 L6,3 L0,5 z" fill={SVG_VECTOR_COLORS.outline} />
            </marker>
            <marker id={SVG_VECTOR_IDS.arrowheadReversed} markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">
                <path d="M0,1 L6,3 L0,5 z" fill={SVG_VECTOR_COLORS.outline} />
            </marker>
            <marker id={SVG_VECTOR_IDS.dimensionArrowhead} markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                <path d="M0,1 L6,3 L0,5 z" fill={SVG_VECTOR_COLORS.dimension} />
            </marker>
            <marker id={SVG_VECTOR_IDS.dimensionArrowheadReversed} markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">
                <path d="M0,1 L6,3 L0,5 z" fill={SVG_VECTOR_COLORS.dimension} />
            </marker>
        </defs>
    );
}

export default function SvgVectorDocumentRenderer({
    document,
    className,
    style,
    role,
    "aria-label": ariaLabel,
    preserveAspectRatio = "xMinYMin meet",
}: SvgVectorDocumentRendererProps) {
    const { bounds } = document;

    return (
        <svg
            className={className}
            viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
            preserveAspectRatio={preserveAspectRatio}
            role={role}
            aria-label={ariaLabel}
            style={style}
        >
            <SvgVectorDefs />
            <g>
                <SvgVectorRenderer elements={document.elements} />
            </g>
        </svg>
    );
}
