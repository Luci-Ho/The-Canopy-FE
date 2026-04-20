import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  app.post("/api/oracle", async (req, res) => {
    try {
      const { prompt, history } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      console.log(" alo", apiKey)
      
      if (!apiKey) {
        console.error("Invalid or missing GEMINI_API_KEY");
        return res.status(500).json({ 
          error: "Configuration Error",
          message: "API Key chưa được cấu hình chính xác. Vui lòng kiểm tra lại Secrets trong AI Studio." 
        });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        systemInstruction: "You are 'Linh hồn cây' (The Tree Spirit), the guardian of 'The Canopy'. Your tone is mystical, peaceful, poetic, and wise. You speak in Vietnamese. You help users find inner peace and provide spiritual guidance using nature metaphors. Keep responses concise but evocative."
      });

      const chat = model.startChat({
        history: history || [],
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      
      res.json({ text: response.text() });
    } catch (error: any) {
      console.error("Oracle API Error:", error);
      
      let errorMessage = "Những tán lá đang xào xạc trong gió, ta chưa thể nghe rõ lời bạn. Hãy tĩnh lặng một chút và thử lại nhé.";
      
      if (error?.message?.includes("API key not valid")) {
        errorMessage = "API Key không hợp lệ. Vui lòng kiểm tra lại cấu hình Secrets.";
      }

      res.status(500).json({ 
        error: "Internal Server Error",
        message: errorMessage
      });
    }
  });

  // --- Vite / Static Files ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
