"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Projeler",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 5a2 2 0 012-2h3l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/board",
    label: "Board",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="4" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7" y="1" width="4" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="1" width="4" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/ai",
    label: "AI Asistan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 9c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="10" fill="#00E5A0" fillOpacity="0.15" />
          <path d="M9 16L14 21L23 11" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>TaskMind</span>
        <span className="ai-badge">AI</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-item ${pathname === link.href ? "active" : ""}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Çıkış Yap
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .sidebar { width: 220px; min-height: 100vh; background: #0A0A14; border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; padding: 24px 16px; font-family: 'DM Sans', sans-serif; position: sticky; top: 0; }

        .sidebar-logo { display: flex; align-items: center; gap: 8px; padding: 0 8px; margin-bottom: 36px; }
        .sidebar-logo span:first-of-type { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: #fff; }
        .ai-badge { background: #00E5A0; color: #07070F; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 9px; padding: 2px 5px; border-radius: 4px; }

        .sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }

        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; color: rgba(255,255,255,0.4); font-size: 14px; font-weight: 500; text-decoration: none; transition: all 0.2s; }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
        .nav-item.active { background: rgba(0,229,160,0.1); color: #00E5A0; }

        .sidebar-footer { padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }

        .logout-btn { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; color: rgba(255,255,255,0.3); font-family: 'DM Sans', sans-serif; font-size: 14px; background: none; border: none; cursor: pointer; width: 100%; transition: all 0.2s; }
        .logout-btn:hover { background: rgba(255,107,107,0.08); color: #FF6B6B; }
      `}</style>
    </aside>
  );
}