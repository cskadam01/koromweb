import DefaultNavbar from "./navbar/navbar"; // Alapértelmezett navbar
import AdminNavbar from "./admin/admin_sites/balnav/balnav"; // Egyedi admin navbar
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
    const location = useLocation();

    // Útvonalak, ahol nincs navbar
    const hideNavbarPaths = ['/loginadmin', '/admin', '/megerosites','naptar'];

    // Útvonalak, ahol az admin navbar jelenjen meg
    const adminNavbarPaths = ['/admin',  '/megerosites', '/naptar'];

    // Döntés arról, hogy melyik navbar jelenjen meg
    const showNavbar = !hideNavbarPaths.some((path) => location.pathname.toLowerCase().includes(path));
    const showAdminNavbar = adminNavbarPaths.some((path) => location.pathname.toLowerCase().includes(path));

    return (
        <>
            {/* Feltételes navbar renderelés */}
            {showNavbar && !showAdminNavbar && <DefaultNavbar />}
            {showAdminNavbar && <AdminNavbar />}
            
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;

