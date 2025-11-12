import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import CalendarView from "./components/CalendarView";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Modal from "./components/Modal";
import { formatISODate, formatDisplayDate } from "./utils/date";

const STORAGE_KEY = "mp_tasks_v1";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load tasks", e);
    return [];
  }
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks", e);
  }
}

function App() {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [selectedDate, setSelectedDate] = useState(formatISODate(new Date()));
  const [editingTask, setEditingTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("mp_theme_v1");
    return savedTheme || "dark";
  });

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("mp_theme_v1", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const tasksByDate = useMemo(() => {
    const map = {};
    for (const t of tasks) {
      (map[t.date] ||= []).push(t);
    }
    return map;
  }, [tasks]);

  function handleAdd(task) {
    const newTask = { ...task, id: Date.now() };
    setTasks((s) => [newTask, ...s]);
  }

  function handleUpdate(updated) {
    setTasks((s) => s.map((t) => (t.id === updated.id ? updated : t)));
    setEditingTask(null);
  }

  function handleDelete(id) {
    setTasks((s) => s.filter((t) => t.id !== id));
  }

  function handleToggleComplete(id) {
    setTasks((s) =>
      s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  // Reset ke halaman 1 ketika user berganti tanggal
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate]);

  function handleThemeToggle() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <div className="app-root">
      <Header theme={theme} onThemeToggle={handleThemeToggle} />
      <main className="container">
        <aside className="panel">
          <CalendarView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            tasksByDate={tasksByDate}
          />
        </aside>

        <section className="content">
          <div className="content-header">
            <h2>Tugas untuk {formatDisplayDate(selectedDate)}</h2>
          </div>
          <div className="content-body">
            <TaskList
              tasks={tasksByDate[selectedDate] || []}
              onEdit={(t) => setEditingTask(t)}
              onDelete={handleDelete}
              onToggle={handleToggleComplete}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            <div className="actions">
              <h3>➕ Tambah Tugas Baru</h3>
              <TaskForm
                key="new"
                initialDate={selectedDate}
                onSubmit={handleAdd}
                onCancel={null}
              />
            </div>
          </div>
        </section>
      </main>

      <Modal
        isOpen={!!editingTask}
        title={`✏️ Edit Tugas`}
        onClose={() => setEditingTask(null)}
      >
        {editingTask && (
          <TaskForm
            key={editingTask.id}
            initialDate={editingTask.date}
            initial={editingTask}
            onSubmit={(data) => handleUpdate({ ...editingTask, ...data })}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;