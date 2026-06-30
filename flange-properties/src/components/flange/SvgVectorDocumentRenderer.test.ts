import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SvgVectorDocumentRenderer from "./SvgVectorDocumentRenderer.tsx";
import {
    SVG_VECTOR_DOCUMENT_SCHEMA_VERSION,
    type SvgVectorDocument,
} from "./engine/index.ts";

test("renders a complete vector document SVG with bounds, defs, and elements", () => {
    const document: SvgVectorDocument = {
        schemaVersion: SVG_VECTOR_DOCUMENT_SCHEMA_VERSION,
        bounds: {
            minX: 10,
            minY: 20,
            width: 200,
            height: 100,
        },
        metadata: {
            label: "test",
        },
        warnings: ["not rendered"],
        elements: [
            {
                kind: "text",
                layer: "fallback",
                role: "unsupportedMessage",
                x: 110,
                y: 70,
                text: "Drawing not implemented",
                textAnchor: "middle",
                dominantBaseline: "middle",
                fill: "rgb(34, 33, 33)",
                fontSize: "12",
            },
        ],
    };

    const markup = renderToStaticMarkup(createElement(SvgVectorDocumentRenderer, {
        document,
        className: "lookup-drawing-svg",
        role: "img",
        "aria-label": "Test vector drawing",
    }));

    assert.match(markup, /<svg/);
    assert.match(markup, /class="lookup-drawing-svg"/);
    assert.match(markup, /viewBox="10 20 200 100"/);
    assert.match(markup, /aria-label="Test vector drawing"/);
    assert.match(markup, /id="type01-hatch"/);
    assert.match(markup, /id="type01-arrowhead-green-rev"/);
    assert.match(markup, />Drawing not implemented<\/text>/);
    assert.equal(markup.includes("metadata"), false);
    assert.equal(markup.includes("warnings"), false);
    assert.equal(markup.includes("layer="), false);
    assert.equal(markup.includes("role=\"unsupportedMessage\""), false);
});
