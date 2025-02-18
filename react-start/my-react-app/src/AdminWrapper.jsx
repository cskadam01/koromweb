import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminWrapper = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        console.log("Aktuális útvonal:", location.pathname);

        // Admin oldalak listája
        const adminRoutes = ["/admin", "/admin/megerosites", "/admin/naptar", "/admin/idopontok"];
        const isAdminRoute = adminRoutes.some((route) => location.pathname.startsWith(route));

        if (isAdminRoute) {
            console.log("Admin oldalon van, biztosan töröljük a `wasOnAdmin`-t.");
            localStorage.removeItem("wasOnAdmin"); // ✅ Ha admin oldalra lépsz, biztosan törli a `wasOnAdmin`-t
        } else {
            if (isAuthenticated) {
                console.log("Most hagyta el az admin oldalt, `wasOnAdmin = true`.");
                localStorage.setItem("wasOnAdmin", "true"); // ✅ Most már biztosan beállítja!
            }
        }

        // 🔴 Tokent és bejelentkezést CSAK akkor töröljük, ha voltunk admin oldalon és most már nem vagyunk ott
        const wasOnAdmin = localStorage.getItem("wasOnAdmin");
        if (!isAdminRoute && wasOnAdmin === "true") {
            console.log("Admin oldalt elhagyta, TÖRÖLJÜK A TOKEN-T ÉS wasOnAdmin-t!");
            localStorage.removeItem("token"); // ✅ Tokent töröljük
            localStorage.removeItem("wasOnAdmin"); // ✅ `wasOnAdmin` törlése
            logout(); // ✅ Kijelentkeztetjük a felhasználót
            navigate("/loginAdmin", { replace: true }); // ✅ Átirányítás a bejelentkezési oldalra
        }

        // ✅ Debugging információk a konzolhoz
        console.log("isAdminRoute:", isAdminRoute);
        console.log("wasOnAdmin:", localStorage.getItem("wasOnAdmin"));
        console.log("Token:", localStorage.getItem("token"));
        
    }, [location.pathname, isAuthenticated, logout, navigate]);

    return <>{children}</>;
};

export default AdminWrapper;
