import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return null; // 🔄 Várunk, amíg az állapot betöltődik
    }

    if (!isAuthenticated) {
        console.log("Token hiányzik, visszadob a loginAdmin-ra...");
        return <Navigate to="/loginAdmin" replace />;
    }

    return children;
};

export default ProtectedRoute;
