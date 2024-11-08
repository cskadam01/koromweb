import React, { useState, useEffect } from "react";

// Példa admin beállítások: kezdési és zárási idő (órában)
const adminSettings = {
  startHour: 8, // Nyitás 8-kor
  endHour: 20, // Zárás 20-kor
  weeksInAdvance: 10,
};

function AppointmentBooking({ selectedServiceDuration }) {
  const [weeks, setWeeks] = useState([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedDayTime, setSelectedDayTime] = useState({});
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const generatedWeeks = generateWeeks(adminSettings.weeksInAdvance);
    setWeeks(generatedWeeks);
  }, []);

  const generateWeeks = (numberOfWeeks) => {
    const weeks = [];
    let currentDate = new Date();

    for (let i = 0; i < numberOfWeeks; i++) {
      const startOfWeek = new Date(currentDate);
      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"].map((day, index) => {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + index);

        return {
          day: `${day} (${dayDate.toLocaleDateString()})`,
          blocks: [], // Nap blokkjai
        };
      });

      weeks.push({
        week: `${startOfWeek.toLocaleDateString()} to ${endOfWeek.toLocaleDateString()}`,
        days,
      });

      currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
  };

  const handleDaySelection = (day) => {
    // Kiválasztott időtartam blokként kezelése
    const selectedBlock = {
      day,
      startHour: adminSettings.startHour,
      endHour: adminSettings.startHour + selectedServiceDuration / 60, // Átalakítás órára
    };
    setSelectedDayTime(selectedBlock);
  };

  const handleInputChange = (e) => {
    setAppointmentDetails({
      ...appointmentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedWeek = weeks[currentWeekIndex];
    console.log("Foglalás adatai:", appointmentDetails, "Blokk:", selectedDayTime, "Hét:", selectedWeek);
    alert("Foglalás sikeresen elküldve!");
  };

  const goToNextWeek = () => {
    if (currentWeekIndex < weeks.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
      setSelectedDayTime({});
    }
  };

  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
      setSelectedDayTime({});
    }
  };

  const currentWeek = weeks[currentWeekIndex];

  return (
    <div>
      <h2>Időpontfoglalás</h2>

      <div>
        <h3>Választható hét: {currentWeek ? currentWeek.week : "Nincs elérhető hét"}</h3>
        <button onClick={goToPreviousWeek} disabled={currentWeekIndex === 0}>Előző hét</button>
        <button onClick={goToNextWeek} disabled={currentWeekIndex === weeks.length - 1}>Következő hét</button>
      </div>

      {currentWeek && (
        <div>
          <h3>Elérhető időpontok - {currentWeek.week}</h3>
          {currentWeek.days.map((day) => (
            <div key={day.day}>
              <button
                onClick={() => handleDaySelection(day.day)}
                style={{
                  backgroundColor: selectedDayTime.day === day.day ? "lightblue" : "white",
                }}
              >
                {day.day} ({adminSettings.startHour}:00 - {adminSettings.endHour}:00)
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h3>Foglalási adatok</h3>
        <label>
          Név:
          <input
            type="text"
            name="name"
            value={appointmentDetails.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={appointmentDetails.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Telefonszám:
          <input
            type="text"
            name="phone"
            value={appointmentDetails.phone}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Foglalás elküldése</button>
      </form>
    </div>
  );
}

export default AppointmentBooking;
