import React, { useState } from "react";

function Szalon() {
  const [form, setForm] = useState({
    userName: "",
    userPhone: "",
    userEmail: "",
    start_time: "",
    duration: 60, // Alapértelmezett 1 óra
  });

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:5000/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Foglalás sikeres!");
        } else {
          alert(`Hiba: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Hiba a foglalás során:", error);
        alert("Szerverhiba történt.");
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Név:</label>
      <input
        type="text"
        value={form.userName}
        onChange={(e) => setForm({ ...form, userName: e.target.value })}
        required
      />

      <label>Telefonszám:</label>
      <input
        type="tel"
        value={form.userPhone}
        onChange={(e) => setForm({ ...form, userPhone: e.target.value })}
      />

      <label>Email:</label>
      <input
        type="email"
        value={form.userEmail}
        onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
      />

      <label>Dátum és idő:</label>
      <input
        type="datetime-local"
        value={form.start_time}
        onChange={(e) => setForm({ ...form, start_time: e.target.value })}
        required
      />

      <label>Időtartam:</label>
      <select
        value={form.duration}
        onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
      >
        <option value={60}>1 óra</option>
        <option value={75}>75 perc</option>
        <option value={90}>1,5 óra</option>
        <option value={120}>2 óra</option>
      </select>

      <button type="submit">Foglalás</button>
    </form>
  );
}

export default Szalon;
