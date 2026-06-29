type DiameterDimensionProps = {
    label: string;
    centerX: number;
    targetX: number;
    y: number;
    extensionX?: number;
    extensionY1?: number;
    extensionY2?: number;
    color: string;
};

type VerticalDimensionProps = {
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

type ExtensionLineProps = {
    x: number;
    y1: number;
    y2: number;
    color: string;
};

type BoltHoleCalloutProps = {
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

type FaceStripDimensionProps = {
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

type FaceDiameterDimensionProps = {
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

type FaceGrooveDimensionProps = {
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

type NeckWallDimensionProps = {
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

type RadiusLeaderDimensionProps = {
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

type NeckStepDimensionProps = {
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

export function DiameterDimension({
    label,
    centerX,
    targetX,
    y,
    extensionX,
    extensionY1,
    extensionY2,
    color,
}: DiameterDimensionProps) {
    return (
        <>
            <text x={centerX - 4} y={y} textAnchor="end" dominantBaseline="middle" fontSize="8" fill={color}>
                {label}
            </text>
            <line x1={centerX} y1={y} x2={targetX} y2={y} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
            {extensionX !== undefined && extensionY1 !== undefined && extensionY2 !== undefined && (
                <line x1={extensionX} y1={extensionY1} x2={extensionX} y2={extensionY2} stroke={color} strokeWidth="0.5" />
            )}
        </>
    );
}

export function ExtensionLine({ x, y1, y2, color }: ExtensionLineProps) {
    return <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth="0.5" />;
}

export function VerticalDimension({
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
}: VerticalDimensionProps) {
    return (
        <>
            <text x={textX} y={(y1 + y2) / 2 + textOffsetY} textAnchor="middle" fontSize="8" fill={color}>
                {label}
            </text>
            <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={topExtensionX1} y1={y1} x2={extensionX2} y2={y1} stroke={color} strokeWidth="0.5" />
            <line x1={bottomExtensionX1} y1={y2} x2={extensionX2} y2={y2} stroke={color} strokeWidth="0.5" />
        </>
    );
}

export function BoltHoleCallout({
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
}: BoltHoleCalloutProps) {
    return (
        <>
            <text x={textX} y={textY} textAnchor="middle" fontSize="8" fill={color}>
                {countAndDiameterLabel}
            </text>
            <ExtensionLine x={leftExtensionX} y1={extensionY1} y2={extensionY2} color={color} />
            <ExtensionLine x={rightExtensionX} y1={extensionY1} y2={extensionY2} color={color} />
            <line x1={leftArrowStartX} y1={arrowY} x2={leftExtensionX} y2={arrowY} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={rightArrowStartX} y1={arrowY} x2={rightExtensionX} y2={arrowY} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
            <text x={textX} y={sizeTextY} textAnchor="middle" fontSize="8" fill={color}>
                {boltSizeLabel}
            </text>
        </>
    );
}

export function FaceStripDimension({
    label,
    annotationX,
    labelY,
    topY,
    stripBottomY,
    lowerArrowEndY,
    extLeftX,
    extRightX,
    color,
}: FaceStripDimensionProps) {
    return (
        <>
            <text x={annotationX + 5} y={labelY} textAnchor="middle" fontSize="8" fill={color}>{label}</text>
            <line x1={annotationX} y1={topY} x2={annotationX} y2={stripBottomY} stroke={color} strokeWidth="0.5" />
            <line x1={extRightX} y1={topY} x2={extLeftX} y2={topY} stroke={color} strokeWidth="0.5" />
            <line x1={extRightX} y1={stripBottomY} x2={extLeftX} y2={stripBottomY} stroke={color} strokeWidth="0.5" />
            <line x1={annotationX} y1={topY - 10} x2={annotationX} y2={topY} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={annotationX} y1={stripBottomY} x2={annotationX} y2={lowerArrowEndY} stroke={color} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" />
        </>
    );
}

export function FaceDiameterDimension({
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
}: FaceDiameterDimensionProps) {
    return (
        <>
            <text x={labelX} y={labelY} textAnchor="middle" fontSize="8" fill={color}>{label}</text>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" markerEnd="url(#type01-arrowhead-green)" />
            <ExtensionLine x={extensionX} y1={extensionY1} y2={extensionY2} color={color} />
        </>
    );
}

export function FaceGrooveDimension({
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
}: FaceGrooveDimensionProps) {
    return (
        <>
            <text x={leftX} y={labelY} textAnchor="middle" fontSize="8" fill={color}>{label}</text>
            <text x={rightX} y={labelY} textAnchor="middle" fontSize="8" fill={color}>{label}</text>

            <line x1={upperGuideX1} y1={stripBottomY} x2={upperGuideX2} y2={stripBottomY} stroke={color} strokeWidth="0.5" />
            <line x1={lowerGuideX1} y1={stripBottomY} x2={lowerGuideX2} y2={stripBottomY} stroke={color} strokeWidth="0.5" />

            <line x1={leftX} y1={stripBottomY} x2={leftX} y2={topY} stroke={color} strokeWidth="0.5" />
            <line x1={rightX} y1={stripBottomY} x2={rightX} y2={topY} stroke={color} strokeWidth="0.5" />

            <line x1={leftX} y1={topY - 10} x2={leftX} y2={topY} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={leftX} y1={lowerArrowEndY} x2={leftX} y2={stripBottomY} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={rightX} y1={topY - 10} x2={rightX} y2={topY} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={rightX} y1={lowerArrowEndY} x2={rightX} y2={stripBottomY} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
        </>
    );
}

export function NeckWallDimension({
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
}: NeckWallDimensionProps) {
    return (
        <>
            <text x={labelX} y={y - 2} textAnchor="middle" fontSize="8" fill={color}>{label}</text>
            <ExtensionLine x={outerX} y1={topY} y2={bottomY} color={color} />
            <ExtensionLine x={boreX} y1={topY} y2={bottomY} color={color} />
            <line x1={leftArrowStartX} y1={y} x2={boreX} y2={y} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={rightArrowStartX} y1={y} x2={outerX} y2={y} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
        </>
    );
}

export function RadiusLeaderDimension({
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
}: RadiusLeaderDimensionProps) {
    return (
        <>
            <text x={textX} y={textY} textAnchor="middle" fontSize="8" fill={color}>{label}</text>
            <line x1={originX} y1={originY} x2={leaderEndX} y2={originY} stroke={color} strokeWidth="0.5" />
            <line x1={originX} y1={originY} x2={target1X} y2={target1Y} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
            <line x1={originX} y1={originY} x2={target2X} y2={target2Y} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green)" />
        </>
    );
}

export function NeckStepDimension({
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
}: NeckStepDimensionProps) {
    return (
        <>
            <text x={textX} y={textY} textAnchor="middle" fontSize="8" fill={color}>{label}</text>
            <line x1={x} y1={stepTopY} x2={x} y2={stepBottomY} stroke={color} strokeWidth="0.5" />
            <line x1={x} y1={upperArrowStartY} x2={x} y2={stepTopY} stroke={color} strokeWidth="0.5" markerEnd="url(#type01-arrowhead-green-rev)" />
            <line x1={x} y1={stepBottomY} x2={x} y2={lowerArrowEndY} stroke={color} strokeWidth="0.5" markerStart="url(#type01-arrowhead-green-rev)" />
            <line x1={extensionX1} y1={stepTopY} x2={extensionX2} y2={stepTopY} stroke={color} strokeWidth="0.5" />
            <line x1={extensionX1} y1={stepBottomY} x2={extensionX2} y2={stepBottomY} stroke={color} strokeWidth="0.5" />
        </>
    );
}
