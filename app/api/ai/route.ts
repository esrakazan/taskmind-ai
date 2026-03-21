import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json({ message: "Mesaj zorunludur." }, { status: 400 });
    }

    const systemPrompt = `Sen TaskMind AI adlı bir proje yönetim asistanısın. 
Kullanıcıların projelerini planlamasına, görevlerini organize etmesine ve verimli çalışmasına yardım ediyorsun.
Türkçe yanıt ver. Kısa, net ve pratik ol.
${context ? `Mevcut proje bilgisi: ${context}` : ""}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 1024,
      }),
    });

    const data = await res.json();
    const response = data.choices?.[0]?.message?.content || "Bir hata oluştu.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("[AI ERROR]", error);
    return NextResponse.json({ message: "AI hatası oluştu." }, { status: 500 });
  }
}