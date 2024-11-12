import React, { useState } from "react";
import "./loginAdmin.css";

function LoginAdmin() {
    // Állapotok létrehozása a felhasználónév és az eredmény szöveg tárolására
    const [username, setUsername] = useState("");
    const [displayText, setDisplayText] = useState("asdasd");

    // Eseménykezelő a gomb megnyomására
    const handleButtonClick = () => {
        setDisplayText(username); // Az eredmény szöveget beállítjuk a megadott felhasználónévre
    };

    return (
        <div className="login-box">
            <h2>Login</h2>
            <form>
                <div className="user-box">
                    <input type="text" required id="user_name" value={username} onChange={(e) => setUsername(e.target.value)} // Az állapot frissítése gépelés közben
                    />
                    <label>Felhasználónév</label>
                </div>
                <div className="user-box">
                    <input type="password" required />
                    <label>Jelszó</label>
                </div>
            </form>
            <button id="gomb" onClick={handleButtonClick}>
                Bejelentkezés
            </button>
            <p id="teszt">{displayText}</p>
        </div>
    );
}

export default LoginAdmin;
