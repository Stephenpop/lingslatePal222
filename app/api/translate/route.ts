import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, source, target } = await req.json();

  // Lingva Translate API expects /api/v1/{from}/{to}/{text}
  // If source is "auto", use "auto" as from language
  const fromLang = source === "auto" ? "auto" : source;
  const url = `https://lingva.ml/api/v1/${fromLang}/${target}/${encodeURIComponent(text)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Lingva Translate failed");
    const data = await res.json();

    // Lingva returns { translation: "..." }
    return NextResponse.json({
      translatedText: data.translation,
    });
  } catch (error) {
    return NextResponse.json(
      { translatedText: "", error: "Translation failed" },
      { status: 500 }
    );
  }
}