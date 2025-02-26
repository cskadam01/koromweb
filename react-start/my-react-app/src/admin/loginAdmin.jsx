import React, { useState } from "react";
import "./loginAdmin.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../AuthContext";

function LoginAdmin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post("http://zsukoromtest.duckdns.org:5000/api/login", {
                username: username.trim(),
                password: password
            });

            if (response.data.success) {
                const token = response.data.token;
                localStorage.setItem('token', token); // Token mentése
                login(); // Hitelesítési állapot frissítése
                navigate('/admin'); // Navigálás az admin oldalra
            } else {
                setErrorMessage(response.data.message || "Ismeretlen hiba.");
            }
        } catch (error) {
            setErrorMessage("Hiba történt a bejelentkezés során. Próbáld újra.");
        }
    };

    return (
        <div className="login-box">
            <h2>Bejelentkezés</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleLogin}>
                <div className="user-box">
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Felhasználónév</label>
                </div>
                <div className="user-box">
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Jelszó</label>
                </div>
                <button type="submit">
                    Bejelentkezés
                </button>
            </form>
        </div>
    );
}

export default LoginAdmin;
