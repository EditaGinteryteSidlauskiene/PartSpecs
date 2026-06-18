type FlangeBodyProps = {
    flangeType?: string;
};

export default function FlangeBody({ flangeType }: FlangeBodyProps) {
    const isType05 = flangeType === "05";
    const boreFill = flangeType === "05" ? "url(#type01-hatch)" : "none";

    return (
        <>
            <rect x="1" y="55" width="10" height="30" fill="url(#type01-hatch)" />
            <line x1="1" y1="55" x2="11" y2="55" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="1" y1="55" x2="1" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="1" y1="85" x2="11" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <rect x="11" y="55" width="25" height="30" fill="none" />
            <line x1="11" y1="55" x2="36" y2="55" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="11" y1="55" x2="11" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="11" y1="85" x2="36" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="36" y1="55" x2="36" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="23.5" y1="53" x2="23.5" y2="85" stroke="rgb(100, 97, 97)" strokeWidth="0.75" strokeDasharray="8,3" />
            <rect x="36" y="55" width="30" height="30" fill="url(#type01-hatch)" />
            <line x1="36" y1="55" x2="40" y2="55" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="36" y1="55" x2="36" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="36" y1="85" x2="40" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="40" y1="55" x2="52" y2="55" stroke="rgb(34, 33, 33)" strokeWidth="1" />

            <rect x="216" y="55" width="30" height="30" fill="url(#type01-hatch)" />
            <line x1="228" y1="55" x2="242" y2="55" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="242" y1="55" x2="246" y2="55" stroke="rgb(34, 35, 35)" strokeWidth="1" />
            <line x1="246" y1="55" x2="246" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="242" y1="85" x2="246" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <rect x="246" y="55" width="25" height="30" fill="none" />
            <line x1="246" y1="55" x2="271" y2="55" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="246" y1="55" x2="246" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="246" y1="85" x2="271" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="271" y1="55" x2="271" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="258.5" y1="53" x2="258.5" y2="85" stroke="rgb(100, 97, 97)" strokeWidth="0.75" strokeDasharray="8,3" />
            <rect x="271" y="55" width="10" height="30" fill="url(#type01-hatch)" />
            <line x1="271" y1="55" x2="281" y2="55" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="271" y1="85" x2="281" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />
            <line x1="281" y1="55" x2="281" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />

            <rect x="66" y="55" width="150" height="30" fill={boreFill} />
            {!isType05 && <line x1="66" y1="55" x2="66" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />}
            {!isType05 && <line x1="216" y1="55" x2="216" y2="85" stroke="rgb(34, 33, 33)" strokeWidth="1" />}
        </>
    );
}
