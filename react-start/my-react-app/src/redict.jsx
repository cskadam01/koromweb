import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return null; // 🔄 Várunk, amíg az állapot betöltődik
    }

    if (isAuthenticated) {
        return <Navigate to="/admin" />;
    }

    return children;
};

export default RedirectIfAuthenticated;
