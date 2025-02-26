import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "../kepzes_styles/userFoglalas.css"; // 📌 CSS fájl a kártyákhoz

// React Modal beállítása
Modal.setAppElement("#root");

function FoglalasKartyak() {
    const [idopontok, setIdopontok] = useState([]);
    const [foglalasAdatok, setFoglalasAdatok] = useState({
        nev: "",
        email: "",
        telefon: "",
    });
    const [hibaUzenetek, setHibaUzenetek] = useState({});
    const [kivalasztottIdopont, setKivalasztottIdopont] = useState(null);
    const [modalNyitva, setModalNyitva] = useState(false);
    const [hibaMegjelenit, setHibaMegjelenit] = useState(false);
    const [aszfElfogadva, setAszfElfogadva] = useState(false);

    useEffect(() => {
        fetchIdopontok();
    }, []);

    const fetchIdopontok = async () => {
        try {
            const response = await axios.get("http://zsukoromtest.duckdns.org:5000/api/idopontok");
            setIdopontok(response.data);
        } catch (error) {
            console.error("Hiba az időpontok lekérdezésekor:", error);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (telefon) => {
        const phoneRegex = /^(\+36|06)[\s\-]?[1-9][0-9\s\-]{7,10}$/;
        return phoneRegex.test(telefon);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Érvénytelen dátum";
        const parsedDate = new Date(dateString);
        return new Intl.DateTimeFormat("hu-HU", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(parsedDate);
    };

    const handleFoglalasInput = (field, value) => {
        setFoglalasAdatok({ ...foglalasAdatok, [field]: value });

        if (hibaMegjelenit) {
            let errorMsg = "";
            if (!value) {
                errorMsg = "Kötelező mező!";
            } else if (field === "nev" && value.length < 4) {
                errorMsg = "A névnek legalább 4 karakter hosszúnak kell lennie!";
            } else if (field === "email" && !validateEmail(value)) {
                errorMsg = "Érvénytelen email cím!";
            } else if (field === "telefon" && !validatePhone(value)) {
                errorMsg = "Érvénytelen telefonszám formátum! Helyes példa: +36301112222";
            }
            setHibaUzenetek({ ...hibaUzenetek, [field]: errorMsg });
        }
    };

    const handleFoglalas = async () => {
        console.log("Foglalás gomb megnyomva");

        setHibaMegjelenit(true);
        let errors = {};

        Object.keys(foglalasAdatok).forEach((field) => {
            if (!foglalasAdatok[field]) {
                errors[field] = "Kötelező mező!";
            } else if (field === "nev" && foglalasAdatok[field].length < 4) {
                errors[field] = "A névnek legalább 4 karakter hosszúnak kell lennie!";
            } else if (field === "email" && !validateEmail(foglalasAdatok[field])) {
                errors[field] = "Érvénytelen email cím!";
            } else if (field === "telefon" && !validatePhone(foglalasAdatok[field])) {
                errors[field] = "Érvénytelen telefonszám formátum! Helyes példa: +36301112222@";
            }
        });

        if (!aszfElfogadva) {
            errors["aszf"] = "Az ÁSZF elfogadása kötelező!";
        }

        if (Object.keys(errors).length > 0) {
            setHibaUzenetek(errors);
            return;
        }

        try {
            const response = await axios.post("http://zsukoromtest.duckdns.org:5000/api/book", {
                idopont_id: kivalasztottIdopont.id,
                user_nev: foglalasAdatok.nev,
                user_email: foglalasAdatok.email,
                user_telefon: foglalasAdatok.telefon,
            });

            alert(response.data.message);
            fetchIdopontok();
            closeModal();
        } catch (error) {
            console.error("Hiba a foglalás során:", error);
            alert("Hiba történt a foglalás során.");
        }
    };

    const closeModal = () => {
        setModalNyitva(false);
        setHibaMegjelenit(false);
        setFoglalasAdatok({ nev: "", email: "", telefon: "" });
        setHibaUzenetek({});
        setAszfElfogadva(false);
    };

    return (
        <>
             <h2 style={{ textAlign: "center" }}>Elérhető időpontok</h2>
    <div className="foglalas-kartyak-kontener">
        {idopontok.map((idopont) => {
            // 🟢 Elérhető helyek kiszámítása (max férőhely - foglalt és pending foglalások)
            const elerhetoHelyek = Math.max(0, idopont.max_ferohely - (idopont.foglaltHelyek + idopont.pendingHelyek));

            return (
                <div 
                    key={idopont.id} 
                    className={`foglalas-kartya ${elerhetoHelyek === 0 ? "betelt" : ""}`} 
                    onClick={() => {
                        if (elerhetoHelyek > 0) { // Ha nincs hely, ne engedje a kattintást
                            setKivalasztottIdopont(idopont); 
                            setModalNyitva(true);
                        }
                    }}
                >
                    <h3>{formatDate(idopont.datum)}</h3>
                    <p><strong>Képzés Témája:</strong> {idopont.idopont_tipus || "Ismeretlen tanfolyam"}</p>
                    <p><strong>Max férőhely:</strong> {idopont.max_ferohely} fő</p>
                    <p><strong>Elérhető helyek:</strong> {elerhetoHelyek === 0 ? "Betelt" : `${elerhetoHelyek} fő`}</p>
                </div>
            );
        })}
    </div>

            <Modal
    isOpen={modalNyitva}
    onRequestClose={closeModal}
    className="foglalas-modal"
    overlayClassName="foglalas-overlay"
    style={{
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 10000,
        },
        content: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            maxWidth: "90%",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            zIndex: 10001,
        }
    }}
>

                <h3>Foglalás</h3>

                {["nev", "email", "telefon"].map((field) => (
                    <div key={field}>
                        <input 
            className={`foglalas-adatok ${hibaMegjelenit && hibaUzenetek[field] ? "error" : ""}`} 
            type={field === "email" ? "email" : "text"} 
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)} 
            value={foglalasAdatok[field] ?? ""}  // Ha undefined, akkor üres string legyen
            onChange={(e) => handleFoglalasInput(field, e.target.value)} 
        />
                        {hibaMegjelenit && hibaUzenetek[field] && <p className="error-text">{hibaUzenetek[field]}</p>}
                    </div>
                ))}

                <div className="aszf-container">
                    <input
                        type="checkbox"
                        id="aszf"
                        checked={aszfElfogadva}
                        onChange={() => setAszfElfogadva(!aszfElfogadva)}
                    />
                    <label htmlFor="aszf">
                     Elfogadom az <a href="/aszf" target="_blank" style={{color:'hotpink'}}>ÁSZF-et</a> és az <a href="/aszf" target="_blank" style={{color:'hotpink'}}>Adatvédelmi Szabályzatot</a>.
                    </label>
                     {hibaMegjelenit && !aszfElfogadva && <p className="error-text">Az ÁSZF elfogadása kötelező!</p>}
                </div>

                <button className="foglalas-gomb" onClick={handleFoglalas} disabled={!aszfElfogadva}>
                    Foglalás
                </button>

                <button className="foglalas-bezaras" onClick={closeModal}>Vissza</button>
            </Modal>
        </>
    );
}

export default FoglalasKartyak;
