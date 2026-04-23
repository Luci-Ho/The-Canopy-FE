import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION =
  "You are 'Linh hồn cây' (The Tree Spirit), the guardian of 'The Canopy'. Your tone is mystical, peaceful, poetic, and wise. You speak in Vietnamese. You help users find inner peace and provide spiritual guidance using nature metaphors. Keep responses concise but evocative.";

function getClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log("xxxx", apiKey);
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY chưa được cấu hình. Hãy thêm vào file .env");
  }
  return new GoogleGenAI({ apiKey });
}

export async function getOracleResponse(
  prompt: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[] = []
) {
  try {
    const ai = getClient();

    const contents = [
      ...history,
      { role: "user" as const, parts: [{ text: prompt }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      contents,
    });

    return response.text ?? "...Gió đã mang đi lời đáp. Hãy thử hỏi lại nhé.";
  } catch (error: any) {
    console.error("Oracle Client Error:", error);

    if (error?.message?.includes("API key")) {
      return "API Key không hợp lệ. Vui lòng kiểm tra lại cấu hình.";
    }

    return "Những tán lá đang xào xạc trong gió, ta chưa thể nghe rõ lời bạn. Hãy tĩnh lặng một chút và thử lại nhé.";
  }
}
