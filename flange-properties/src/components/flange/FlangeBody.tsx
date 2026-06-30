import type { ReactNode } from "react";
import type { FlangeHalfSectionAnchors } from "./flangeDrawingModel";
import { BODY_RENDERER_KINDS } from "./flangeRendererKeys";
import type { FlangeTypeDefinition } from "./flangeTypes";

type FlangeBodyProps = {
    typeDefinition?: FlangeTypeDefinition;
    halfSection: FlangeHalfSectionAnchors;
};

type BodyRendererInput = {
    halfSection: FlangeHalfSectionAnchors;
    lightningStart: FlangeTypeDefinition["lightningStart"];
    stroke: string;
    dashStroke: string;
};

const renderBlindHalfBody = ({ halfSection, dashStroke }: BodyRendererInput) => {
    const {
        boreWallX,
        topY: sectionTopY,
        bottomY: sectionBottomY,
    } = halfSection;

    return (
        <>
            <path d={`M${boreWallX + 2},${sectionTopY} L${boreWallX + 5},${sectionTopY + 8} L${boreWallX},${sectionTopY + 12} L${boreWallX + 5},${sectionBottomY}`}
                  fill="none" stroke={dashStroke} strokeWidth="1.5" />
            <path d={`M${boreWallX + 2},${sectionTopY} L${boreWallX + 5},${sectionTopY + 8} L${boreWallX},${sectionTopY + 12} L${boreWallX + 5},${sectionBottomY}`}
                  fill="none" stroke="rgb(255, 255, 255)" strokeWidth="0.5" opacity="0.6" />
        </>
    );
};

const renderStandardHalfBody = ({ halfSection, lightningStart, stroke, dashStroke }: BodyRendererInput) => {
    const {
        boreWallX,
        breakLineX,
        topY: sectionTopY,
        bottomY: sectionBottomY,
        neckTopY: sectionNeckTopY,
    } = halfSection;
    const lightningTopY = lightningStart === "neckTopY" ? sectionNeckTopY : sectionTopY;

    return (
        <>
            {/* Bore line */}
            <line x1={boreWallX} y1={sectionTopY} x2={boreWallX} y2={sectionBottomY} stroke={stroke} strokeWidth="1" />
            {/* Lightning bolt at bore middle to show missing half */}
            <path d={`M${breakLineX - 3},${lightningTopY} L${breakLineX},${lightningTopY + 8} L${breakLineX - 5},${lightningTopY + 12} L${breakLineX},${sectionBottomY}`}
                  fill="none" stroke={dashStroke} strokeWidth="1.5" />
            <path d={`M${breakLineX - 3},${lightningTopY} L${breakLineX},${lightningTopY + 8} L${breakLineX - 5},${lightningTopY + 12} L${breakLineX},${sectionBottomY}`}
                  fill="none" stroke="rgb(255, 255, 255)" strokeWidth="0.5" opacity="0.6" />
            {/* Bore fill area */}
            <rect x={breakLineX - 1} y={sectionTopY} width={boreWallX - breakLineX - 1} height={lightningTopY + 8 - lightningTopY} fill="none" />
            <rect x={breakLineX - 3.5} y={lightningTopY + 8} width={boreWallX - breakLineX - 1.5} height={(sectionBottomY - (lightningTopY + 12)) / 2} fill="none" />
            <rect x={breakLineX - 1.5} y={lightningTopY + (sectionBottomY - (lightningTopY + 12)) / 2} width={boreWallX - breakLineX - 1.5} height={sectionBottomY - (lightningTopY + (sectionBottomY - (lightningTopY + 12)) / 2)} fill="none" />
        </>
    );
};

const renderBodyCenter = (bodyKind: FlangeTypeDefinition["bodyKind"], input: BodyRendererInput) => {
    const renderers = {
        standardHalfBody: renderStandardHalfBody,
        blindHalfBody: renderBlindHalfBody,
    } satisfies Record<(typeof BODY_RENDERER_KINDS)[number], (input: BodyRendererInput) => ReactNode>;

    return renderers[bodyKind](input);
};

const renderOuterBodySections = (halfSection: FlangeHalfSectionAnchors, stroke: string, dashStroke: string) => {
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

    return (
        <>
            <line x1={hubNeckX} y1={sectionTopY} x2={hubFaceX} y2={sectionTopY} stroke={stroke} strokeWidth="1" />
            <line x1={hubFaceX} y1={sectionTopY} x2={hubOuterX} y2={sectionTopY} stroke={stroke} strokeWidth="1" />
            <line x1={hubOuterX} y1={sectionTopY} x2={hubOuterX} y2={sectionBottomY} stroke={stroke} strokeWidth="1" />
            <line x1={hubFaceX} y1={sectionBottomY} x2={hubOuterX} y2={sectionBottomY} stroke={stroke} strokeWidth="1" />

            {/* Right bolt zone */}
            <rect x={hubOuterX} y={sectionTopY} width={boltOuterX - hubOuterX} height={thickness} fill="none" />
            <line x1={hubOuterX} y1={sectionTopY} x2={boltOuterX} y2={sectionTopY} stroke={stroke} strokeWidth="1" />
            <line x1={hubOuterX} y1={sectionTopY} x2={hubOuterX} y2={sectionBottomY} stroke={stroke} strokeWidth="1" />
            <line x1={hubOuterX} y1={sectionBottomY} x2={boltOuterX} y2={sectionBottomY} stroke={stroke} strokeWidth="1" />
            <line x1={boltOuterX} y1={sectionTopY} x2={boltOuterX} y2={sectionBottomY} stroke={stroke} strokeWidth="1" />
            <line x1={boltCenterX} y1={centerLineTopY} x2={boltCenterX} y2={sectionBottomY} stroke={dashStroke} strokeWidth="0.75" strokeDasharray="8,3" />

            {/* Right outer rim */}
            <rect x={boltOuterX} y={sectionTopY} width={outerEdgeX - boltOuterX} height={thickness} fill="url(#type01-hatch)" />
            <line x1={boltOuterX} y1={sectionTopY} x2={outerEdgeX} y2={sectionTopY} stroke={stroke} strokeWidth="1" />
            <line x1={boltOuterX} y1={sectionBottomY} x2={outerEdgeX} y2={sectionBottomY} stroke={stroke} strokeWidth="1" />
            <line x1={outerEdgeX} y1={sectionTopY} x2={outerEdgeX} y2={sectionBottomY} stroke={stroke} strokeWidth="1" />
        </>
    );
};

export default function FlangeBody({ typeDefinition, halfSection }: FlangeBodyProps) {
    const bodyKind = typeDefinition?.bodyKind ?? "standardHalfBody";
    const lightningStart = typeDefinition?.lightningStart ?? "topY";
    const {
        boreWallX,
        hubOuterX,
        topY: sectionTopY,
        bottomY: sectionBottomY,
    } = halfSection;

    const thickness = sectionBottomY - sectionTopY;
    const stroke = "rgb(34, 33, 33)";
    const dashStroke = "rgb(100, 97, 97)";

    return (
        <>
            {/* Right hub */}
            <rect x={boreWallX} y={sectionTopY} width={hubOuterX - boreWallX} height={thickness} fill="url(#type01-hatch)" />
            {renderBodyCenter(bodyKind, { halfSection, lightningStart, stroke, dashStroke })}
            {renderOuterBodySections(halfSection, stroke, dashStroke)}
        </>
    );
}
