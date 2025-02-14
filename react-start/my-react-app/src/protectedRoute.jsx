import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        setIsLoading(false); // Token ellenőrzés befejeződött
    }, []);

    if (isLoading) {
        return null; // Várunk, amíg a token ellenőrződik
    }

    if (!token) {
        console.log("Nincs token, visszadob a loginAdmin-ra...");
        return <Navigate to="/loginAdmin" replace />;
    }

    console.log("Token érvényes, hozzáférés engedélyezve.");
    return children;
};

export default ProtectedRoute;
