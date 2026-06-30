import type { SvgVectorElement } from "./engine/index";

type SvgVectorRendererProps = {
    elements: SvgVectorElement[];
};

export default function SvgVectorRenderer({ elements }: SvgVectorRendererProps) {
    return (
        <>
            {elements.map((element, index) => {
                if (element.kind === "line") {
                    const { kind, layer, role, ...props } = element;
                    return <line key={index} {...props} />;
                }

                if (element.kind === "rect") {
                    const { kind, layer, role, ...props } = element;
                    return <rect key={index} {...props} />;
                }

                if (element.kind === "text") {
                    const { kind, layer, role, text, ...props } = element;
                    return <text key={index} {...props}>{text}</text>;
                }

                const { kind, layer, role, ...props } = element;
                return <path key={index} {...props} />;
            })}
        </>
    );
}
