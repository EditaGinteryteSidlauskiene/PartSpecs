import {
    buildFlangeDrawing,
    type FlangeDrawingModel,
    type FlangeLookupResponse,
} from "./engine/index";
import SvgVectorDocumentRenderer from "./SvgVectorDocumentRenderer";

type FlangeDrawingProps = {
    model: FlangeDrawingModel;
    response: FlangeLookupResponse;
    availableHeight?: number | null;
};

export default function FlangeDrawing({ model, response, availableHeight }: FlangeDrawingProps) {
    const svgStyle = availableHeight
        ? { height: `${Math.max(120, availableHeight - 24)}px`, width: "auto", maxWidth: "100%" }
        : undefined;
    const document = buildFlangeDrawing({
        flangeType: model.flangeType,
        face: model.face,
        response,
    });

    return (
        <SvgVectorDocumentRenderer
            document={document}
            className="lookup-drawing-svg"
            role="img"
            aria-label="Flange visualization"
            style={svgStyle}
        />
    );
}
