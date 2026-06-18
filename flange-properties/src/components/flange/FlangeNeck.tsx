type FlangeNeckProps = {
    flangeType?: string;
};

export default function FlangeNeck({ flangeType }: FlangeNeckProps) {
    if (flangeType === "01") {
        return (
            <>
                <line x1="52" y1="55" x2="228" y2="55" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            </>
        );
    }

    if (flangeType === "02") {
        return null;
    }

    if (flangeType === "04") {
        return null;
    }

    if (flangeType === "05") {
        return (
            <>
                <line x1="52" y1="55" x2="228" y2="55" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            </>
        );
    }

    if (flangeType === "11") {
        return (
            <>
                {/* Left neck fill */}
                <path d="M52,55 A3,3,0,0,1,55,52 L63,32 A4,4,0,0,1,64,30 L64,26 L66,26 L66,55 Z"
                    fill="url(#type01-hatch)" stroke="none" />
                {/* Right neck fill */}
                <path d="M228,55 A3,3,0,0,0,225,52 L219,32 A4,4,0,0,0,218,30 L218,26 L216,26 L216,55 Z"
                    fill="url(#type01-hatch)" stroke="none" />

                {/* Left side: arc, straight, arc, vertical */}
                <path d="M52,55 A3,3 0 0 0 55,52" fill="none" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="55" y1="52" x2="63" y2="32" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <path d="M63,32 A4,4 0 0 1 64,30" fill="none" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="64" y1="30" x2="64" y2="26" stroke="rgb(34, 33, 33)" strokeWidth="1" />

                {/* Right side: arc, straight, arc, vertical */}
                <path d="M228,55 A3,3 0 0 1 225,52" fill="none" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="225" y1="52" x2="219" y2="32" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <path d="M219,32 A4,4 0 0 0 218,30" fill="none" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="218" y1="30" x2="218" y2="26" stroke="rgb(34, 33, 33)" strokeWidth="1" />

                {/* Top: left end face + bore opening + right end face (horizontal) */}
                <line x1="64" y1="26" x2="66" y2="26" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="66" y1="26" x2="216" y2="26" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="216" y1="26" x2="218" y2="26" stroke="rgb(34, 33, 33)" strokeWidth="1" />

                {/* Bore wall extensions upward through the neck */}
                <line x1="66" y1="26" x2="66" y2="55" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="216" y1="26" x2="216" y2="55" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            </>
        );
    }

    if (flangeType === "12") {
        return null;
    }

    if (flangeType === "13") {
        return null;
    }

    if (flangeType === "21") {
        return null;
    }

    if (flangeType === "32") {
        return null;
    }

    if (flangeType === "33") {
        return null;
    }

    if (flangeType === "34") {
        return null;
    }

    if (flangeType === "35") {
        return null;
    }

    if (flangeType === "36") {
        return null;
    }

    if (flangeType === "37") {
        return null;
    }

    return null;
}
