export const normalizeFlangeType = (flangeType?: string): string | undefined => {
    if (!flangeType || !/^\d{1,2}$/.test(flangeType)) {
        return flangeType;
    }

    return flangeType.padStart(2, "0");
};

export const isFlangeType01 = (flangeType?: string): boolean => flangeType === "01";

export const isFlangeType05 = (flangeType?: string): boolean => flangeType === "05";

export const isFlangeType11 = (flangeType?: string): boolean => flangeType === "11";

export const isFlatFlangeType = (flangeType?: string): boolean =>
    isFlangeType01(flangeType) || isFlangeType05(flangeType);
