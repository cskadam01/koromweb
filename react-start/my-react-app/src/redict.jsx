import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        // Ha a felhasználó már be van jelentkezve, átirányítjuk az admin oldalra
        return <Navigate to="/admin" />;
    }

    // Ha nincs bejelentkezve, megjelenítjük az eredeti komponenst
    return children;
};

export default RedirectIfAuthenticated;
