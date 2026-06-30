import test from "node:test";
import assert from "node:assert/strict";
import {
    buildBoltHoleCalloutVectors,
    buildDiameterDimensionVectors,
    buildVerticalDimensionVectors,
} from "./engine/flangeDimensionVectors.ts";
import type { SvgVectorElement } from "./engine/svgVectorTypes.ts";

const byRole = (elements: SvgVectorElement[], role: string) => elements.filter((element) => element.role === role);
const firstLineByRole = (elements: SvgVectorElement[], role: string) => {
    const element = byRole(elements, role)[0];

    assert.equal(element?.kind, "line");
    return element;
};

test("diameter dimension vectors include text, diameter arrow, and optional extension line", () => {
    const elements = buildDiameterDimensionVectors({
        label: "D",
        centerX: 100,
        targetX: 160,
        y: 220,
        extensionX: 160,
        extensionY1: 100,
        extensionY2: 230,
        color: "green",
    });

    assert.equal(elements.every((element) => element.layer === "dimension"), true);
    assert.equal(byRole(elements, "dimensionText").length, 1);
    assert.equal(byRole(elements, "diameterLine").length, 1);
    assert.equal(byRole(elements, "extensionLine").length, 1);
    assert.equal(byRole(elements, "dimensionText")[0]?.kind, "text");
    assert.equal(firstLineByRole(elements, "diameterLine").markerEnd, "url(#type01-arrowhead-green)");
});

test("vertical dimension vectors include double-ended arrow and extension lines", () => {
    const elements = buildVerticalDimensionVectors({
        label: "C",
        x: 200,
        textX: 215,
        y1: 100,
        y2: 140,
        topExtensionX1: 170,
        bottomExtensionX1: 170,
        extensionX2: 210,
        color: "green",
    });

    assert.equal(elements.every((element) => element.layer === "dimension"), true);
    assert.equal(byRole(elements, "dimensionText").length, 1);
    assert.equal(byRole(elements, "verticalDimensionLine").length, 1);
    assert.equal(byRole(elements, "extensionLine").length, 2);
    const verticalLine = firstLineByRole(elements, "verticalDimensionLine");

    assert.equal(verticalLine.markerStart, "url(#type01-arrowhead-green-rev)");
    assert.equal(verticalLine.markerEnd, "url(#type01-arrowhead-green)");
});

test("bolt-hole callout vectors include two labels, extension lines, and arrow lines", () => {
    const elements = buildBoltHoleCalloutVectors({
        countAndDiameterLabel: "4 x 18",
        boltSizeLabel: "M16",
        textX: 120,
        textY: 150,
        sizeTextY: 162,
        leftExtensionX: 80,
        rightExtensionX: 160,
        extensionY1: 100,
        extensionY2: 170,
        leftArrowStartX: 60,
        rightArrowStartX: 180,
        arrowY: 145,
        color: "green",
    });

    assert.equal(elements.every((element) => element.layer === "dimension"), true);
    assert.equal(byRole(elements, "dimensionText").length, 2);
    assert.equal(byRole(elements, "extensionLine").length, 2);
    assert.equal(byRole(elements, "arrowLine").length, 2);
    assert.equal(byRole(elements, "arrowLine").every((element) => element.kind === "line" && element.markerEnd === "url(#type01-arrowhead-green)"), true);
});
