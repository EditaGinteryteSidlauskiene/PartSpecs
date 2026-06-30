export const BODY_RENDERER_KINDS = ["standardHalfBody", "blindHalfBody"] as const;
export type BodyRendererKind = (typeof BODY_RENDERER_KINDS)[number];

export const NECK_RENDERER_KINDS = ["none", "flatLine", "weldingNeck"] as const;
export type NeckRendererKind = (typeof NECK_RENDERER_KINDS)[number];

export const FACE_RENDERING_MODES = ["noFace", "flatFace", "raisedFace", "grooveFace", "steppedFace", "ringJointFace"] as const;
export type FaceRenderingMode = (typeof FACE_RENDERING_MODES)[number];

export const DIMENSION_GROUP_RENDERER_KEYS = ["common", "type11", "face"] as const;
export type DimensionGroupRendererKey = (typeof DIMENSION_GROUP_RENDERER_KEYS)[number];
