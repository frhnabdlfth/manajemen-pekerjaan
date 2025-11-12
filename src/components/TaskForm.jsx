import React, { useState, useEffect } from "react";
import { formatDisplayDate } from "../utils/date";

export default function TaskForm({
  initialDate,
  onSubmit,
  onCancel,
  initial = {},
}) {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [date, setDate] = useState(initial.date || initialDate);
  const [time, setTime] = useState(initial.time || "");
  const [priority, setPriority] = useState(initial.priority || "normal");

  // Sinkronisasi date dengan initialDate saat user klik kalender
  useEffect(() => {
    if (!initial.id) {
      setDate(initialDate);
    }
  }, [initialDate, initial.id]);

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description,
      date,
      time,
      priority,
      completed: initial.completed || false,
      id: initial.id,
    });
    // Reset form hanya ketika menambah task baru, bukan edit
    if (!initial.id) {
      setTitle("");
      setDescription("");
      setTime("");
    }
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <div className="form-row">
        <input
          className="input"
          placeholder="Judul tugas"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-row space-y-2">
        <div className="date-display">
          <div className="date-label">Tanggal Terpilih</div>
          <div className="date-value">{formatDisplayDate(date)}</div>
        </div>
        <input
          className="input hidden"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="form-row">
        <select
          className="input"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Santai</option>
          <option value="normal">Normal</option>
          <option value="high">Penting</option>
        </select>
      </div>
      <div className="form-row">
        <textarea
          className="input"
          placeholder="Deskripsi (opsional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-row form-actions">
        <button type="submit" className="btn primary">
          Simpan
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="btn ghost">
            Batal
          </button>
        ) : null}
      </div>
    </form>
  );
}
