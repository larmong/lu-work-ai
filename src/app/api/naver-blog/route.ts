import { NextRequest, NextResponse } from "next/server";
import {
  buildNaverBlogPrompt,
  postProcessContent,
  postProcessTitle,
  postProcessOutline,
  type NaverBlogPost,
} from "@/lib/prompt";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "네이버 블로그 테스트 엔드포인트입니다.",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt가 필요합니다." },
        { status: 400 }
      );
    }

    // 새로운 프롬프트 시스템 사용
    const fullPrompt = buildNaverBlogPrompt(prompt);

    const generateResponse = await fetch(
      `${request.nextUrl.origin}/api/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          model: "gemini-2.5-flash",
        }),
      }
    );

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json();
      return NextResponse.json(
        { error: errorData.error || "Gemini API 호출 실패" },
        { status: generateResponse.status }
      );
    }

    const data = await generateResponse.json();

    let parsedData: NaverBlogPost;
    try {
      // JSON 추출 (코드 블록이나 추가 텍스트가 있을 수 있음)
      let jsonText = data.text.trim();
      
      // ```json ... ``` 형태로 감싸져 있으면 제거
      const codeBlockMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1];
      } else {
        // 일반적인 JSON 추출
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }
      }

      parsedData = JSON.parse(jsonText);

      // 데이터 검증 및 기본값 설정
      if (!parsedData.title || typeof parsedData.title !== "string") {
        parsedData.title = "블로그 포스트";
      }
      if (!parsedData.tags || !Array.isArray(parsedData.tags)) {
        parsedData.tags = ["블로그"];
      }
      if (!parsedData.outline || !Array.isArray(parsedData.outline)) {
        parsedData.outline = [];
      }
      if (!parsedData.content || typeof parsedData.content !== "string") {
        parsedData.content = jsonText;
      }

      // 후처리 적용
      parsedData.title = postProcessTitle(parsedData.title);
      parsedData.outline = postProcessOutline(parsedData.outline);
      parsedData.content = postProcessContent(parsedData.content);

    } catch (error) {
      console.error("JSON 파싱 실패:", error);
      console.error("원본 텍스트:", data.text);

      // 파싱 실패 시 폴백
      parsedData = {
        title: "블로그 포스트",
        tags: ["블로그"],
        outline: [],
        content: postProcessContent(data.text),
      };
    }

    return NextResponse.json({
      success: true,
      title: parsedData.title,
      tags: parsedData.tags,
      outline: parsedData.outline,
      content: parsedData.content,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("네이버 블로그 생성 오류:", error);
    return NextResponse.json(
      { error: error.message || "블로그 포스트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
