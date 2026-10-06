import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware
  app.use(express.json());

  // CORS for internal / shared preview support
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Server-side Gemini client initialization
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    const hasServerKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      status: 'ok',
      hasServerKey,
    });
  });

  // Backend Gemini proxy for outfit styling & cultural advisory
  app.post('/api/gemini/suggest-style', async (req, res) => {
    const { outfitId, outfitName, purpose, remixLevel, colors, accessories, weather } = req.body || {};
    try {
      if (!ai) {
        return res.status(503).json({
          success: false,
          error: 'Chưa kiểm tra được (chưa cấu hình GEMINI_API_KEY trên server)',
        });
      }

      const prompt = `Bạn là chuyên gia tư vấn văn hóa và trang phục truyền thống Việt Nam cho Gen Z tại cuộc thi AI Arena Vietnam 2026.
Hãy đưa ra nhận xét ngắn gọn (3-4 câu) về bản phối sau:
- Trang phục: ${outfitName} (${outfitId})
- Mục đích sử dụng: ${purpose}
- Mức độ cách tân: Level ${remixLevel}
- Màu sắc: ${colors}
- Phụ kiện: ${accessories}
- Thời tiết: ${weather}
Hãy tập trung vào tính hòa hợp thẩm mỹ, gợi ý phụ kiện và nhắc nhở giữ gìn nét văn hóa cốt lõi.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      res.json({
        success: true,
        mode: 'live_gemini',
        text: response.text,
      });
    } catch (error: any) {
      console.warn('[Gemini Proxy Error]', error?.message || error);
      res.status(502).json({
        success: false,
        error: 'Chưa kiểm tra được (lỗi kết nối hoặc dịch vụ AI tạm thời gián đoạn)',
      });
    }
  });

  // In production with built dist, serve static assets
  const distPath = path.resolve(__dirname, 'dist');
  const isProduction = process.env.NODE_ENV === 'production' && fs.existsSync(distPath);

  if (isProduction) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Development or fallback: hook Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { clientPort: 443 },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Việt Phục Remix] Server running at http://0.0.0.0:${PORT} (Gemini Proxy: ${Boolean(apiKey) ? 'Enabled' : 'Standby'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
