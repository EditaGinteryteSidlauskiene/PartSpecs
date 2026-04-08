import DisplayFlange from "../elements/flanges/displayFlange"
import type Flange from "../elements/flanges/flange"

export default function FlangesPage() {

    const flange: Flange = {
        id: 1,
        name: "Flange 1",
        imageUrl: "https://savree-storage.s3.amazonaws.com/Articles/optimised/Exploded%20Flange%20Installation.png",
        properties: {
            diameter: 100,
            thickness: 10,
            material: "Steel"
        }
    }

    return (
        <div>
            <h1>Search for Flanges</h1>

            <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success" type="submit">Search</button>
            </form>

            <div>
                <DisplayFlange flange={flange} />
            </div>

            <div>
                <DisplayFlange flange={flange} />
            </div>

            <div>
                <DisplayFlange flange={flange} />
            </div>
        </div>
    )
}