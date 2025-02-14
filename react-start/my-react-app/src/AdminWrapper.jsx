import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminWrapper = ({ children }) => {
    const location = useLocation();
    const { token } = useAuth();

    useEffect(() => {
        console.log("Aktuális útvonal:", location.pathname);

        // Admin oldalak listája
        const adminRoutes = ["/admin", "/admin/megerosites", "/admin/naptar", "/admin/idopontok"];
        const isAdminRoute = adminRoutes.some((route) => location.pathname.startsWith(route));

        if (isAdminRoute) {
            console.log("Admin oldalon van.");
            localStorage.setItem("wasOnAdmin", "true");
        }
    }, [location.pathname, token]);

    return <>{children}</>; // Renderelje az alkalmazás tartalmát
};

export default AdminWrapper;
