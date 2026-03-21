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

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dash-root">

      {/* Üst kartlar */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Toplam Proje</span>
          <span className="stat-value">{loading ? "—" : projects.length}</span>
          <div className="stat-bar" style={{ background: "#00E5A0" }} />
        </div>
        <div className="stat-card">
          <span className="stat-label">Aktif Görev</span>
          <span className="stat-value">—</span>
          <div className="stat-bar" style={{ background: "#6C63FF" }} />
        </div>
        <div className="stat-card">
          <span className="stat-label">Tamamlanan</span>
          <span className="stat-value">—</span>
          <div className="stat-bar" style={{ background: "#FFB347" }} />
        </div>
        <div className="stat-card">
          <span className="stat-label">Geciken</span>
          <span className="stat-value">—</span>
          <div className="stat-bar" style={{ background: "#FF6B6B" }} />
        </div>
      </div>

      <div className="dash-grid">

        {/* Son Projeler */}
        <div className="panel">
          <div className="panel-header">
            <h2>Son Projeler</h2>
            <Link href="/projects" className="panel-link">Tümünü gör →</Link>
          </div>
          {loading ? (
            <div className="panel-loading"><div className="spinner" /></div>
          ) : projects.length === 0 ? (
            <div className="panel-empty">
              <p>Henüz proje yok</p>
              <Link href="/projects" className="empty-btn">+ Proje Oluştur</Link>
            </div>
          ) : (
            <div className="project-list">
              {projects.slice(0, 5).map((p) => (
                <Link key={p.id} href={`/projects/${p.id}`} className="project-row">
                  <div className="project-dot" style={{ background: p.color }} />
                  <div className="project-info">
                    <span className="project-name">{p.name}</span>
                    <span className="project-desc">{p.description || "Açıklama yok"}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* AI Öneri Kutusu */}
        <div className="panel ai-panel">
          <div className="panel-header">
            <h2>AI Asistan</h2>
            <span className="ai-badge">Beta</span>
          </div>
          <div className="ai-suggestions">
            {[
              "Bu projeyi 10 güne böl",
              "Bu hafta için plan çıkar",
              "Geciken işleri analiz et",
              "Alt görev önerileri al",
            ].map((s) => (
              <Link key={s} href="/ai" className="ai-chip">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="#00E5A0" strokeWidth="1.2" />
                  <path d="M5 7c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2" stroke="#00E5A0" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="7" cy="7" r=".75" fill="#00E5A0" />
                </svg>
                {s}
              </Link>
            ))}
          </div>
          <Link href="/ai" className="ai-open-btn">
            AI Panelini Aç
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root { padding: 32px; background: #07070F; min-height: 100vh; font-family: 'DM Sans', sans-serif; color: #fff; }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }

        .stat-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; position: relative; overflow: hidden; }
        .stat-label { display: block; font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 10px; }
        .stat-value { display: block; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 32px; color: #fff; letter-spacing: -1px; }
        .stat-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; opacity: 0.6; }

        .dash-grid { display: grid; grid-template-columns: 1fr 380px; gap: 20px; }

        .panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 24px; }

        .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .panel-header h2 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; }
        .panel-link { font-size: 12px; color: #00E5A0; text-decoration: none; opacity: 0.8; }
        .panel-link:hover { opacity: 1; }

        .panel-loading { display: flex; justify-content: center; padding: 40px; }
        .spinner { width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #00E5A0; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .panel-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 0; color: rgba(255,255,255,0.3); font-size: 14px; }
        .empty-btn { background: rgba(0,229,160,0.1); border: 1px solid rgba(0,229,160,0.2); color: #00E5A0; font-size: 13px; padding: 8px 16px; border-radius: 8px; text-decoration: none; }

        .project-list { display: flex; flex-direction: column; gap: 4px; }
        .project-row { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; text-decoration: none; color: #fff; transition: background 0.2s; }
        .project-row:hover { background: rgba(255,255,255,0.05); }
        .project-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .project-info { flex: 1; min-width: 0; }
        .project-name { display: block; font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .project-desc { display: block; font-size: 12px; color: rgba(255,255,255,0.35); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .ai-panel { display: flex; flex-direction: column; }
        .ai-badge { background: rgba(0,229,160,0.1); border: 1px solid rgba(0,229,160,0.2); color: #00E5A0; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }

        .ai-suggestions { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .ai-chip { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; color: rgba(255,255,255,0.6); font-size: 13px; text-decoration: none; transition: all 0.2s; }
        .ai-chip:hover { background: rgba(0,229,160,0.06); border-color: rgba(0,229,160,0.2); color: #fff; }

        .ai-open-btn { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; padding: 11px; background: #00E5A0; color: #07070F; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px; border-radius: 10px; text-decoration: none; transition: opacity 0.2s; }
        .ai-open-btn:hover { opacity: 0.9; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}