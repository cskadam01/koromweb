import React, { useState, useEffect } from "react";
import './idopontok.css'

function Idopontok() {
    const [availability, setAvailability] = useState([]);
    const [form, setForm] = useState({
        date: "",
        start_time: "08:00",
        end_time: "18:00",
    });

    useEffect(() => {
        fetch("http://localhost:5000/api/availability")
            .then((res) => res.json())
            .then((data) => {
                console.log("API válasz:", data); // Ellenőrizd az API adatokat
                if (Array.isArray(data)) {
                    setAvailability(data);
                } else {
                    console.error("Nem tömb az API válasz:", data);
                    setAvailability([]);
                }
            })
            .catch((err) => console.error("Hiba az API hívás során:", err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/api/availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    alert("Elérhetőség hozzáadva!");
                    setAvailability([...availability, { ...form, id: data.id }]);
                }
            })
            .catch((err) => console.error("Hiba az elérhetőség mentésekor:", err));
    };

    return (
        <div className="admin-panel-container">
            <h2 className="admin-title">Elérhető időpontok kezelése</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Dátum:</label>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Kezdés:</label>
                    <input
                        type="time"
                        value={form.start_time}
                        onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Befejezés:</label>
                    <input
                        type="time"
                        value={form.end_time}
                        onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    />
                </div>
                <button className="add-button" type="submit">Hozzáadás</button>
            </form>

            <h3 className="availability-title">Elérhető időpontok:</h3>
{availability && availability.length > 0 ? (
    <ul className="availability-list">
        {availability.map((item) => (
            <li className="availability-item" key={item.id}>
                {item.datum || item.date} {item.startTime || item.start_time} - {item.endTime || item.end_time}
            </li>
        ))}
    </ul>
) : (
    <p>Nincs elérhető időpont.</p>
)}
        </div>
    );
}

export default Idopontok;

