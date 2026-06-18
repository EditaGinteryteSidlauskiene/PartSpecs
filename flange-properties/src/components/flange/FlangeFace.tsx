type FlangeFaceProps = {
    face?: string | null;
    flangeType?: string;
};

export default function FlangeFace({ face, flangeType }: FlangeFaceProps) {
    const isType05 = flangeType === "05" || flangeType === "5";

    if (face === "A" || face === null) {
        return (
            <>
                <rect x="40" y="82" width="26" height="3" fill="url(#type01-hatch)" />
                <line x1="40" y1="85" x2="66" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="66" y1="85" x2="216" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <rect x="216" y="82" width="26" height="3" fill="url(#type01-hatch)" />
                <line x1="216" y1="85" x2="242" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            </>
        );
    }

    if (face === "B" || face === "E") {
        return (
            <>
                <rect x="40" y="85" width="26" height="3" fill="url(#type01-hatch)" />
                {isType05 && <rect x="66" y="85" width="150" height="3" fill="url(#type01-hatch)" />}
                <line x1="40" y1="85" x2="40" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="40" y1="88" x2="66" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                {!isType05 && <line x1="66" y1="85" x2="66" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />}
                <line x1="66" y1="88" x2="216" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                {!isType05 && <line x1="216" y1="85" x2="216" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />}
                <rect x="216" y="85" width="26" height="3" fill="url(#type01-hatch)" />
                <line x1="216" y1="88" x2="242" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="242" y1="85" x2="242" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            </>
        );
    }

    if (face === "C" || face === "F" || face === "G") {
        return (
            <>
                <rect x="45" y="85" width="15" height="3" fill="url(#type01-hatch)" />
                <line x1="40" y1="85" x2="45" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="45" y1="85" x2="45" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="45" y1="88" x2="60" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="60" y1="85" x2="60" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="60" y1="85" x2="222" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="222" y1="85" x2="222" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <rect x="222" y="85" width="15" height="3" fill="url(#type01-hatch)" />
                <line x1="222" y1="88" x2="237" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="237" y1="85" x2="237" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="237" y1="85" x2="242" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />

            </>
        );
    }

    if (face === "D") {
        return (
            <>
                <rect x="42" y="85" width="15" height="3" fill="url(#type01-hatch)" />
                <rect x="57" y="85" width="5" height="3" fill="url(#type01-hatch)" />
                {isType05 && <rect x="62" y="85" width="150" height="3" fill="url(#type01-hatch)" />}
                <line x1="40" y1="85" x2="42" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="42" y1="85" x2="42" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="42" y1="88" x2="50" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="50" y1="85" x2="50" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="50" y1="85" x2="57" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="57" y1="85" x2="57" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                {!isType05 && <line x1="66" y1="85" x2="66" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />}
                {!isType05 && <line x1="216" y1="85" x2="216" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />}
                <rect x="216" y="85" width="5" height="3" fill="url(#type01-hatch)" />
                <rect x="234" y="85" width="5" height="3" fill="url(#type01-hatch)" />

                <line x1="57" y1="88" x2="227" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="227" y1="85" x2="227" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="227" y1="85" x2="234" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="234" y1="85" x2="234" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="234" y1="88" x2="242" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="242" y1="85" x2="242" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            </>
        );
    }

    if (face === "H") {
        return (
            <>
                <rect x="42" y="82" width="15" height="3" fill="url(#type01-hatch)" />
                <rect x="57" y="83" width="6" height="5" fill="url(#type01-hatch)" />
                {isType05 && <rect x="62" y="85" width="150" height="3" fill="url(#type01-hatch)" />}
                <line x1="40" y1="85" x2="50" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="50" y1="85" x2="55" y2="83" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <path d="M55 83 A2 2 0 0 1 57 85" fill="none" stroke="rgb(34, 33, 33)" strokeWidth="1" />

                <line x1="57" y1="85" x2="57" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                {!isType05 && <line x1="66" y1="85" x2="66" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />}
                {!isType05 && <line x1="216" y1="85" x2="216" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />}

                <rect x="215" y="83" width="6" height="5" fill="url(#type01-hatch)" />

                <line x1="57" y1="88" x2="225" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="225" y1="85" x2="225" y2="88" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <path d="M225 85 A2 2 0 0 1 227 83" fill="none" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="227" y1="83" x2="232" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
                <line x1="232" y1="85" x2="242" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            </>
        );
    }

    return null;
}

