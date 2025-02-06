import React, { useState, useEffect } from "react";
import axios from "axios";
import "../kepzes_styles/userFoglalas.css"; // 📌 CSS fájl a kártyákhoz

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
            fetchIdopontok();
            setModalNyitva(false); // Bezárjuk a modált sikeres foglalás után
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
                    <div key={idopont.id} className="foglalas-kartya" onClick={() => { 
                        setKivalasztottIdopont(idopont);
                        setModalNyitva(true);
                    }}>
                        <h3>{idopont.datum}</h3>
                        <p>Max férőhely: {idopont.max_ferohely} fő</p>
                        <p>{idopont.kezdes_ido ? `${idopont.kezdes_ido} - ${idopont.vege_ido}` : "Időpont nincs megadva"}</p>
                    </div>
                ))}
            </div>

            {/* 🟢 Foglalási modális ablak */}
            {modalNyitva && (
                <div className="foglalas-modal">
                    <div className="foglalas-modal-tartalom">
                        <span className="foglalas-bezaras" onClick={() => setModalNyitva(false)}>&times;</span>
                        <h3>Foglalás {kivalasztottIdopont?.datum} időpontra</h3>

                        <input type="text" placeholder="Név" value={foglalasAdatok.nev} onChange={(e) => setFoglalasAdatok({...foglalasAdatok, nev: e.target.value})} />
                        <input type="email" placeholder="Email" value={foglalasAdatok.email} onChange={(e) => setFoglalasAdatok({...foglalasAdatok, email: e.target.value})} />
                        <input type="tel" placeholder="Telefonszám" value={foglalasAdatok.telefon} onChange={(e) => setFoglalasAdatok({...foglalasAdatok, telefon: e.target.value})} />

                        <button className="foglalas-gomb" onClick={handleFoglalas}>Foglalás</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FoglalasKartyak;
