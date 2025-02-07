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

    useEffect(() => {
        fetchIdopontok();
    }, []);

    const fetchIdopontok = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/idopontok");
            setIdopontok(response.data);
        } catch (error) {
            console.error("Hiba az időpontok lekérdezésekor:", error);
        }
    };

    const handleFoglalasInput = (field, value) => {
        setFoglalasAdatok({...foglalasAdatok, [field]: value});
        if (hibaMegjelenit) {
            setHibaUzenetek({...hibaUzenetek, [field]: value ? "" : "Kötelező mező!"});
        }
    };

    const handleFoglalas = async () => {
        setHibaMegjelenit(true);
        let errors = {};
        Object.keys(foglalasAdatok).forEach((field) => {
            if (!foglalasAdatok[field]) errors[field] = "Kötelező mező!";
        });
        
        if (Object.keys(errors).length > 0) {
            setHibaUzenetek(errors);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/book", {
                idopont_id: kivalasztottIdopont.id,
                user_nev: foglalasAdatok.nev,
                user_email: foglalasAdatok.email,
                user_telefon: foglalasAdatok.telefon,
            });

            alert(response.data.message);
            fetchIdopontok();
            setModalNyitva(false);
            setHibaMegjelenit(false);
            setFoglalasAdatok({ nev: "", email: "", telefon: "" });
            setHibaUzenetek({});
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
    };

    return (
        <div className="foglalas-kontener">
            <h2>Elérhető időpontok</h2>
            {idopontok.map((idopont) => (
                <div key={idopont.id} className="foglalas-kartya" onClick={() => setKivalasztottIdopont(idopont) || setModalNyitva(true)}>
                    <h3>{new Intl.DateTimeFormat('hu-HU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(idopont.datum))}</h3>
                    <p>Képzés Témája: {idopont.idopont_tipus || "Ismeretlen tanfolyam"}</p>
                    <p>Max férőhely: {idopont.max_ferohely} fő</p>
                </div>
            ))}

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
                <h3> {kivalasztottIdopont ? new Intl.DateTimeFormat('hu-HU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(kivalasztottIdopont.datum)) : ''} </h3>
                
                {['nev', 'email', 'telefon'].map((field) => (
                    <div key={field}>
                        <input 
                            className={`foglalas-adatok ${hibaMegjelenit && hibaUzenetek[field] ? "error" : ""}`}
                            type={field === "email" ? "email" : "text"}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={foglalasAdatok[field]}
                            onChange={(e) => handleFoglalasInput(field, e.target.value)}
                        />
                        {hibaMegjelenit && hibaUzenetek[field] && <p className="error-text">{hibaUzenetek[field]}</p>}
                    </div>
                ))}

                <button className="foglalas-gomb" onClick={handleFoglalas}>Foglalás</button>
                <button className="foglalas-bezaras" onClick={closeModal}>Vissza</button>
            </Modal>
        </div>
    );
}

export default FoglalasKartyak;
