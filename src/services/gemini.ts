export async function getOracleResponse(prompt: string, history: { role: "user" | "model", parts: { text: string }[] }[] = []) {
  try {
    const response = await fetch("/api/oracle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("Oracle Client Error:", error);
    return error.message || "Những tán lá đang xào xạc trong gió, ta chưa thể nghe rõ lời bạn. Hãy tĩnh lặng một chút và thử lại nhé.";
  }
}
