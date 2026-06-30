type BuildFlangeSvgFilenameInput = {
    flangeType: string;
    dn?: string;
    pn?: string;
    face?: string | null;
};

const formatExportPart = (value: string): string =>
    value.trim().toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");

export const buildFlangeSvgFilename = ({
    flangeType,
    dn,
    pn,
    face,
}: BuildFlangeSvgFilenameInput): string => {
    const parts = [
        "flange",
        "type",
        formatExportPart(flangeType),
    ];

    if (dn) {
        parts.push("dn", formatExportPart(dn));
    }

    if (pn) {
        parts.push("pn", formatExportPart(pn));
    }

    parts.push(face ? `face-${formatExportPart(face)}` : "no-face");

    return `${parts.join("-")}.svg`;
};
