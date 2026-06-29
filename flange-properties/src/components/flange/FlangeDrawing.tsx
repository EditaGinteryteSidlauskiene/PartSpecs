import FlangeBody from "./FlangeBody";
import FlangeDimensions from "./FlangeDimensions";
import FlangeFace from "./FlangeFace.tsx";
import FlangeNeck from "./FlangeNeck";
import type { FlangeDrawingModel } from "./flangeDrawingModel";
import type { FlangeLookupResponse } from "./flangeMeasures";

type FlangeDrawingProps = {
    model: FlangeDrawingModel;
    response: FlangeLookupResponse;
    availableHeight?: number | null;
};

export default function FlangeDrawing({ model, response, availableHeight }: FlangeDrawingProps) {
    const svgStyle = availableHeight
        ? { height: `${Math.max(120, availableHeight - 24)}px`, width: "auto", maxWidth: "100%" }
        : undefined;

    return (
        <svg
            className="lookup-drawing-svg"
            viewBox={`${model.bounds.minX} ${model.bounds.minY} ${model.bounds.width} ${model.bounds.height}`}
            preserveAspectRatio="xMinYMin meet"
            role="img"
            aria-label="Flange visualization"
            style={svgStyle}
        >
            <defs>
                <pattern id="type01-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                </pattern>
                <marker id="type01-arrowhead" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                    <path d="M0,1 L6,3 L0,5 z" fill="rgb(34, 33, 33)" />
                </marker>
                <marker id="type01-arrowhead-rev" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">
                    <path d="M0,1 L6,3 L0,5 z" fill="rgb(34, 33, 33)" />
                </marker>
                <marker id="type01-arrowhead-green" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                    <path d="M0,1 L6,3 L0,5 z" fill="rgb(24, 93, 44)" />
                </marker>
                <marker id="type01-arrowhead-green-rev" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">
                    <path d="M0,1 L6,3 L0,5 z" fill="rgb(24, 93, 44)" />
                </marker>
            </defs>

            <g>
                <FlangeNeck flangeType={model.flangeType} pos={model.pos} />
                <FlangeBody flangeType={model.flangeType} pos={model.pos} />
                <FlangeFace face={model.face} flangeType={model.flangeType} pos={model.pos} />
                <FlangeDimensions
                    response={response}
                    flangeType={model.flangeType}
                    pos={model.pos}
                    rails={model.rails}
                    faceProfile={model.faceProfile}
                />
            </g>
        </svg>
    );
}
