import React from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar"; // Fixed import typos
import "@schedule-x/theme-default/dist/calendar.css"; // Fixed typo in CSS path

function Naptar() {
    const calendarApp = useCalendarApp({
        views: [
            createViewWeek(), // Fixed typo
            createViewMonthGrid() // Fixed typo
        ]
    });

    return (
        <ScheduleXCalendar calendarApp={calendarApp} /> // Pass the valid calendarApp
    );
}

export default Naptar;
