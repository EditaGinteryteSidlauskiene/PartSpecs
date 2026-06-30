import type { SvgVectorDocument, SvgVectorElement } from "./svgVectorTypes.ts";
import { getSvgVectorDefsMarkup } from "./svgVectorDefinitions.ts";

const escapeAttribute = (value: string | number): string =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const escapeText = (value: string | number): string =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const attr = (name: string, value: string | number | undefined): string =>
    value === undefined ? "" : ` ${name}="${escapeAttribute(value)}"`;

const serializeVectorElement = (element: SvgVectorElement): string => {
    if (element.kind === "line") {
        return [
            "<line",
            attr("x1", element.x1),
            attr("y1", element.y1),
            attr("x2", element.x2),
            attr("y2", element.y2),
            attr("stroke", element.stroke),
            attr("stroke-width", element.strokeWidth),
            attr("stroke-dasharray", element.strokeDasharray),
            attr("marker-start", element.markerStart),
            attr("marker-end", element.markerEnd),
            " />",
        ].join("");
    }

    if (element.kind === "rect") {
        return [
            "<rect",
            attr("x", element.x),
            attr("y", element.y),
            attr("width", element.width),
            attr("height", element.height),
            attr("fill", element.fill),
            attr("stroke", element.stroke),
            attr("stroke-width", element.strokeWidth),
            " />",
        ].join("");
    }

    if (element.kind === "path") {
        return [
            "<path",
            attr("d", element.d),
            attr("fill", element.fill),
            attr("stroke", element.stroke),
            attr("stroke-width", element.strokeWidth),
            attr("stroke-linecap", element.strokeLinecap),
            attr("stroke-linejoin", element.strokeLinejoin),
            attr("marker-start", element.markerStart),
            attr("marker-end", element.markerEnd),
            attr("opacity", element.opacity),
            " />",
        ].join("");
    }

    return [
        "<text",
        attr("x", element.x),
        attr("y", element.y),
        attr("fill", element.fill),
        attr("font-size", element.fontSize),
        attr("dominant-baseline", element.dominantBaseline),
        attr("text-anchor", element.textAnchor),
        ">",
        escapeText(element.text),
        "</text>",
    ].join("");
};

export const serializeSvgVectorDocument = (document: SvgVectorDocument): string => {
    const { bounds } = document;

    return [
        '<svg xmlns="http://www.w3.org/2000/svg"',
        attr("viewBox", `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`),
        attr("preserveAspectRatio", "xMinYMin meet"),
        ">",
        getSvgVectorDefsMarkup(),
        "<g>",
        ...document.elements.map(serializeVectorElement),
        "</g>",
        "</svg>",
    ].join("");
};
