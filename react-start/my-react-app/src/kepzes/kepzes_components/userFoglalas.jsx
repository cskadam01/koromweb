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
    const [kivalasztottIdopont, setKivalasztottIdopont] = useState(null);
    const [modalNyitva, setModalNyitva] = useState(false);

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

    const formatDate = (dateString) => {
        if (!dateString) return "Érvénytelen dátum"; // Ha nincs dátum, akkor ne formázzuk
        const parsedDate = new Date(dateString);
        if (isNaN(parsedDate)) return "Érvénytelen dátum"; // Ha a dátum hibás, akkor visszatérünk egy szöveggel
        return new Intl.DateTimeFormat('hu-HU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(parsedDate);
    };

    const openModal = (idopont) => {
        setKivalasztottIdopont(idopont);
        setModalNyitva(true);
    };

    const closeModal = () => {
        setModalNyitva(false);
    };

    const handleFoglalas = async () => {
        if (!foglalasAdatok.nev || !foglalasAdatok.email || !foglalasAdatok.telefon) {
            alert("Kérlek, töltsd ki az összes mezőt!");
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
            fetchIdopontok(); // Frissítjük az időpontokat foglalás után
            closeModal(); // Bezárjuk a modált sikeres foglalás után
        } catch (error) {
            console.error("Hiba a foglalás során:", error);
            alert("Hiba történt a foglalás során.");
        }
    };

    return (
        <div className="foglalas-kontener">
            <h2>Elérhető időpontok</h2>

            {/* 🟢 Időpont kártyák */}
            <div className="foglalas-kartyak-kontener">
                {idopontok.map((idopont) => (
                    <div key={idopont.id} className="foglalas-kartya" onClick={() => openModal(idopont)}>
                        <h3>{formatDate(idopont.datum)}</h3>
                        <p>Max férőhely: {idopont.max_ferohely} fő</p>
                        <p>Elérhető helyek: {idopont.max_ferohely - ((idopont.foglaltHelyek || 0) + (idopont.pendingHelyek || 0))} fő</p>
                        <p>{idopont.kezdes_ido ? `${idopont.kezdes_ido} - ${idopont.vege_ido}` : "Időpont nincs megadva"}</p>
                    </div>
                ))}
            </div>

            {/* 🟢 React Modal */}
            <Modal
                isOpen={modalNyitva}
                onRequestClose={closeModal}
                contentLabel="Foglalás"
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
                <h3>Foglalás {formatDate(kivalasztottIdopont?.datum)} időpontra</h3>

                <input type="text" placeholder="Név" value={foglalasAdatok.nev} onChange={(e) => setFoglalasAdatok({...foglalasAdatok, nev: e.target.value})} />
                <input type="email" placeholder="Email" value={foglalasAdatok.email} onChange={(e) => setFoglalasAdatok({...foglalasAdatok, email: e.target.value})} />
                <input type="tel" placeholder="Telefonszám" value={foglalasAdatok.telefon} onChange={(e) => setFoglalasAdatok({...foglalasAdatok, telefon: e.target.value})} />

                <button className="foglalas-gomb" onClick={handleFoglalas}>Foglalás</button>
                <button className="foglalas-bezaras" onClick={closeModal}>Bezárás</button>
            </Modal>
        </div>
    );
}

export default FoglalasKartyak;
