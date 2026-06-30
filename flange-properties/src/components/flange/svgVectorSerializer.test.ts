import test from "node:test";
import assert from "node:assert/strict";
import { serializeSvgVectorDocument } from "./engine/svgVectorSerializer.ts";
import {
    SVG_VECTOR_DOCUMENT_SCHEMA_VERSION,
    type SvgVectorDocument,
} from "./engine/index.ts";

const document: SvgVectorDocument = {
    schemaVersion: SVG_VECTOR_DOCUMENT_SCHEMA_VERSION,
    bounds: {
        minX: 10,
        minY: 20,
        width: 300,
        height: 140,
    },
    metadata: {
        shouldNotRender: true,
    },
    warnings: ["not serialized"],
    elements: [
        {
            kind: "line",
            layer: "dimension",
            role: "dimensionLine",
            x1: 1,
            y1: 2,
            x2: 30,
            y2: 4,
            stroke: "green",
            strokeWidth: "0.5",
            strokeDasharray: "2 1",
            markerStart: "url(#type01-arrowhead-green-rev)",
            markerEnd: "url(#type01-arrowhead-green)",
        },
        {
            kind: "rect",
            layer: "body",
            role: "hubFill",
            x: 5,
            y: 6,
            width: 20,
            height: 30,
            fill: "url(#type01-hatch)",
            stroke: "black",
            strokeWidth: 1,
        },
        {
            kind: "path",
            layer: "neck",
            role: "neckOuterContour",
            d: "M0 0 L10 10",
            fill: "none",
            stroke: "black",
            strokeWidth: "0.75",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            markerEnd: "url(#type01-arrowhead)",
            opacity: 0.8,
        },
        {
            kind: "text",
            layer: "fallback",
            role: "unsupportedMessage",
            x: 100,
            y: 120,
            text: "A&B <test>",
            fill: "rgb(34, 33, 33)",
            fontSize: "12",
            dominantBaseline: "middle",
            textAnchor: "middle",
        },
    ],
};

test("serializes a complete vector document with bounds and shared defs", () => {
    const svg = serializeSvgVectorDocument(document);

    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(svg, /viewBox="10 20 300 140"/);
    assert.match(svg, /preserveAspectRatio="xMinYMin meet"/);
    assert.match(svg, /<defs>/);
    assert.match(svg, /id="type01-hatch"/);
    assert.match(svg, /id="type01-arrowhead-green-rev"/);
    assert.match(svg, /<g>/);
    assert.match(svg, /<\/svg>$/);
});

test("serializes line, rect, path, and text vector elements", () => {
    const svg = serializeSvgVectorDocument(document);

    assert.match(svg, /<line x1="1" y1="2" x2="30" y2="4" stroke="green" stroke-width="0\.5" stroke-dasharray="2 1" marker-start="url\(#type01-arrowhead-green-rev\)" marker-end="url\(#type01-arrowhead-green\)" \/>/);
    assert.match(svg, /<rect x="5" y="6" width="20" height="30" fill="url\(#type01-hatch\)" stroke="black" stroke-width="1" \/>/);
    assert.match(svg, /<path d="M0 0 L10 10" fill="none" stroke="black" stroke-width="0\.75" stroke-linecap="round" stroke-linejoin="round" marker-end="url\(#type01-arrowhead\)" opacity="0\.8" \/>/);
    assert.match(svg, /<text x="100" y="120" fill="rgb\(34, 33, 33\)" font-size="12" dominant-baseline="middle" text-anchor="middle">A&amp;B &lt;test&gt;<\/text>/);
});

test("does not serialize semantic metadata or document warnings", () => {
    const svg = serializeSvgVectorDocument(document);

    assert.equal(svg.includes("shouldNotRender"), false);
    assert.equal(svg.includes("not serialized"), false);
    assert.equal(svg.includes("layer="), false);
    assert.equal(svg.includes("role="), false);
});
