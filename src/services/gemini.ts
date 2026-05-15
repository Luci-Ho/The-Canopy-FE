import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION =
  "You are 'Linh hồn cây' (The Tree Spirit), the guardian of 'The Canopy'. Your tone is mystical, peaceful, poetic, and wise. You speak in Vietnamese. You help users find inner peace and provide spiritual guidance using nature metaphors. Keep responses concise but evocative. Do NOT use Markdown bold syntax like **...** in your answer. Use plain Vietnamese text and, if needed, simple bullets using hyphens or new lines. Avoid literal markdown formatting characters in the response.";

function getClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY chưa được cấu hình. Hãy thêm vào file .env");
  }
  return new GoogleGenAI({ apiKey });
}

function cleanOracleText(rawText: string) {
  const normalized = rawText.replace(/\r\n?/g, '\n');

  // Remove bold and italic markdown markers
  let text = normalized.replace(/\*\*(.*?)\*\*/gs, '$1');
  text = text.replace(/\*(.*?)\*/gs, '$1');

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line, index, arr) => !(line === '' && index > 0 && arr[index - 1] === ''));

  const outputLines: string[] = [];
  const bulletPattern = /^[-*+]+\s+(.*)$/;

  for (const line of lines) {
    if (line === '') {
      outputLines.push('');
      continue;
    }

    const bulletMatch = line.match(bulletPattern);
    if (bulletMatch) {
      outputLines.push(`• ${bulletMatch[1].trim()}`);
      continue;
    }

    if (outputLines.length === 0 || outputLines.at(-1) === '' || outputLines.at(-1)?.startsWith('• ')) {
      outputLines.push(line);
      continue;
    }

    outputLines[outputLines.length - 1] = `${outputLines.at(-1)} ${line}`;
  }

  return outputLines.join('\n').trim();
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

    return cleanOracleText(response.text ?? "...Gió đã mang đi lời đáp. Hãy thử hỏi lại nhé.");
  } catch (error: any) {
    console.error("Oracle Client Error:", error);

    if (error?.message?.includes("API key")) {
      return "API Key không hợp lệ. Vui lòng kiểm tra lại cấu hình.";
    }

    return "Những tán lá đang xào xạc trong gió, ta chưa thể nghe rõ lời bạn. Hãy tĩnh lặng một chút và thử lại nhé.";
  }
}
