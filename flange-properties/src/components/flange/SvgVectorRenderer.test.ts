import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SvgVectorRenderer from "./SvgVectorRenderer.tsx";
import type { SvgVectorElement } from "./engine/svgVectorTypes.ts";

test("renders dimension-ready line markers and text vectors", () => {
    const elements: SvgVectorElement[] = [
        {
            kind: "line",
            layer: "dimension",
            role: "dimensionArrow",
            x1: 1,
            y1: 2,
            x2: 20,
            y2: 2,
            stroke: "green",
            strokeWidth: "0.5",
            markerStart: "url(#arrow-start)",
            markerEnd: "url(#arrow-end)",
        },
        {
            kind: "text",
            layer: "dimension",
            role: "dimensionLabel",
            x: 10,
            y: 12,
            text: "D",
            textAnchor: "middle",
            dominantBaseline: "middle",
            fontSize: "8",
            fill: "green",
        },
    ];

    const markup = renderToStaticMarkup(createElement("svg", null, createElement(SvgVectorRenderer, { elements })));

    assert.match(markup, /marker-start="url\(#arrow-start\)"/);
    assert.match(markup, /marker-end="url\(#arrow-end\)"/);
    assert.match(markup, /text-anchor="middle"/);
    assert.match(markup, /dominant-baseline="middle"/);
    assert.match(markup, />D<\/text>/);
    assert.equal(markup.includes("layer="), false);
    assert.equal(markup.includes("role="), false);
});

test("renders path marker support without leaking semantic metadata", () => {
    const elements: SvgVectorElement[] = [
        {
            kind: "path",
            layer: "dimension",
            role: "leader",
            d: "M0 0 L10 10",
            fill: "none",
            stroke: "green",
            strokeWidth: "0.5",
            markerEnd: "url(#arrow-end)",
        },
    ];

    const markup = renderToStaticMarkup(createElement("svg", null, createElement(SvgVectorRenderer, { elements })));

    assert.match(markup, /<path/);
    assert.match(markup, /marker-end="url\(#arrow-end\)"/);
    assert.equal(markup.includes("layer="), false);
    assert.equal(markup.includes("role="), false);
});
