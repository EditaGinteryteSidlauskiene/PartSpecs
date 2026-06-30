import test from "node:test";
import assert from "node:assert/strict";
import {
    getSvgVectorDefsMarkup,
    SVG_VECTOR_COLORS,
    SVG_VECTOR_FILLS,
    SVG_VECTOR_IDS,
    SVG_VECTOR_MARKERS,
} from "./engine/svgVectorDefinitions.ts";

test("shared vector definitions expose stable ids, colors, fills, and marker urls", () => {
    assert.equal(SVG_VECTOR_IDS.hatchPattern, "type01-hatch");
    assert.equal(SVG_VECTOR_IDS.dimensionArrowheadReversed, "type01-arrowhead-green-rev");
    assert.equal(SVG_VECTOR_COLORS.outline, "rgb(34, 33, 33)");
    assert.equal(SVG_VECTOR_COLORS.dimension, "rgb(24, 93, 44)");
    assert.equal(SVG_VECTOR_FILLS.hatch, "url(#type01-hatch)");
    assert.equal(SVG_VECTOR_MARKERS.dimensionArrowhead, "url(#type01-arrowhead-green)");
    assert.equal(SVG_VECTOR_MARKERS.dimensionArrowheadReversed, "url(#type01-arrowhead-green-rev)");
});

test("shared vector defs markup contains hatch and arrow marker definitions", () => {
    const defs = getSvgVectorDefsMarkup();

    assert.match(defs, /^<defs>/);
    assert.match(defs, /id="type01-hatch"/);
    assert.match(defs, /stroke="rgb\(34, 33, 33\)"/);
    assert.match(defs, /id="type01-arrowhead"/);
    assert.match(defs, /id="type01-arrowhead-green"/);
    assert.match(defs, /fill="rgb\(24, 93, 44\)"/);
    assert.match(defs, /<\/defs>$/);
});
