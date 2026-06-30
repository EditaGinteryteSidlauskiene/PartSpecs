import type { FlangeHalfSectionAnchors } from "./flangeDrawingModel";
import type { FlangeFaceState } from "./flangeFaceRules";
import type { FlangePositions } from "./flangeGeometry";
import { buildFlangeBodyVectors } from "./flangeBodyVectors";
import { buildFlangeFaceVectors } from "./flangeFaceVectors";
import { buildFlangeNeckVectors } from "./flangeNeckVectors";
import type { FlangeTypeDefinition } from "./flangeTypes";
import type { SvgVectorElement } from "./svgVectorTypes";

type BuildFlangeShapeVectorsInput = {
    typeDefinition?: FlangeTypeDefinition;
    faceState: FlangeFaceState;
    halfSection: FlangeHalfSectionAnchors;
    pos: FlangePositions;
};

export const buildFlangeShapeVectors = ({
    typeDefinition,
    faceState,
    halfSection,
    pos,
}: BuildFlangeShapeVectorsInput): SvgVectorElement[] => [
    ...buildFlangeNeckVectors({
        neckKind: typeDefinition?.neckKind,
        halfSection,
        pos,
    }),
    ...buildFlangeBodyVectors({
        bodyKind: typeDefinition?.bodyKind ?? "standardHalfBody",
        lightningStart: typeDefinition?.lightningStart ?? "topY",
        halfSection,
    }),
    ...buildFlangeFaceVectors({
        renderingMode: faceState.renderingMode,
        halfSection,
        pos,
        usesBlindBodyFaceFill: typeDefinition?.bodyKind === "blindHalfBody",
    }),
];
