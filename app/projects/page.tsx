"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Project = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  createdAt: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#00E5A0");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, color }),
      });
      if (res.ok) {
        setName("");
        setDescription("");
        setColor("#00E5A0");
        setModalOpen(false);
        fetchProjects();
      }
    } finally {
      setCreating(false);
    }
  };

  const COLORS = ["#00E5A0", "#6C63FF", "#FF6B6B", "#FFB347", "#4FC3F7", "#F06292"];

  return (
    <div className="projects-root">
      <div className="projects-header">
        <div>
          <h1>Projeler</h1>
          <p>{projects.length} proje</p>
        </div>
        <button className="create-btn" onClick={() => setModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Yeni Proje
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="12" width="32" height="28" rx="4" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <path d="M16 12V10a4 4 0 018 0v2" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <path d="M18 26h12M18 32h8" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p>Henüz proje yok</p>
          <span>İlk projeyi oluşturmak için butona tıkla</span>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="project-card">
              <div className="card-accent" style={{ background: project.color }} />
              <div className="card-body">
                <div className="card-dot" style={{ background: project.color }} />
                <h3>{project.name}</h3>
                <p>{project.description || "Açıklama yok"}</p>
              </div>
              <div className="card-footer">
                <span>{new Date(project.createdAt).toLocaleDateString("tr-TR")}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Yeni Proje</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="field">
                <label>Proje Adı</label>
                <input
                  placeholder="Örn: TaskMind AI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>

              <div className="field">
                <label>Açıklama (opsiyonel)</label>
                <textarea
                  placeholder="Proje hakkında kısa bir açıklama..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="field">
                <label>Renk</label>
                <div className="color-picker">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      className={`color-dot ${color === c ? "selected" : ""}`}
                      style={{ background: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setModalOpen(false)}>İptal</button>
              <button className="btn-create" onClick={handleCreate} disabled={creating || !name.trim()}>
                {creating ? <span className="btn-spinner" /> : "Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .projects-root { padding: 40px; font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #07070F; color: #fff; }

        .projects-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
        .projects-header h1 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; letter-spacing: -0.8px; }
        .projects-header p { font-size: 13px; color: rgba(255,255,255,0.35); margin-top: 4px; }

        .create-btn { display: flex; align-items: center; gap: 8px; background: #00E5A0; color: #07070F; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px; padding: 10px 18px; border: none; border-radius: 10px; cursor: pointer; transition: opacity 0.2s; }
        .create-btn:hover { opacity: 0.9; }

        .loading { display: flex; justify-content: center; padding: 80px; }
        .spinner { width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #00E5A0; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 100px 0; color: rgba(255,255,255,0.3); }
        .empty-state p { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.4); }
        .empty-state span { font-size: 13px; }

        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

        .project-card { position: relative; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; overflow: hidden; text-decoration: none; color: #fff; transition: background 0.2s, transform 0.2s; display: flex; flex-direction: column; }
        .project-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-2px); }

        .card-accent { height: 3px; width: 100%; }
        .card-body { padding: 20px; flex: 1; }
        .card-dot { width: 8px; height: 8px; border-radius: 50%; margin-bottom: 12px; }
        .card-body h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; margin-bottom: 6px; letter-spacing: -0.3px; }
        .card-body p { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.5; }

        .card-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: rgba(255,255,255,0.25); }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal { background: #0F0F1A; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 100%; max-width: 440px; overflow: hidden; }

        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .modal-header h2 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; }
        .modal-close { background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; padding: 4px; border-radius: 6px; transition: color 0.2s; }
        .modal-close:hover { color: #fff; }

        .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
        .field { display: flex; flex-direction: column; gap: 8px; }
        .field label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.5); }
        .field input, .field textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 11px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #fff; outline: none; resize: none; transition: border-color 0.2s; }
        .field input::placeholder, .field textarea::placeholder { color: rgba(255,255,255,0.2); }
        .field input:focus, .field textarea:focus { border-color: rgba(0,229,160,0.4); }

        .color-picker { display: flex; gap: 10px; }
        .color-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.15s; }
        .color-dot:hover { transform: scale(1.15); }
        .color-dot.selected { border-color: #fff; transform: scale(1.15); }

        .modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07); }
        .btn-cancel { background: rgba(255,255,255,0.06); border: none; color: rgba(255,255,255,0.6); font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 10px 18px; border-radius: 10px; cursor: pointer; transition: background 0.2s; }
        .btn-cancel:hover { background: rgba(255,255,255,0.1); }
        .btn-create { background: #00E5A0; border: none; color: #07070F; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px; padding: 10px 20px; border-radius: 10px; cursor: pointer; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; min-width: 80px; }
        .btn-create:hover:not(:disabled) { opacity: 0.9; }
        .btn-create:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(7,7,15,0.3); border-top-color: #07070F; border-radius: 50%; animation: spin 0.7s linear infinite; }
      `}</style>
    </div>
  );
}