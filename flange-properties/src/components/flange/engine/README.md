# Flange Drawing Engine

This folder contains the pure, non-React flange drawing engine. It turns flange lookup data into a serializable vector drawing document that can be rendered by React, exported as SVG text, saved, or passed to another renderer.

The engine processes input in memory. It does not automatically store user input, API responses, drawing documents, or exported SVG files. Data is only persisted if some caller explicitly saves, downloads, uploads, or otherwise stores it.

## Boundary

Use `engine/index.ts` as the public API. React components and app UI should import from this barrel instead of importing engine internals directly.

React/UI files live outside this folder and handle browser concerns such as buttons, layout, SVG rendering, and file downloads. Engine files stay pure TypeScript and do not import React, DOM APIs, or `.tsx` files.

## Pipeline

```text
raw input -> model -> vector document -> React SVG render or SVG string export
```

The main steps are:

1. Raw input: flange type, face value, and `FlangeLookupResponse`.
2. Model: `createFlangeDrawingModel(...)` resolves flange type definitions, face rules, geometry anchors, bounds, rails, and validation warnings.
3. Vector document: `buildFlangeDrawing(...)` creates a complete `FlangeDrawingVectorDocument`.
4. Output:
   - React UI renders the document with `SvgVectorDocumentRenderer`.
   - SVG export serializes the document with `serializeFlangeDrawing(...)`.

## Public API

Import from the barrel:

```ts
import {
    buildFlangeDrawing,
    serializeFlangeDrawing,
    validateSvgVectorDocument,
    type FlangeLookupResponse,
} from "./engine/index";
```

Example:

```ts
const response: FlangeLookupResponse = {
    count: { value: 8 },
    boltSize: "M20",
    measures: {
        D: { value: 220 },
        K: { value: 180 },
        L: { value: 22 },
        C2: { value: 24 },
        A: { value: 100 },
        S: { value: 8 },
        R1: { value: 6 },
        H3: { value: 12 },
        N1: { value: 128 },
        H2: { value: 100 },
    },
};

const document = buildFlangeDrawing({
    flangeType: "11",
    face: "B",
    response,
});

const validation = validateSvgVectorDocument(document);
const svgText = serializeFlangeDrawing({
    flangeType: "11",
    face: "B",
    response,
});
```

## Vector Document

A generated document is plain JSON-safe data:

```ts
{
    schemaVersion: "1.0",
    bounds,
    elements,
    metadata,
    warnings
}
```

`elements` contains vector primitives such as `line`, `rect`, `path`, and `text`. Elements may include semantic metadata like `layer` and `role` for tests/debugging, but that metadata is not emitted into SVG markup.

`warnings` is used for controlled drawing issues, such as required measures missing from the lookup response. The drawing can still render with fallback values, but the caller can show the warning near the drawing.

## Validation

`validateSvgVectorDocument(...)` checks that a document has:

- supported `schemaVersion`
- valid bounds
- an elements array
- supported element kinds
- required fields for each element kind

Use it before rendering or exporting a document that has been parsed from JSON or received from another system.

## SVG Export

`serializeFlangeDrawing(...)` is the high-level export path. It builds the model, creates the vector document, and serializes it to SVG text without reading from the DOM.

Browser download behavior is intentionally outside the engine. The UI calls the engine to get SVG text, then passes that text to a browser helper such as `downloadSvgFile(...)`.

## Adding Or Modifying Flange Types

Flange type behavior is centralized in `flangeTypes.ts`.

To add or change a type:

1. Update the type definition or preset.
2. Set body/neck render modes, dimension groups, measure keys, support status, scale/top-offset behavior, and bore/neck metadata there.
3. Add or update tests for the definition and drawing model.
4. Add a new vector renderer mode only if the existing body, neck, face, or dimension modes cannot express the shape.

Avoid adding raw checks such as `flangeType === "11"` in renderers or UI. Prefer definition metadata.

## Adding Or Modifying Face Rules

Face behavior is centralized in `flangeFaceRules.ts`.

To change a face:

1. Update its face rule: rendering mode, dimension groups, and F1/F2/D1 visibility.
2. Add or update face rule tests.
3. Add a new face vector mode only if the existing modes cannot express the shape.

Avoid duplicating checks like `face === "B" || face === "E"` outside the face rules.
