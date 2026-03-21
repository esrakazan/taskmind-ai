"use client";

import { useState, useEffect } from "react";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string | null;
};

type Column = {
  id: string;
  name: string;
  order: number;
  tasks: Task[];
};

type Project = {
  id: string;
  name: string;
  color: string;
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "#6B7280",
  MEDIUM: "#FFB347",
  HIGH: "#FF6B6B",
  URGENT: "#FF3B3B",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek",
  URGENT: "Acil",
};

export default function BoardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [creating, setCreating] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
          setSelectedProject(data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    setLoading(true);
    fetch(`/api/tasks?projectId=${selectedProject}`)
      .then((r) => r.json())
      .then((data) => {
        setColumns(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [selectedProject]);

  const openModal = (columnId: string) => {
    setActiveColumn(columnId);
    setTaskTitle("");
    setTaskDesc("");
    setTaskPriority("MEDIUM");
    setTaskDueDate("");
    setModalOpen(true);
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDesc,
          columnId: activeColumn,
          projectId: selectedProject,
          priority: taskPriority,
          dueDate: taskDueDate || null,
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        const data = await fetch(`/api/tasks?projectId=${selectedProject}`).then((r) => r.json());
        setColumns(Array.isArray(data) ? data : []);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDragStart = (taskId: string) => setDragging(taskId);

  const handleDrop = async (columnId: string) => {
    if (!dragging) return;
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: dragging, columnId }),
    });
    setDragging(null);
    const data = await fetch(`/api/tasks?projectId=${selectedProject}`).then((r) => r.json());
    setColumns(Array.isArray(data) ? data : []);
  };

  const handleDeleteTask = async (taskId: string) => {
    await fetch(`/api/tasks?taskId=${taskId}`, { method: "DELETE" });
    const data = await fetch(`/api/tasks?projectId=${selectedProject}`).then((r) => r.json());
    setColumns(Array.isArray(data) ? data : []);
  };

  return (
    <div className="board-root">

      {/* Proje Seçici */}
      <div className="board-topbar">
        <div className="project-tabs">
          {projects.map((p) => (
            <button
              key={p.id}
              className={`project-tab ${selectedProject === p.id ? "active" : ""}`}
              style={selectedProject === p.id ? { borderColor: p.color, color: p.color } : {}}
              onClick={() => setSelectedProject(p.id)}
            >
              <span className="tab-dot" style={{ background: p.color }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="board-loading"><div className="spinner" /></div>
      ) : (
        <div className="board-columns">
          {columns.map((col) => (
            <div
              key={col.id}
              className="board-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="col-header">
                <div className="col-title">
                  <span className="col-name">{col.name}</span>
                  <span className="col-count">{col.tasks.length}</span>
                </div>
                <button className="add-task-btn" onClick={() => openModal(col.id)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="col-tasks">
                {col.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                  >
                    <div className="task-priority-bar" style={{ background: PRIORITY_COLORS[task.priority] }} />
                    <div className="task-body">
                      <p className="task-title">{task.title}</p>
                      {task.description && <p className="task-desc">{task.description}</p>}
                      <div className="task-footer">
                        <span className="priority-badge" style={{ color: PRIORITY_COLORS[task.priority], background: PRIORITY_COLORS[task.priority] + "18" }}>
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                        {task.dueDate && (
                          <span className="due-date">
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <rect x="1" y="2" width="9" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
                              <path d="M3.5 1v2M7.5 1v2M1 5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                            {new Date(task.dueDate).toLocaleDateString("tr-TR")}
                          </span>
                        )}
                        <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {col.tasks.length === 0 && (
                  <div className="col-empty" onClick={() => openModal(col.id)}>
                    + Görev ekle
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Görev Oluştur Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Yeni Görev</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Görev Başlığı</label>
                <input
                  placeholder="Örn: Arayüz tasarımı yap"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateTask()}
                  autoFocus
                />
              </div>
              <div className="field">
                <label>Açıklama (opsiyonel)</label>
                <textarea
                  placeholder="Görev hakkında detay..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Öncelik</label>
                  <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
                    <option value="LOW">Düşük</option>
                    <option value="MEDIUM">Orta</option>
                    <option value="HIGH">Yüksek</option>
                    <option value="URGENT">Acil</option>
                  </select>
                </div>
                <div className="field">
                  <label>Son Tarih</label>
                  <input type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setModalOpen(false)}>İptal</button>
              <button className="btn-create" onClick={handleCreateTask} disabled={creating || !taskTitle.trim()}>
                {creating ? <span className="btn-spinner" /> : "Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .board-root { padding: 24px 32px; background: #07070F; min-height: 100vh; font-family: 'DM Sans', sans-serif; color: #fff; display: flex; flex-direction: column; gap: 24px; }

        .board-topbar { display: flex; align-items: center; }
        .project-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
        .project-tab { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: rgba(255,255,255,0.4); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .project-tab:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.7); }
        .project-tab.active { background: rgba(255,255,255,0.06); }
        .tab-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        .board-loading { display: flex; justify-content: center; padding: 80px; }
        .spinner { width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #00E5A0; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .board-columns { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; align-items: flex-start; }

        .board-column { min-width: 280px; width: 280px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; display: flex; flex-direction: column; gap: 0; }

        .col-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .col-title { display: flex; align-items: center; gap: 8px; }
        .col-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; color: rgba(255,255,255,0.8); }
        .col-count { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 20px; }
        .add-task-btn { width: 26px; height: 26px; border-radius: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .add-task-btn:hover { background: rgba(0,229,160,0.1); border-color: rgba(0,229,160,0.2); color: #00E5A0; }

        .col-tasks { padding: 12px; display: flex; flex-direction: column; gap: 8px; min-height: 80px; }

        .col-empty { padding: 16px; text-align: center; font-size: 12px; color: rgba(255,255,255,0.2); border: 1px dashed rgba(255,255,255,0.08); border-radius: 10px; cursor: pointer; transition: all 0.2s; }
        .col-empty:hover { border-color: rgba(0,229,160,0.2); color: rgba(0,229,160,0.5); }

        .task-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; cursor: grab; transition: transform 0.15s, box-shadow 0.15s; }
        .task-card:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        .task-card:active { cursor: grabbing; }
        .task-priority-bar { height: 2px; }
        .task-body { padding: 12px; }
        .task-title { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.9); line-height: 1.4; margin-bottom: 4px; }
        .task-desc { font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.4; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .task-footer { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .priority-badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
        .due-date { display: flex; align-items: center; gap: 4px; font-size: 11px; color: rgba(255,255,255,0.3); margin-left: auto; }
        .delete-btn { margin-left: auto; background: none; border: none; color: rgba(255,255,255,0.2); cursor: pointer; padding: 2px; border-radius: 4px; display: flex; align-items: center; transition: color 0.2s; }
        .delete-btn:hover { color: #FF6B6B; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal { background: #0F0F1A; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 100%; max-width: 460px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .modal-header h2 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; }
        .modal-close { background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; }
        .modal-close:hover { color: #fff; }
        .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .field-row { display: flex; gap: 12px; }
        .field label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.5); }
        .field input, .field textarea, .field select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 11px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #fff; outline: none; resize: none; transition: border-color 0.2s; width: 100%; }
        .field input::placeholder, .field textarea::placeholder { color: rgba(255,255,255,0.2); }
        .field input:focus, .field textarea:focus, .field select:focus { border-color: rgba(0,229,160,0.4); }
        .field select option { background: #0F0F1A; }
        .field input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        .modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07); }
        .btn-cancel { background: rgba(255,255,255,0.06); border: none; color: rgba(255,255,255,0.6); font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 10px 18px; border-radius: 10px; cursor: pointer; }
        .btn-cancel:hover { background: rgba(255,255,255,0.1); }
        .btn-create { background: #00E5A0; border: none; color: #07070F; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px; padding: 10px 20px; border-radius: 10px; cursor: pointer; min-width: 80px; display: flex; align-items: center; justify-content: center; }
        .btn-create:hover:not(:disabled) { opacity: 0.9; }
        .btn-create:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(7,7,15,0.3); border-top-color: #07070F; border-radius: 50%; animation: spin 0.7s linear infinite; }
      `}</style>
    </div>
  );
}