"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Giriş başarısız."); return; }
      window.location.href = "/dashboard";
    } catch {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="brand-panel">
        <div className="brand-glow" />
        <div className="brand-grid" />
        <div className="brand-content">
          <div className="logo-mark">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="#00E5A0" fillOpacity="0.15" />
              <path d="M12 20L18 26L28 14" stroke="#00E5A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="logo-text">TaskMind</span>
            <span className="logo-badge">AI</span>
          </div>
          <div className="brand-tagline">
            <h1>Projeni kafanda<br />değil, burada yönet.</h1>
            <p>Görevleri takip et. AI ile plan çıkar.<br />Hiçbir şeyi kaçırma.</p>
          </div>
          <div className="feature-pills">
            {["AI Görev Planlaması", "Kanban Board", "Ekip Yönetimi", "Akıllı Notlar"].map((f) => (
              <span key={f} className="pill">{f}</span>
            ))}
          </div>
        </div>
        <div className="brand-footer"><span>© 2025 TaskMind</span></div>
      </div>

      <div className="form-panel">
        <div className="form-card">
          <div className="form-header">
            <h2>Tekrar hoş geldin</h2>
            <p>Hesabına giriş yap</p>
          </div>
          {error && (
            <div className="error-banner">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#FF6B6B" strokeWidth="1.5" />
                <path d="M8 5v4M8 11v.5" stroke="#FF6B6B" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-group">
              <label htmlFor="email">E-posta</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M1 6l7 4 7-4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input id="email" type="email" placeholder="ornek@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="field-group">
              <div className="label-row">
                <label htmlFor="password">Şifre</label>
                <Link href="/forgot-password" className="forgot-link">Şifreni mi unuttun?</Link>
              </div>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : <>Giriş Yap <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></>}
            </button>
          </form>
          <p className="switch-link">Hesabın yok mu? <Link href="/register">Ücretsiz kaydol</Link></p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-root { display: flex; min-height: 100vh; background: #07070F; font-family: 'DM Sans', sans-serif; }
        .brand-panel { position: relative; width: 45%; display: flex; flex-direction: column; justify-content: space-between; padding: 48px; overflow: hidden; border-right: 1px solid rgba(255,255,255,0.06); }
        .brand-glow { position: absolute; top: -120px; left: -80px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(0,229,160,0.12) 0%, transparent 70%); pointer-events: none; }
        .brand-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; }
        .brand-content { position: relative; z-index: 1; margin-top: auto; margin-bottom: auto; }
        .logo-mark { display: flex; align-items: center; gap: 10px; margin-bottom: 56px; }
        .logo-text { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 22px; color: #fff; letter-spacing: -0.5px; }
        .logo-badge { background: #00E5A0; color: #07070F; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
        .brand-tagline h1 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 42px; line-height: 1.1; color: #fff; letter-spacing: -1.5px; margin-bottom: 20px; }
        .brand-tagline p { font-size: 15px; color: rgba(255,255,255,0.45); line-height: 1.7; }
        .feature-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px; }
        .pill { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); font-size: 12px; padding: 6px 12px; border-radius: 20px; }
        .brand-footer { position: relative; z-index: 1; font-size: 12px; color: rgba(255,255,255,0.2); }
        .form-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 48px 24px; }
        .form-card { width: 100%; max-width: 400px; }
        .form-header { margin-bottom: 36px; }
        .form-header h2 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 28px; color: #fff; letter-spacing: -0.8px; margin-bottom: 6px; }
        .form-header p { font-size: 14px; color: rgba(255,255,255,0.4); }
        .error-banner { display: flex; align-items: center; gap: 8px; background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.25); color: #FF6B6B; font-size: 13px; padding: 10px 14px; border-radius: 8px; margin-bottom: 20px; }
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .field-group { display: flex; flex-direction: column; gap: 8px; }
        .field-group label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6); }
        .label-row { display: flex; justify-content: space-between; align-items: center; }
        .forgot-link { font-size: 12px; color: #00E5A0; text-decoration: none; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.25); pointer-events: none; }
        .input-wrapper input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 14px 12px 42px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #fff; outline: none; transition: border-color 0.2s; }
        .input-wrapper input::placeholder { color: rgba(255,255,255,0.2); }
        .input-wrapper input:focus { border-color: rgba(0,229,160,0.4); background: rgba(0,229,160,0.04); }
        .submit-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px; background: #00E5A0; color: #07070F; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; transition: opacity 0.2s; margin-top: 4px; }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(7,7,15,0.3); border-top-color: #07070F; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .switch-link { text-align: center; font-size: 13px; color: rgba(255,255,255,0.35); margin-top: 24px; }
        .switch-link a { color: #00E5A0; text-decoration: none; font-weight: 500; }
        @media (max-width: 768px) { .brand-panel { display: none; } }
      `}</style>
    </div>
  );
}