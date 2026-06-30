import type { ReactNode } from "react";
import type { FlangeFaceState, FlangeFaceRenderingMode } from "./flangeFaceRules";
import type { FlangeHalfSectionAnchors } from "./flangeDrawingModel";
import type { FlangePositions } from "./flangeGeometry";
import { FACE_RENDERING_MODES } from "./flangeRendererKeys";
import type { FlangeTypeDefinition } from "./flangeTypes";

type FlangeFaceProps = {
    faceState: FlangeFaceState;
    typeDefinition?: FlangeTypeDefinition;
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
};

type FaceRendererInput = {
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
    usesBlindBodyFaceFill: boolean;
    stroke: string;
};

const FACE_STRIP = 3;

const renderFlatFace = ({ halfSection, pos, stroke }: FaceRendererInput) => {
    const { bottomY, hubFaceRight } = pos;
    const { breakLineX } = halfSection;

    return (
        <>
          <line x1={breakLineX} y1={bottomY} x2={hubFaceRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
        </>
    );
};

const renderRaisedFace = ({ halfSection, pos, usesBlindBodyFaceFill, stroke }: FaceRendererInput) => {
    const { bottomY, hubFaceRight, boreRight, hubFaceWidth } = pos;
    const { breakLineX, boreWallX } = halfSection;
    const stripBottom = bottomY + FACE_STRIP;

    return (
        <>
            {usesBlindBodyFaceFill && <rect x={breakLineX} y={bottomY} width={boreWallX - breakLineX} height={FACE_STRIP} fill="url(#type01-hatch)" />}
            {!usesBlindBodyFaceFill && <line x1={breakLineX} y1={bottomY} x2={breakLineX} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
            <line x1={breakLineX} y1={stripBottom} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            {!usesBlindBodyFaceFill && <line x1={boreRight} y1={bottomY} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
            <rect x={boreRight} y={bottomY} width={hubFaceWidth} height={FACE_STRIP} fill="url(#type01-hatch)" />
            <line x1={boreRight} y1={stripBottom} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            <line x1={hubFaceRight} y1={bottomY} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
        </>
    );
};

const renderGrooveFace = ({ halfSection, pos, stroke }: FaceRendererInput) => {
    const { bottomY, hubFaceRight, hubFaceWidth } = pos;
    const { breakLineX } = halfSection;
    const stripBottom = bottomY + FACE_STRIP;
    const faceRelativeX = (offset: number) => hubFaceRight - hubFaceWidth * (offset / 26);
    const cr1 = faceRelativeX(20);
    const cr2 = faceRelativeX(5);

    return (
        <>
            <line x1={breakLineX} y1={bottomY + 2} x2={cr1} y2={bottomY + 2} stroke={stroke} strokeWidth="1" />
            <line x1={cr1} y1={bottomY} x2={cr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            <rect x={cr1} y={bottomY} width={cr2 - cr1} height={FACE_STRIP} fill="url(#type01-hatch)" />
            <line x1={cr1} y1={stripBottom} x2={cr2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            <line x1={cr2} y1={bottomY} x2={cr2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            <line x1={cr2} y1={bottomY} x2={hubFaceRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
        </>
    );
};

const renderSteppedFace = ({ halfSection, pos, usesBlindBodyFaceFill, stroke }: FaceRendererInput) => {
    const { bottomY, hubFaceRight, boreRight, hubFaceWidth } = pos;
    const { breakLineX } = halfSection;
    const stripBottom = bottomY + FACE_STRIP;
    const faceRelativeX = (offset: number) => hubFaceRight - hubFaceWidth * (offset / 26);
    const dr1 = faceRelativeX(15);
    const dr2 = faceRelativeX(8);

    return (
        <>
            {usesBlindBodyFaceFill && <rect x={breakLineX} y={bottomY} width={dr2 - breakLineX} height={FACE_STRIP} fill="url(#type01-hatch)" />}
            {!usesBlindBodyFaceFill && <line x1={breakLineX} y1={bottomY} x2={breakLineX} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
            {!usesBlindBodyFaceFill && <line x1={boreRight} y1={bottomY} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />}

            <line x1={breakLineX} y1={stripBottom} x2={dr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            <line x1={dr1} y1={bottomY} x2={dr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            <line x1={dr1} y1={bottomY} x2={dr2} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={dr2} y1={bottomY} x2={dr2} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            <line x1={dr2} y1={stripBottom} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            <line x1={hubFaceRight} y1={bottomY} x2={hubFaceRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />
        </>
    );
};

const renderRingJointFace = ({ halfSection, pos, usesBlindBodyFaceFill, stroke }: FaceRendererInput) => {
    const { bottomY, hubFaceRight, boreRight, hubFaceWidth } = pos;
    const { breakLineX } = halfSection;
    const stripBottom = bottomY + FACE_STRIP;
    const faceRelativeX = (offset: number) => hubFaceRight - hubFaceWidth * (offset / 26);
    const hr1 = faceRelativeX(17);
    const hr2 = faceRelativeX(15);
    const hr3 = faceRelativeX(10);
    const arcR = hubFaceWidth * 2 / 26;
    const hatchW = hubFaceWidth * 6 / 26;
    const rRectX = boreRight - hubFaceWidth / 26;

    return (
        <>
            {!usesBlindBodyFaceFill && <line x1={boreRight} y1={bottomY} x2={boreRight} y2={stripBottom} stroke={stroke} strokeWidth="1" />}
            <rect x={rRectX} y={bottomY - 2} width={hatchW} height={5} fill="url(#type01-hatch)" />

            <line x1={breakLineX} y1={stripBottom} x2={usesBlindBodyFaceFill ? breakLineX + 20 : hr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            <line x1={usesBlindBodyFaceFill ? breakLineX + 20 : hr1} y1={bottomY} x2={usesBlindBodyFaceFill ? breakLineX + 20 : hr1} y2={stripBottom} stroke={stroke} strokeWidth="1" />
            <path d={`M${usesBlindBodyFaceFill ? breakLineX + 20 : hr1} ${bottomY} A${arcR} ${arcR} 0 0 1 ${usesBlindBodyFaceFill ? breakLineX + 22 : hr2} ${bottomY - 2}`} fill="none" stroke={stroke} strokeWidth="1" />
            <line x1={usesBlindBodyFaceFill ? breakLineX + 22 : hr2} y1={bottomY - 2} x2={usesBlindBodyFaceFill ? breakLineX + 27 : hr3} y2={bottomY} stroke={stroke} strokeWidth="1" />
            <line x1={usesBlindBodyFaceFill ? breakLineX + 27 : hr3} y1={bottomY} x2={hubFaceRight} y2={bottomY} stroke={stroke} strokeWidth="1" />
        </>
    );
};

const renderFaceMode = (renderingMode: FlangeFaceRenderingMode, input: FaceRendererInput) => {
    const renderers = {
        noFace: renderFlatFace,
        flatFace: renderFlatFace,
        raisedFace: renderRaisedFace,
        grooveFace: renderGrooveFace,
        steppedFace: renderSteppedFace,
        ringJointFace: renderRingJointFace,
    } satisfies Record<(typeof FACE_RENDERING_MODES)[number], (input: FaceRendererInput) => ReactNode>;

    return renderers[renderingMode](input);
};

export default function FlangeFace({ faceState, typeDefinition, halfSection, pos }: FlangeFaceProps) {
    return renderFaceMode(faceState.renderingMode, {
        halfSection,
        pos,
        usesBlindBodyFaceFill: typeDefinition?.bodyKind === "blindHalfBody",
        stroke: "rgb(34, 33, 33)",
    });
}
