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
    const unsupportedMessage = model.typeDefinition?.isSupportedForDrawing === false
        ? model.typeDefinition.unsupportedDrawingMessage ?? "Drawing not implemented for this flange type."
        : model.flangeType && !model.typeDefinition
            ? `Drawing not implemented for flange type ${model.flangeType}.`
            : null;

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
                {unsupportedMessage ? (
                    <text
                        x={model.bounds.minX + model.bounds.width / 2}
                        y={model.bounds.minY + model.bounds.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgb(34, 33, 33)"
                        fontSize="12"
                    >
                        {unsupportedMessage}
                    </text>
                ) : (
                    <>
                        <FlangeNeck typeDefinition={model.typeDefinition} halfSection={model.halfSection} pos={model.pos} />
                        <FlangeBody typeDefinition={model.typeDefinition} halfSection={model.halfSection} />
                        <FlangeFace faceState={model.faceState} halfSection={model.halfSection} pos={model.pos} typeDefinition={model.typeDefinition} />
                        <FlangeDimensions
                            response={response}
                            typeDefinition={model.typeDefinition}
                            halfSection={model.halfSection}
                            pos={model.pos}
                            rails={model.rails}
                            faceProfile={model.faceProfile}
                        />
                    </>
                )}
            </g>
        </svg>
    );
}
