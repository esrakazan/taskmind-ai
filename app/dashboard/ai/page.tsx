"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

const SUGGESTIONS = [
  "Bu projeyi 10 güne böl",
  "Bu hafta için çalışma planı çıkar",
  "Görevleri öncelik sırasına koy",
  "Sprint planlaması yap",
  "Riskleri analiz et",
  "Alt görev önerileri ver",
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Merhaba! Ben TaskMind AI asistanınım. Projeni planlamana, görevlerini organize etmene ve verimli çalışmana yardımcı olabilirim. Nasıl yardımcı olabilirim?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: msg },
    ]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: data.response || "Bir hata oluştu.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "Sunucuya bağlanılamadı.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-root">
      <div className="ai-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.role === "ai" && (
              <div className="ai-avatar">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#00E5A0" strokeWidth="1.5" />
                  <path d="M5 8c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="8" r="1" fill="#00E5A0" />
                </svg>
              </div>
            )}
            <div className="message-bubble">
              {msg.content.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message ai">
            <div className="ai-avatar">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="#00E5A0" strokeWidth="1.5" />
                <path d="M5 8c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="8" r="1" fill="#00E5A0" />
              </svg>
            </div>
            <div className="message-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="ai-input-area">
        <div className="ai-input-wrapper">
          <input
            placeholder="Bir şey sor... Örn: Bu projeyi 10 güne böl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ai-root { display: flex; flex-direction: column; height: calc(100vh - 60px); background: #07070F; font-family: 'DM Sans', sans-serif; color: #fff; }

        .ai-messages { flex: 1; overflow-y: auto; padding: 32px; display: flex; flex-direction: column; gap: 20px; }
        .ai-messages::-webkit-scrollbar { width: 4px; }
        .ai-messages::-webkit-scrollbar-track { background: transparent; }
        .ai-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        .message { display: flex; gap: 12px; max-width: 720px; }
        .message.user { flex-direction: row-reverse; align-self: flex-end; }
        .message.ai { align-self: flex-start; }

        .ai-avatar { width: 32px; height: 32px; border-radius: 50%; background: rgba(0,229,160,0.1); border: 1px solid rgba(0,229,160,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }

        .message-bubble { padding: 12px 16px; border-radius: 14px; font-size: 14px; line-height: 1.6; }
        .message-bubble p { margin: 0; }
        .message-bubble p + p { margin-top: 6px; }

        .message.ai .message-bubble { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); border-radius: 4px 14px 14px 14px; }
        .message.user .message-bubble { background: #00E5A0; color: #07070F; font-weight: 500; border-radius: 14px 4px 14px 14px; }

        .typing { display: flex; align-items: center; gap: 5px; padding: 16px !important; }
        .typing span { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.3); animation: bounce 1.2s infinite; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

        .suggestions { padding: 0 32px 16px; display: flex; flex-wrap: wrap; gap: 8px; }
        .suggestion-chip { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); font-family: 'DM Sans', sans-serif; font-size: 13px; padding: 8px 14px; border-radius: 20px; cursor: pointer; transition: all 0.2s; }
        .suggestion-chip:hover { background: rgba(0,229,160,0.08); border-color: rgba(0,229,160,0.2); color: #00E5A0; }

        .ai-input-area { padding: 16px 32px 24px; border-top: 1px solid rgba(255,255,255,0.06); }
        .ai-input-wrapper { display: flex; gap: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 8px 8px 8px 16px; transition: border-color 0.2s; }
        .ai-input-wrapper:focus-within { border-color: rgba(0,229,160,0.3); }

        .ai-input-wrapper input { flex: 1; background: none; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #fff; }
        .ai-input-wrapper input::placeholder { color: rgba(255,255,255,0.2); }
        .ai-input-wrapper input:disabled { opacity: 0.5; }

        .send-btn { width: 36px; height: 36px; border-radius: 10px; background: #00E5A0; border: none; color: #07070F; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; flex-shrink: 0; }
        .send-btn:hover:not(:disabled) { opacity: 0.9; }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
    </div>
  );
}