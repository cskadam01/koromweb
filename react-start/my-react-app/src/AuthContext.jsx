import React, { createContext, useContext, useState } from "react";

// Kontextus létrehozása
const AuthContext = createContext();

// AuthProvider komponens
export const AuthProvider = ({ children }) => {
    // Hitelesítési állapot kezelése
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Login metódus
    const login = () => {
        console.log("Bejelentkezés...");
        setIsAuthenticated(true);
    };

    // Logout metódus
    const logout = () => {
        console.log("Kijelentkezés...");
        setIsAuthenticated(false);
    };

    // AuthContext értékek biztosítása a gyerek komponenseknek
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth hook a kontextus használatához
export const useAuth = () => useContext(AuthContext);


