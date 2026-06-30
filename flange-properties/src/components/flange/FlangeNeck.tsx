import type { ReactNode } from "react";
import type { FlangeHalfSectionAnchors } from "./flangeDrawingModel";
import type { FlangePositions } from "./flangeGeometry";
import { NECK_RENDERER_KINDS } from "./flangeRendererKeys";
import type { FlangeTypeDefinition } from "./flangeTypes";

type FlangeNeckProps = {
    typeDefinition?: FlangeTypeDefinition;
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
};

type NeckRendererInput = {
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
    stroke: string;
};

const renderFlatLineNeck = ({ halfSection, pos, stroke }: NeckRendererInput) => {
    const { topY, hubNeckRight } = pos;
    const boreMid = halfSection.boreWallX - 3;

    return (
        <>
            <line x1={boreMid} y1={topY} x2={hubNeckRight} y2={topY} stroke={stroke} strokeWidth="1" />
        </>
    );
};

const renderWeldingNeck = ({ halfSection, pos, stroke }: NeckRendererInput) => {
    const { topY, hubNeckRight, boreRight } = pos;
    const { boreWallX, neckBoreWallX, neckTopY: sectionNeckTopY } = halfSection;
    const boreMid = boreWallX - 3;
    const junctionY1 = sectionNeckTopY + 6;
    const junctionY2 = sectionNeckTopY + 4;
    const rightContour = `M${hubNeckRight},${topY} A3,3,0,0,1,${hubNeckRight - 3},${topY - 1.5} L${neckBoreWallX + 0.5},${junctionY1} A3,5,0,0,1,${neckBoreWallX},${junctionY2} L${neckBoreWallX},${sectionNeckTopY}`;

    return (
        <>
            {/* Right neck fill */}
            <path d={`${rightContour} L${boreRight},${sectionNeckTopY} L${boreRight},${topY} Z`}
                fill="url(#type01-hatch)" stroke="none" />

            {/* Right side contour */}
            <path d={rightContour} fill="none" stroke={stroke} strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />

            {/* Top: bore opening from center to right + right end face (horizontal) */}
            <line x1={boreMid} y1={sectionNeckTopY} x2={boreRight} y2={sectionNeckTopY} stroke={stroke} strokeWidth="1" />
            <line x1={boreRight} y1={sectionNeckTopY} x2={neckBoreWallX} y2={sectionNeckTopY} stroke={stroke} strokeWidth="1" />

            {/* Right bore wall extension upward through the neck */}
            <line x1={boreRight} y1={sectionNeckTopY} x2={boreRight} y2={topY} stroke={stroke} strokeWidth="1" />
        </>
    );
};

const renderNeck = (neckKind: FlangeTypeDefinition["neckKind"] | undefined, input: NeckRendererInput) => {
    const renderers = {
        none: () => null,
        flatLine: renderFlatLineNeck,
        weldingNeck: renderWeldingNeck,
    } satisfies Record<(typeof NECK_RENDERER_KINDS)[number], (input: NeckRendererInput) => ReactNode>;

    return renderers[neckKind ?? "none"](input);
};

export default function FlangeNeck({ typeDefinition, halfSection, pos }: FlangeNeckProps) {
    return renderNeck(typeDefinition?.neckKind, {
        halfSection,
        pos,
        stroke: "rgb(34, 33, 33)",
    });
}
