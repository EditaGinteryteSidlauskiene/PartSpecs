export type CountDto = {
    value?: number;
    instruction?: string;
};

export type MeasureDto = {
    value?: number;
    instruction?: string;
    measureType?: string;
};

export type FlangeMeasures = Record<string, MeasureDto>;

export type FlangeLookupResponse = {
    count?: CountDto;
    boltSize?: string;
    measures: FlangeMeasures;
};

const formatInstruction = (instruction: string): string =>
    instruction
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .trim();

export function getMeasureValue(measures: FlangeMeasures | undefined, ...keys: string[]): string | number {
    if (!measures) {
        return "-";
    }

    for (const key of keys) {
        const byExactKey = measures[key]?.value;
        if (byExactKey !== undefined && byExactKey !== null) {
            return byExactKey;
        }

        const byLowerKey = measures[key.toLowerCase()]?.value;
        if (byLowerKey !== undefined && byLowerKey !== null) {
            return byLowerKey;
        }
    }

    return "-";
}

export function getNumericMeasureValue(measures: FlangeMeasures | undefined, ...keys: string[]): number | null {
    if (!measures) {
        return null;
    }

    for (const key of keys) {
        const exact = measures[key]?.value;
        if (exact !== undefined && exact !== null) {
            return exact;
        }

        const lower = measures[key.toLowerCase()]?.value;
        if (lower !== undefined && lower !== null) {
            return lower;
        }
    }

    return null;
}

export function getMeasureValueOrInstruction(measures: FlangeMeasures | undefined, ...keys: string[]): string | number {
    if (!measures) {
        return "-";
    }

    for (const key of keys) {
        const exact = measures[key];
        if (exact?.value !== undefined && exact.value !== null) {
            return exact.value;
        }
        if (exact?.instruction) {
            return formatInstruction(exact.instruction);
        }

        const lower = measures[key.toLowerCase()];
        if (lower?.value !== undefined && lower.value !== null) {
            return lower.value;
        }
        if (lower?.instruction) {
            return formatInstruction(lower.instruction);
        }
    }

    return "-";
}
