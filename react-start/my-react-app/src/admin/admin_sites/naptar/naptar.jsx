import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./naptar.css";

const Naptar = () => {
    const [kepzesek, setKepzesek] = useState([]);
    const [cim, setCim] = useState('');
    const [leiras, setLeiras] = useState('');
    const [kep, setKep] = useState(null);

    useEffect(() => {
        fetchKepzesek();
    }, []);

    const fetchKepzesek = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/kepzesek');
            setKepzesek(response.data);
        } catch (error) {
            console.error("Hiba a képzések lekérdezésekor:", error);
        }
    };

    const handleAddKepzes = async (e) => {
        e.preventDefault();
        if (!cim || !leiras || !kep) {
            alert("Minden mezőt ki kell tölteni!");
            return;
        }

        const formData = new FormData();
        formData.append("cim", cim);
        formData.append("leiras", leiras);
        formData.append("kep", kep);

        try {
            await axios.post('http://localhost:5000/api/admin/kepzesek', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            fetchKepzesek();
            setCim('');
            setLeiras('');
            setKep(null);
        } catch (error) {
            console.error("Hiba a képzés hozzáadásakor:", error);
        }
    };

    const handleDeleteKepzes = async (id) => {
        if (!window.confirm("Biztosan törölni szeretnéd ezt a képzést?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/kepzesek/${id}`);
            fetchKepzesek();
        } catch (error) {
            console.error("Hiba a törlés során:", error);
        }
    };

    return (
        <div className="admin-container">
            <h2>Admin - Képzések kezelése</h2>

            <form onSubmit={handleAddKepzes} className="admin-add-kepzes-form">
                <input type="text" placeholder="Cím" value={cim} onChange={(e) => setCim(e.target.value)} required />
                <textarea placeholder="Leírás" value={leiras} onChange={(e) => setLeiras(e.target.value)} required />
                <input type="file" accept="image/*" onChange={(e) => setKep(e.target.files[0])} required />
                <button type="submit">Képzés hozzáadása</button>
            </form>

            <div className="admin-kepzes-list">
                {kepzesek.map((kepzes) => (
                    <div key={kepzes.id} className="admin-kepzes-card">
                        <img src={`http://localhost:5000/uploads/${kepzes.kep}`} alt={kepzes.cim} className="admin-kepzes-img" />
                        <div className="admin-kepzes-info">
                            <h3>{kepzes.cim}</h3>
                            <p>{kepzes.leiras}</p>
                            <button onClick={() => handleDeleteKepzes(kepzes.id)} className="admin-kepzes-delete-btn">Törlés</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Naptar;
