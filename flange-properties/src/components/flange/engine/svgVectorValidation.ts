import {
    SVG_VECTOR_DOCUMENT_SCHEMA_VERSION,
    type SvgVectorDocument,
} from "./svgVectorTypes.ts";

export type SvgVectorDocumentValidationResult = {
    isValid: boolean;
    errors: string[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value);

const isValidTextValue = (value: unknown): value is string | number =>
    typeof value === "string" || isFiniteNumber(value);

const validateBounds = (document: Record<string, unknown>, errors: string[]): void => {
    if (!isRecord(document.bounds)) {
        errors.push("bounds must be an object");
        return;
    }

    for (const key of ["minX", "minY", "width", "height"]) {
        if (!isFiniteNumber(document.bounds[key])) {
            errors.push(`bounds.${key} must be a finite number`);
        }
    }
};

const validateElement = (
    element: unknown,
    index: number,
    errors: string[]
): void => {
    if (!isRecord(element)) {
        errors.push(`elements[${index}] must be an object`);
        return;
    }

    if (element.kind === "line") {
        for (const key of ["x1", "y1", "x2", "y2"]) {
            if (!isFiniteNumber(element[key])) {
                errors.push(`elements[${index}].${key} must be a finite number`);
            }
        }
        return;
    }

    if (element.kind === "rect") {
        for (const key of ["x", "y", "width", "height"]) {
            if (!isFiniteNumber(element[key])) {
                errors.push(`elements[${index}].${key} must be a finite number`);
            }
        }
        return;
    }

    if (element.kind === "path") {
        if (typeof element.d !== "string" || element.d.length === 0) {
            errors.push(`elements[${index}].d must be a non-empty string`);
        }
        return;
    }

    if (element.kind === "text") {
        for (const key of ["x", "y"]) {
            if (!isFiniteNumber(element[key])) {
                errors.push(`elements[${index}].${key} must be a finite number`);
            }
        }

        if (!isValidTextValue(element.text)) {
            errors.push(`elements[${index}].text must be a string or finite number`);
        }
        return;
    }

    errors.push(`elements[${index}].kind is not supported`);
};

export const validateSvgVectorDocument = (document: unknown): SvgVectorDocumentValidationResult => {
    const errors: string[] = [];

    if (!isRecord(document)) {
        return {
            isValid: false,
            errors: ["document must be an object"],
        };
    }

    if (document.schemaVersion !== SVG_VECTOR_DOCUMENT_SCHEMA_VERSION) {
        errors.push(`schemaVersion must be ${SVG_VECTOR_DOCUMENT_SCHEMA_VERSION}`);
    }

    validateBounds(document, errors);

    if (!Array.isArray(document.elements)) {
        errors.push("elements must be an array");
    } else {
        document.elements.forEach((element, index) => validateElement(element, index, errors));
    }

    if (document.warnings !== undefined && !Array.isArray(document.warnings)) {
        errors.push("warnings must be an array when present");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const isSvgVectorDocument = (document: unknown): document is SvgVectorDocument =>
    validateSvgVectorDocument(document).isValid;
