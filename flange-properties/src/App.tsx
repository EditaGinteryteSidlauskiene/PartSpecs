import "./App.css";
import "./elements/flanges/displayFlange.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "./layout/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import FlangesPage from "./pages/FlangesPage";
import FlangeDrawingGallery from "./components/flange/FlangeDrawingGallery";

function App() {

  return (
    <>
      <BrowserRouter>
        <div className="container-fluid" style={{ padding: 0, margin: 0 }}>
          <div className="row app-layout-row" >
            <div className="col-auto sidebar-column" >
              <Sidebar />

            </div>
            <div className="col content-column">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/flanges" element={<FlangesPage />} />
                <Route path="/flange-drawing-gallery" element={<FlangeDrawingGallery />} />
              </Routes>


            </div>
          </div>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
