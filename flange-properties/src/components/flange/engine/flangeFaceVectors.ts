import type { FlangeHalfSectionAnchors } from "./flangeDrawingModel";
import type { FlangeFaceRenderingMode } from "./flangeFaceRules";
import type { FlangePositions } from "./flangeGeometry";
import { FACE_RENDERING_MODES } from "./flangeRendererKeys";
import { SVG_VECTOR_COLORS, SVG_VECTOR_FILLS } from "./svgVectorDefinitions";
import type { SvgVectorElement } from "./svgVectorTypes";

type FaceRendererInput = {
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
    usesBlindBodyFaceFill: boolean;
    stroke: string;
};

type BuildFlangeFaceVectorsInput = {
    renderingMode: FlangeFaceRenderingMode;
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
    usesBlindBodyFaceFill: boolean;
    stroke?: string;
};

const FACE_LAYER = "face";
const FACE_STRIP = 3;

const buildFlatFaceVectors = ({ halfSection, pos, stroke }: FaceRendererInput): SvgVectorElement[] => {
    const { bottomY, hubFaceRight } = pos;
    const { breakLineX } = halfSection;

    return [
        { kind: "line", layer: FACE_LAYER, role: "flatFaceLine", x1: breakLineX, y1: bottomY, x2: hubFaceRight, y2: bottomY, stroke, strokeWidth: "1" },
    ];
};

const buildRaisedFaceVectors = ({ halfSection, pos, usesBlindBodyFaceFill, stroke }: FaceRendererInput): SvgVectorElement[] => {
    const { bottomY, hubFaceRight, boreRight, hubFaceWidth } = pos;
    const { breakLineX, boreWallX } = halfSection;
    const stripBottom = bottomY + FACE_STRIP;

    return [
        ...(usesBlindBodyFaceFill
            ? [{ kind: "rect" as const, layer: FACE_LAYER, role: "raisedFaceFill", x: breakLineX, y: bottomY, width: boreWallX - breakLineX, height: FACE_STRIP, fill: SVG_VECTOR_FILLS.hatch }]
            : [{ kind: "line" as const, layer: FACE_LAYER, role: "raisedFaceContour", x1: breakLineX, y1: bottomY, x2: breakLineX, y2: stripBottom, stroke, strokeWidth: "1" }]),
        { kind: "line", layer: FACE_LAYER, role: "raisedFaceContour", x1: breakLineX, y1: stripBottom, x2: boreRight, y2: stripBottom, stroke, strokeWidth: "1" },
        ...(!usesBlindBodyFaceFill
            ? [{ kind: "line" as const, layer: FACE_LAYER, role: "raisedFaceContour", x1: boreRight, y1: bottomY, x2: boreRight, y2: stripBottom, stroke, strokeWidth: "1" }]
            : []),
        { kind: "rect", layer: FACE_LAYER, role: "raisedFaceFill", x: boreRight, y: bottomY, width: hubFaceWidth, height: FACE_STRIP, fill: SVG_VECTOR_FILLS.hatch },
        { kind: "line", layer: FACE_LAYER, role: "raisedFaceContour", x1: boreRight, y1: stripBottom, x2: hubFaceRight, y2: stripBottom, stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "raisedFaceContour", x1: hubFaceRight, y1: bottomY, x2: hubFaceRight, y2: stripBottom, stroke, strokeWidth: "1" },
    ];
};

const buildGrooveFaceVectors = ({ halfSection, pos, stroke }: FaceRendererInput): SvgVectorElement[] => {
    const { bottomY, hubFaceRight, hubFaceWidth } = pos;
    const { breakLineX } = halfSection;
    const stripBottom = bottomY + FACE_STRIP;
    const faceRelativeX = (offset: number) => hubFaceRight - hubFaceWidth * (offset / 26);
    const cr1 = faceRelativeX(20);
    const cr2 = faceRelativeX(5);

    return [
        { kind: "line", layer: FACE_LAYER, role: "grooveFaceContour", x1: breakLineX, y1: bottomY + 2, x2: cr1, y2: bottomY + 2, stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "grooveFaceContour", x1: cr1, y1: bottomY, x2: cr1, y2: stripBottom, stroke, strokeWidth: "1" },
        { kind: "rect", layer: FACE_LAYER, role: "grooveFaceFill", x: cr1, y: bottomY, width: cr2 - cr1, height: FACE_STRIP, fill: SVG_VECTOR_FILLS.hatch },
        { kind: "line", layer: FACE_LAYER, role: "grooveFaceContour", x1: cr1, y1: stripBottom, x2: cr2, y2: stripBottom, stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "grooveFaceContour", x1: cr2, y1: bottomY, x2: cr2, y2: stripBottom, stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "grooveFaceContour", x1: cr2, y1: bottomY, x2: hubFaceRight, y2: bottomY, stroke, strokeWidth: "1" },
    ];
};

