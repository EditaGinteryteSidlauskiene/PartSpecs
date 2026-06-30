import type { FlangeHalfSectionAnchors } from "./flangeDrawingModel";
import type { FlangePositions } from "./flangeGeometry";
import { NECK_RENDERER_KINDS } from "./flangeRendererKeys";
import type { FlangeTypeDefinition } from "./flangeTypes";
import { SVG_VECTOR_COLORS, SVG_VECTOR_FILLS } from "./svgVectorDefinitions";
import type { SvgVectorElement } from "./svgVectorTypes";

type NeckRendererInput = {
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
    stroke: string;
};

type BuildFlangeNeckVectorsInput = {
    neckKind?: FlangeTypeDefinition["neckKind"];
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
    stroke?: string;
};

const NECK_LAYER = "neck";

const buildNoNeckVectors = (): SvgVectorElement[] => [];

const buildFlatLineNeckVectors = ({ halfSection, pos, stroke }: NeckRendererInput): SvgVectorElement[] => {
    const { topY, hubNeckRight } = pos;
    const boreMid = halfSection.boreWallX - 3;

    return [
        { kind: "line", layer: NECK_LAYER, role: "flatNeckLine", x1: boreMid, y1: topY, x2: hubNeckRight, y2: topY, stroke, strokeWidth: "1" },
    ];
};

const buildWeldingNeckVectors = ({ halfSection, pos, stroke }: NeckRendererInput): SvgVectorElement[] => {
    const { topY, hubNeckRight, boreRight } = pos;
    const { boreWallX, neckBoreWallX, neckTopY: sectionNeckTopY } = halfSection;
    const boreMid = boreWallX - 3;
    const junctionY1 = sectionNeckTopY + 6;
    const junctionY2 = sectionNeckTopY + 4;
    const rightContour = `M${hubNeckRight},${topY} A3,3,0,0,1,${hubNeckRight - 3},${topY - 1.5} L${neckBoreWallX + 0.5},${junctionY1} A3,5,0,0,1,${neckBoreWallX},${junctionY2} L${neckBoreWallX},${sectionNeckTopY}`;

    return [
        { kind: "path", layer: NECK_LAYER, role: "neckFill", d: `${rightContour} L${boreRight},${sectionNeckTopY} L${boreRight},${topY} Z`, fill: SVG_VECTOR_FILLS.hatch, stroke: "none" },
        { kind: "path", layer: NECK_LAYER, role: "neckOuterContour", d: rightContour, fill: "none", stroke, strokeWidth: "1", strokeLinejoin: "round", strokeLinecap: "round" },
        { kind: "line", layer: NECK_LAYER, role: "neckTopBoreOpening", x1: boreMid, y1: sectionNeckTopY, x2: boreRight, y2: sectionNeckTopY, stroke, strokeWidth: "1" },
        { kind: "line", layer: NECK_LAYER, role: "neckTopEndFace", x1: boreRight, y1: sectionNeckTopY, x2: neckBoreWallX, y2: sectionNeckTopY, stroke, strokeWidth: "1" },
        { kind: "line", layer: NECK_LAYER, role: "neckBoreWall", x1: boreRight, y1: sectionNeckTopY, x2: boreRight, y2: topY, stroke, strokeWidth: "1" },
    ];
};

export const buildFlangeNeckVectors = ({
    neckKind,
    halfSection,
    pos,
    stroke = SVG_VECTOR_COLORS.outline,
}: BuildFlangeNeckVectorsInput): SvgVectorElement[] => {
    const renderers = {
        none: buildNoNeckVectors,
        flatLine: buildFlatLineNeckVectors,
        weldingNeck: buildWeldingNeckVectors,
    } satisfies Record<(typeof NECK_RENDERER_KINDS)[number], (input: NeckRendererInput) => SvgVectorElement[]>;

    return renderers[neckKind ?? "none"]({ halfSection, pos, stroke });
};
