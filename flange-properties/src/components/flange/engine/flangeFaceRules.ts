import { FACE_RENDERING_MODES, type FaceRenderingMode } from "./flangeRendererKeys.ts";

export const FACE_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

export { FACE_RENDERING_MODES };
export type FlangeFaceRenderingMode = FaceRenderingMode;

export type FaceDimensionGroupKey = "face";

export type FlangeFaceState = {
    isNoFace: boolean;
    isValidFaceLetter: boolean;
    isFaceA: boolean;
    renderingMode: FlangeFaceRenderingMode;
    dimensionGroups: FaceDimensionGroupKey[];
    showsF1: boolean;
    showsD1: boolean;
    showsF2: boolean;
};

const FACE_RULES: Record<string, Omit<FlangeFaceState, "isNoFace" | "isValidFaceLetter" | "isFaceA">> = {
    A: { renderingMode: "flatFace", dimensionGroups: ["face"], showsF1: false, showsD1: false, showsF2: false },
    B: { renderingMode: "raisedFace", dimensionGroups: ["face"], showsF1: true, showsD1: true, showsF2: false },
    C: { renderingMode: "grooveFace", dimensionGroups: ["face"], showsF1: false, showsD1: false, showsF2: true },
    D: { renderingMode: "steppedFace", dimensionGroups: ["face"], showsF1: true, showsD1: false, showsF2: false },
    E: { renderingMode: "raisedFace", dimensionGroups: ["face"], showsF1: false, showsD1: false, showsF2: true },
    F: { renderingMode: "grooveFace", dimensionGroups: ["face"], showsF1: true, showsD1: false, showsF2: false },
    G: { renderingMode: "grooveFace", dimensionGroups: ["face"], showsF1: true, showsD1: true, showsF2: true },
    H: { renderingMode: "ringJointFace", dimensionGroups: ["face"], showsF1: false, showsD1: false, showsF2: false },
};

export const isValidFaceLetter = (face?: string | null): boolean =>
    !!face && FACE_LETTERS.includes(face.toUpperCase() as (typeof FACE_LETTERS)[number]);

export const getFlangeFaceState = (face?: string | null): FlangeFaceState => {
    const normalizedFace = face?.toUpperCase() ?? null;

    if (!normalizedFace) {
        return {
            isNoFace: true,
            isValidFaceLetter: false,
            isFaceA: false,
            renderingMode: "noFace",
            dimensionGroups: [],
            showsF1: false,
            showsD1: false,
            showsF2: false,
        };
    }

    const rule = FACE_RULES[normalizedFace] ?? { showsF1: false, showsD1: false, showsF2: false };

    return {
        isNoFace: false,
        isValidFaceLetter: FACE_LETTERS.includes(normalizedFace as (typeof FACE_LETTERS)[number]),
        isFaceA: normalizedFace === "A",
        ...rule,
    };
};

export const getFlangeFaceRenderingMode = (face?: string | null): FlangeFaceRenderingMode =>
    getFlangeFaceState(face).renderingMode;
