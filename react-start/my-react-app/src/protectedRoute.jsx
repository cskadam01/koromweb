import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Ellenőrzi a tokent a localStorage-ban

    if (!token) {
        console.log("Token hiányzik, átirányítás a login oldalra...");
        return <Navigate to="/loginAdmin" replace />;
    }

    console.log("Token érvényes, hozzáférés engedélyezve.");
    return children;
};

export default ProtectedRoute;

