import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';

export default function Sidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992) {
                setIsMobileOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className={`sidebar ${isMobileOpen ? 'sidebar-open' : ''}`} id="offcanvas" aria-labelledby="offcanvasLabel">
                <button
                    type="button"
                    className="sidebar-toggle"
                    aria-label="Toggle sidebar"
                    aria-expanded={isMobileOpen}
                    onClick={() => setIsMobileOpen((value) => !value)}
                >
                    <span className="sidebar-toggle-dash" aria-hidden="true" />
                </button>

                <div className="offcanvas-header">
                    <NavLink className="sidebar-title" id="offcanvasLabel" to="/">Flange Properties</NavLink>
                </div>
                <div className="offcanvas-body">
                    <ul className="sidebar-list">
                        <li><NavLink className='list-group-item a' to="/flanges" onClick={() => setIsMobileOpen(false)}>Flanges EN 1092-1</NavLink></li>
                        <li><NavLink className='list-group-item a' to="/settings" onClick={() => setIsMobileOpen(false)}>Settings</NavLink></li>
                    </ul>
                </div>
            </div>
        </>
    )
}