const buildSteppedFaceVectors = ({ halfSection, pos, usesBlindBodyFaceFill, stroke }: FaceRendererInput): SvgVectorElement[] => {
    const { bottomY, hubFaceRight, boreRight, hubFaceWidth } = pos;
    const { breakLineX } = halfSection;
    const stripBottom = bottomY + FACE_STRIP;
    const faceRelativeX = (offset: number) => hubFaceRight - hubFaceWidth * (offset / 26);
    const dr1 = faceRelativeX(15);
    const dr2 = faceRelativeX(8);

    return [
        ...(usesBlindBodyFaceFill
            ? [{ kind: "rect" as const, layer: FACE_LAYER, role: "steppedFaceFill", x: breakLineX, y: bottomY, width: dr2 - breakLineX, height: FACE_STRIP, fill: SVG_VECTOR_FILLS.hatch }]
            : [
                { kind: "line" as const, layer: FACE_LAYER, role: "steppedFaceContour", x1: breakLineX, y1: bottomY, x2: breakLineX, y2: stripBottom, stroke, strokeWidth: "1" },
                { kind: "line" as const, layer: FACE_LAYER, role: "steppedFaceContour", x1: boreRight, y1: bottomY, x2: boreRight, y2: stripBottom, stroke, strokeWidth: "1" },
            ]),
        { kind: "line", layer: FACE_LAYER, role: "steppedFaceContour", x1: breakLineX, y1: stripBottom, x2: dr1, y2: stripBottom, stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "steppedFaceContour", x1: dr1, y1: bottomY, x2: dr1, y2: stripBottom, stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "steppedFaceContour", x1: dr1, y1: bottomY, x2: dr2, y2: bottomY, stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "steppedFaceContour", x1: dr2, y1: bottomY, x2: dr2, y2: stripBottom, stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "steppedFaceContour", x1: dr2, y1: stripBottom, x2: hubFaceRight, y2: stripBottom, stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "steppedFaceContour", x1: hubFaceRight, y1: bottomY, x2: hubFaceRight, y2: stripBottom, stroke, strokeWidth: "1" },
    ];
};

const buildRingJointFaceVectors = ({ halfSection, pos, usesBlindBodyFaceFill, stroke }: FaceRendererInput): SvgVectorElement[] => {
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
    const firstContourX = usesBlindBodyFaceFill ? breakLineX + 20 : hr1;
    const arcEndX = usesBlindBodyFaceFill ? breakLineX + 22 : hr2;
    const slopeEndX = usesBlindBodyFaceFill ? breakLineX + 27 : hr3;

    return [
        ...(!usesBlindBodyFaceFill
            ? [{ kind: "line" as const, layer: FACE_LAYER, role: "ringJointContour", x1: boreRight, y1: bottomY, x2: boreRight, y2: stripBottom, stroke, strokeWidth: "1" }]
            : []),
        { kind: "rect", layer: FACE_LAYER, role: "ringJointFill", x: rRectX, y: bottomY - 2, width: hatchW, height: 5, fill: SVG_VECTOR_FILLS.hatch },
        { kind: "line", layer: FACE_LAYER, role: "ringJointContour", x1: breakLineX, y1: stripBottom, x2: firstContourX, y2: stripBottom, stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "ringJointContour", x1: firstContourX, y1: bottomY, x2: firstContourX, y2: stripBottom, stroke, strokeWidth: "1" },
        { kind: "path", layer: FACE_LAYER, role: "ringJointArc", d: `M${firstContourX} ${bottomY} A${arcR} ${arcR} 0 0 1 ${arcEndX} ${bottomY - 2}`, fill: "none", stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "ringJointContour", x1: arcEndX, y1: bottomY - 2, x2: slopeEndX, y2: bottomY, stroke, strokeWidth: "1" },
        { kind: "line", layer: FACE_LAYER, role: "ringJointContour", x1: slopeEndX, y1: bottomY, x2: hubFaceRight, y2: bottomY, stroke, strokeWidth: "1" },
    ];
};

export const buildFlangeFaceVectors = ({
    renderingMode,
    halfSection,
    pos,
    usesBlindBodyFaceFill,
    stroke = SVG_VECTOR_COLORS.outline,
}: BuildFlangeFaceVectorsInput): SvgVectorElement[] => {
    const renderers = {
        noFace: buildFlatFaceVectors,
        flatFace: buildFlatFaceVectors,
        raisedFace: buildRaisedFaceVectors,
        grooveFace: buildGrooveFaceVectors,
        steppedFace: buildSteppedFaceVectors,
        ringJointFace: buildRingJointFaceVectors,
    } satisfies Record<(typeof FACE_RENDERING_MODES)[number], (input: FaceRendererInput) => SvgVectorElement[]>;

    return renderers[renderingMode]({ halfSection, pos, usesBlindBodyFaceFill, stroke });
};
