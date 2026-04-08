import type Flange from "./flange";

export default function DisplayFlange(props: DisplayFlangeProps) {

    return (
        <div className="flange-card">
            <p className="flange-title">
                {props.flange.name}<br />
            </p>
            <div className="flange-content">
                <img src={props.flange.imageUrl} alt={props.flange.name} />

                <table className="flange-info flange-table">
                    <thead>
                        <tr>
                            <th className="flange-th" scope="col">Material:</th>
                            <th className="flange-th" scope="col">Diameter:</th>
                            <th className="flange-th" scope="col">Thickness:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="flange-td">{props.flange.properties.material}</td>
                            <td className="flange-td">{props.flange.properties.diameter} mm</td>
                            <td className="flange-td">{props.flange.properties.thickness} mm</td>
                        </tr>
                    </tbody>

                </table>
            </div>

        </div>
    )
}

interface DisplayFlangeProps {
    flange: Flange;
}