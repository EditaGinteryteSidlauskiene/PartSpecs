import type { FlangeHalfSectionAnchors } from "./flangeDrawingModel";
import { BODY_RENDERER_KINDS } from "./flangeRendererKeys";
import type { FlangeTypeDefinition } from "./flangeTypes";
import { SVG_VECTOR_COLORS, SVG_VECTOR_FILLS } from "./svgVectorDefinitions";
import type { SvgVectorElement } from "./svgVectorTypes";

type BodyRendererInput = {
    halfSection: FlangeHalfSectionAnchors;
    lightningStart: FlangeTypeDefinition["lightningStart"];
    stroke: string;
    dashStroke: string;
};

type BuildFlangeBodyVectorsInput = {
    bodyKind: FlangeTypeDefinition["bodyKind"];
    lightningStart: FlangeTypeDefinition["lightningStart"];
    halfSection: FlangeHalfSectionAnchors;
    stroke?: string;
    dashStroke?: string;
};

const BODY_LAYER = "body";

const buildBlindHalfBodyVectors = ({ halfSection, dashStroke }: BodyRendererInput): SvgVectorElement[] => {
    const {
        boreWallX,
        topY: sectionTopY,
        bottomY: sectionBottomY,
    } = halfSection;
    const breakPath = `M${boreWallX + 2},${sectionTopY} L${boreWallX + 5},${sectionTopY + 8} L${boreWallX},${sectionTopY + 12} L${boreWallX + 5},${sectionBottomY}`;

    return [
        { kind: "path", layer: BODY_LAYER, role: "breakLine", d: breakPath, fill: "none", stroke: dashStroke, strokeWidth: "1.5" },
        { kind: "path", layer: BODY_LAYER, role: "breakLine", d: breakPath, fill: "none", stroke: "rgb(255, 255, 255)", strokeWidth: "0.5", opacity: "0.6" },
    ];
};

const buildStandardHalfBodyVectors = ({ halfSection, lightningStart, stroke, dashStroke }: BodyRendererInput): SvgVectorElement[] => {
    const {
        boreWallX,
        breakLineX,
        topY: sectionTopY,
        bottomY: sectionBottomY,
        neckTopY: sectionNeckTopY,
    } = halfSection;
    const lightningTopY = lightningStart === "neckTopY" ? sectionNeckTopY : sectionTopY;
    const breakPath = `M${breakLineX - 3},${lightningTopY} L${breakLineX},${lightningTopY + 8} L${breakLineX - 5},${lightningTopY + 12} L${breakLineX},${sectionBottomY}`;

    return [
        { kind: "line", layer: BODY_LAYER, role: "boreWall", x1: boreWallX, y1: sectionTopY, x2: boreWallX, y2: sectionBottomY, stroke, strokeWidth: "1" },
        { kind: "path", layer: BODY_LAYER, role: "breakLine", d: breakPath, fill: "none", stroke: dashStroke, strokeWidth: "1.5" },
        { kind: "path", layer: BODY_LAYER, role: "breakLine", d: breakPath, fill: "none", stroke: "rgb(255, 255, 255)", strokeWidth: "0.5", opacity: "0.6" },
        { kind: "rect", layer: BODY_LAYER, role: "boreOpening", x: breakLineX - 1, y: sectionTopY, width: boreWallX - breakLineX - 1, height: lightningTopY + 8 - lightningTopY, fill: "none" },
        { kind: "rect", layer: BODY_LAYER, role: "boreOpening", x: breakLineX - 3.5, y: lightningTopY + 8, width: boreWallX - breakLineX - 1.5, height: (sectionBottomY - (lightningTopY + 12)) / 2, fill: "none" },
        { kind: "rect", layer: BODY_LAYER, role: "boreOpening", x: breakLineX - 1.5, y: lightningTopY + (sectionBottomY - (lightningTopY + 12)) / 2, width: boreWallX - breakLineX - 1.5, height: sectionBottomY - (lightningTopY + (sectionBottomY - (lightningTopY + 12)) / 2), fill: "none" },
    ];
};

const buildBodyCenterVectors = (bodyKind: FlangeTypeDefinition["bodyKind"], input: BodyRendererInput): SvgVectorElement[] => {
    const renderers = {
        standardHalfBody: buildStandardHalfBodyVectors,
        blindHalfBody: buildBlindHalfBodyVectors,
    } satisfies Record<(typeof BODY_RENDERER_KINDS)[number], (input: BodyRendererInput) => SvgVectorElement[]>;

    return renderers[bodyKind](input);
};

