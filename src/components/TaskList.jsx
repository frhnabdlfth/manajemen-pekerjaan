import React, { useMemo } from "react";

function PriorityBadge({ p }) {
  const cls =
    p === "high" ? "badge danger" : p === "low" ? "badge muted" : "badge";
  return <span className={cls}>{p}</span>;
}

const ITEMS_PER_PAGE = 5;

export default function TaskList({
  tasks = [],
  onEdit,
  onDelete,
  onToggle,
  currentPage = 1,
  onPageChange,
}) {
  // Hitung total halaman dan data yang ditampilkan
  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedTasks = tasks.slice(startIdx, endIdx);

  if (!tasks.length) {
    return <div className="empty">Tidak ada tugas untuk tanggal ini</div>;
  }

  return (
    <div className="task-list-container">
      <ul className="task-list">
        {paginatedTasks.map((t) => (
          <li key={t.id} className={`task-item ${t.completed ? "done" : ""}`}>
            <div className="task-main">
              <input
                type="checkbox"
                checked={t.completed || false}
                onChange={() => onToggle(t.id)}
              />
              <div className="task-body">
                <div className="task-title">{t.title}</div>
                <div className="task-meta">
                  {t.time || "—"} • <PriorityBadge p={t.priority} />
                </div>
                {t.description ? (
                  <div className="task-desc">{t.description}</div>
                ) : null}
              </div>
            </div>
            <div className="task-actions">
              <button className="btn ghost small" onClick={() => onEdit(t)}>
                Edit
              </button>
              <button
                className="btn danger small"
                onClick={() => onDelete(t.id)}
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn small"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <div className="pagination-info">
            Halaman {currentPage} dari {totalPages} ({tasks.length} tugas)
          </div>
          <button
            className="btn small"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
