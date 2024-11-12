import Navbar from "./navbar/navbar";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
    const location = useLocation();

    // Ellenőrzi, hogy nem a /loginAdmin oldalon vagyunk-e
    const showNavbar = location.pathname !== '/loginAdmin';

    return (
        <>
            {showNavbar && <Navbar />}
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;
