import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';
import { NavLink } from 'react-router';

export default function Sidebar() {
    return (
        <>
            <div className="sidebar" id="offcanvas" aria-labelledby="offcanvasLabel">
                <div className="offcanvas-header">
                    <NavLink className="sidebar-title" id="offcanvasLabel" to="/">Flange Properties</NavLink>
                </div>
                <div className="offcanvas-body">
                    <ul className="sidebar-list">
                        <li><NavLink className='list-group-item a' to="/flanges">Flanges</NavLink></li>
                        <li><NavLink className='list-group-item a' to="/settings">Settings</NavLink></li>
                    </ul>
                </div>
            </div>
        </>
    )
}