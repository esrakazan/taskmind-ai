"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projeler",
  "/board": "Board",
  "/ai": "AI Asistan",
};

export default function Navbar() {
  const pathname = usePathname();
  const title = titles[pathname] || "TaskMind";

  return (
    <header className="navbar">
      <h1 className="navbar-title">{title}</h1>

      <div className="navbar-right">
        <div className="avatar">E</div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .navbar { display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 60px; border-bottom: 1px solid rgba(255,255,255,0.06); background: #07070F; font-family: 'DM Sans', sans-serif; position: sticky; top: 0; z-index: 10; }

        .navbar-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; color: #fff; letter-spacing: -0.4px; }

        .navbar-right { display: flex; align-items: center; gap: 12px; }

        .avatar { width: 32px; height: 32px; border-radius: 50%; background: rgba(0,229,160,0.15); border: 1px solid rgba(0,229,160,0.3); color: #00E5A0; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; cursor: pointer; }
      `}</style>
    </header>
  );
}