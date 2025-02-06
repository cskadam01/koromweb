import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './AuthContext'; // Hozzáadjuk az AuthProvider-t

const rootElement = document.getElementById('root');

if (!rootElement._reactRootContainer) {
    const root = createRoot(rootElement); // Csak egyszer inicializáljuk
    root.render(
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    );
}
