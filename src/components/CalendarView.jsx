import React, { useMemo, useState } from "react";
import { formatISODate, startOfMonth, endOfMonth } from "../utils/date";

function getMonthMatrix(year, month) {
  // returns array of weeks, each week is array of Date or null
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  // pad initial nulls
  const startDay = first.getDay(); // 0..6 (Sun..Sat)
  for (let i = 0; i < startDay; i++) week.push(null);

  for (let d = 1; d <= last.getDate(); d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  while (week.length < 7 && week.length > 0) {
    week.push(null);
  }
  if (week.length) matrix.push(week);
  // ensure 6 rows for consistent height
  while (matrix.length < 6) {
    matrix.push(new Array(7).fill(null));
  }
  return matrix;
}

export default function CalendarView({
  selectedDate,
  onSelectDate,
  tasksByDate = {},
}) {
  const sel = new Date(selectedDate);
  const [view, setView] = useState({
    year: sel.getFullYear(),
    month: sel.getMonth(),
  });

  const matrix = useMemo(() => getMonthMatrix(view.year, view.month), [view]);

  function prev() {
    const m = view.month - 1;
    if (m < 0) setView({ year: view.year - 1, month: 11 });
    else setView({ year: view.year, month: m });
  }

  function next() {
    const m = view.month + 1;
    if (m > 11) setView({ year: view.year + 1, month: 0 });
    else setView({ year: view.year, month: m });
  }

  const monthLabel = new Date(view.year, view.month, 1).toLocaleString(
    "id-ID",
    { month: "long", year: "numeric" }
  );

  return (
    <div className="calendar">
      <div className="cal-header">
        <button className="btn small" onClick={prev} aria-label="prev month">
          ‹
        </button>
        <div className="month-label">{monthLabel}</div>
        <button className="btn small" onClick={next} aria-label="next month">
          ›
        </button>
      </div>

      <div className="cal-grid">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d} className="cal-cell cal-weekday border-0 bg-none">
            {d}
          </div>
        ))}

        {matrix.map((week, wi) =>
          week.map((day, di) => {
            const iso = day ? formatISODate(day) : null;
            const tasks = iso ? tasksByDate[iso] || [] : [];
            const isSelected = iso === selectedDate;
            return (
              <div
                key={`${wi}-${di}`}
                className={`cal-cell day ${day ? "" : "empty"} ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => day && onSelectDate(formatISODate(day))}
              >
                {day ? <div className="day-num">{day.getDate()}</div> : null}
                {tasks.length ? (
                  <div className="dots">
                    <span className="dot" title={`${tasks.length} tugas`} />
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
