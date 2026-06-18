import "./FlangesPage.css";
import FlangeMeasureLookup from "../components/flange/flangeMeasureLookup"

export default function FlangesPage() {

    return (
        <div className="flanges-page">
            <h2 className="flanges-page-title">Flange Lookup</h2>

            <FlangeMeasureLookup />

        </div>
    )
}