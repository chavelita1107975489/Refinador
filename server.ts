import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Endpoints
app.post("/api/refine", async (req, res) => {
  try {
    const { prompt, technique, examples, taskType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const systemInstruction = `Eres un experto en ingeniería de prompts. Tu tarea es analizar un prompt dado y mejorarlo siguiendo la estructura: Rol + Tarea + Contexto + Formato de salida.
Utiliza la técnica solicitada: ${technique}.
Si técnica es 'few-shot', utiliza los ejemplos proporcionados: ${JSON.stringify(examples)}.
Si técnica es 'chain-of-thought', añade instrucciones para que la IA razone paso a paso.

Debes devolver la respuesta estrictamente en formato JSON con la siguiente estructura:
{
  "precision": number (1-100),
  "analysis": "Breve explicación detallada de los puntos débiles del prompt original",
  "refinedPrompt": "El prompt mejorado completo",
  "components": {
    "role": "El rol asignado",
    "task": "La tarea específica",
    "context": "El contexto y restricciones",
    "format": "El formato de salida solicitado"
  },
  "suggestions": ["Sugerencia 1", "Sugerencia 2"]
}`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Prompt original: ${prompt}\nTipo de tarea: ${taskType}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            precision: { type: Type.INTEGER },
            analysis: { type: Type.STRING },
            refinedPrompt: { type: Type.STRING },
            components: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                task: { type: Type.STRING },
                context: { type: Type.STRING },
                format: { type: Type.STRING }
              },
              required: ["role", "task", "context", "format"]
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["precision", "analysis", "refinedPrompt", "components", "suggestions"]
        }
      },
    });

    const responseData = JSON.parse(result.text);
    res.json(responseData);
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to refine prompt" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
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
