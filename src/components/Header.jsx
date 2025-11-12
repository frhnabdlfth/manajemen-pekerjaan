import React from "react";

export default function Header({ theme, onThemeToggle }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-content">
          <div>
            <h1 className="brand">Manajemen Pekerjaan</h1>
            <p className="tag">Kelola tugas Anda dengan mudah dan efisien</p>
          </div>
        </div>
        <div className="header-stats">
          <button
            className="theme-toggle"
            onClick={onThemeToggle}
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="theme-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
