import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    console.log("SERVER API KEY:", apiKey);
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const { prompt, model = "gemini-2.5-flash" } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt가 필요합니다." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      text,
      model,
    });
  } catch (error: any) {
    console.error("Gemini API 오류:", error);

    return NextResponse.json(
      { error: error.message || "Gemini API 호출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