const buildOuterBodySectionVectors = (halfSection: FlangeHalfSectionAnchors, stroke: string, dashStroke: string): SvgVectorElement[] => {
    const {
        hubFaceX,
        hubNeckX,
        hubOuterX,
        boltCenterX,
        boltOuterX,
        outerEdgeX,
        topY: sectionTopY,
        bottomY: sectionBottomY,
    } = halfSection;
    const thickness = sectionBottomY - sectionTopY;
    const centerLineTopY = sectionTopY - 2;

    return [
        { kind: "line", layer: BODY_LAYER, role: "hubContour", x1: hubNeckX, y1: sectionTopY, x2: hubFaceX, y2: sectionTopY, stroke, strokeWidth: "1" },
        { kind: "line", layer: BODY_LAYER, role: "hubContour", x1: hubFaceX, y1: sectionTopY, x2: hubOuterX, y2: sectionTopY, stroke, strokeWidth: "1" },
        { kind: "line", layer: BODY_LAYER, role: "hubContour", x1: hubOuterX, y1: sectionTopY, x2: hubOuterX, y2: sectionBottomY, stroke, strokeWidth: "1" },
        { kind: "line", layer: BODY_LAYER, role: "hubContour", x1: hubFaceX, y1: sectionBottomY, x2: hubOuterX, y2: sectionBottomY, stroke, strokeWidth: "1" },
        { kind: "rect", layer: BODY_LAYER, role: "boltZone", x: hubOuterX, y: sectionTopY, width: boltOuterX - hubOuterX, height: thickness, fill: "none" },
        { kind: "line", layer: BODY_LAYER, role: "boltZone", x1: hubOuterX, y1: sectionTopY, x2: boltOuterX, y2: sectionTopY, stroke, strokeWidth: "1" },
        { kind: "line", layer: BODY_LAYER, role: "boltZone", x1: hubOuterX, y1: sectionTopY, x2: hubOuterX, y2: sectionBottomY, stroke, strokeWidth: "1" },
        { kind: "line", layer: BODY_LAYER, role: "boltZone", x1: hubOuterX, y1: sectionBottomY, x2: boltOuterX, y2: sectionBottomY, stroke, strokeWidth: "1" },
        { kind: "line", layer: BODY_LAYER, role: "boltZone", x1: boltOuterX, y1: sectionTopY, x2: boltOuterX, y2: sectionBottomY, stroke, strokeWidth: "1" },
        { kind: "line", layer: BODY_LAYER, role: "boltCenterLine", x1: boltCenterX, y1: centerLineTopY, x2: boltCenterX, y2: sectionBottomY, stroke: dashStroke, strokeWidth: "0.75", strokeDasharray: "8,3" },
        { kind: "rect", layer: BODY_LAYER, role: "outerRim", x: boltOuterX, y: sectionTopY, width: outerEdgeX - boltOuterX, height: thickness, fill: SVG_VECTOR_FILLS.hatch },
        { kind: "line", layer: BODY_LAYER, role: "outerRim", x1: boltOuterX, y1: sectionTopY, x2: outerEdgeX, y2: sectionTopY, stroke, strokeWidth: "1" },
        { kind: "line", layer: BODY_LAYER, role: "outerRim", x1: boltOuterX, y1: sectionBottomY, x2: outerEdgeX, y2: sectionBottomY, stroke, strokeWidth: "1" },
        { kind: "line", layer: BODY_LAYER, role: "outerEdge", x1: outerEdgeX, y1: sectionTopY, x2: outerEdgeX, y2: sectionBottomY, stroke, strokeWidth: "1" },
    ];
};

export const buildFlangeBodyVectors = ({
    bodyKind,
    lightningStart,
    halfSection,
    stroke = SVG_VECTOR_COLORS.outline,
    dashStroke = "rgb(100, 97, 97)",
}: BuildFlangeBodyVectorsInput): SvgVectorElement[] => {
    const {
        boreWallX,
        hubOuterX,
        topY: sectionTopY,
        bottomY: sectionBottomY,
    } = halfSection;
    const thickness = sectionBottomY - sectionTopY;

    return [
        { kind: "rect", layer: BODY_LAYER, role: "hubFill", x: boreWallX, y: sectionTopY, width: hubOuterX - boreWallX, height: thickness, fill: SVG_VECTOR_FILLS.hatch },
        ...buildBodyCenterVectors(bodyKind, { halfSection, lightningStart, stroke, dashStroke }),
        ...buildOuterBodySectionVectors(halfSection, stroke, dashStroke),
    ];
};
