import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminWrapper = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        console.log("Aktuális útvonal:", location.pathname);

        // Admin oldalak listája
        const adminRoutes = ["/admin", "/admin/megerosites"];
        const isAdminRoute = adminRoutes.some((route) => location.pathname.startsWith(route));

        // Ha épp admin oldalt hagy el a felhasználó, töröljük a tokent
        const wasOnAdmin = localStorage.getItem("wasOnAdmin"); // Tároljuk, hogy admin oldalon volt
        if (!isAdminRoute && wasOnAdmin) {
            console.log("Admin oldalt elhagyta, token törlés indítása...");
            localStorage.removeItem("token"); // Token törlése
            logout(); // Hitelesítési állapot reset
            localStorage.removeItem("wasOnAdmin"); // Állapot törlése
            navigate("/loginAdmin", { replace: true }); // Navigálás a login oldalra
        } else if (isAdminRoute) {
            console.log("Admin oldalon van.");
            localStorage.setItem("wasOnAdmin", "true"); // Beállítjuk, hogy admin oldalon van
        }
    }, [location.pathname, logout, navigate]);

    return <>{children}</>; // Renderelje az alkalmazás tartalmát
};

export default AdminWrapper;

