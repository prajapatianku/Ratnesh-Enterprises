import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '25mb' }));

  // Initialize Gemini AI SDK (User-Agent header set to 'aistudio-build' as required by gemini-api skill)
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // POST /api/generate-mockup : Generates a photorealistic room mockup featuring the selected tile using Gemini AI
  app.post('/api/generate-mockup', async (req: Request, res: Response) => {
    try {
      const {
        tileName = 'Glazed Vitrified Tile',
        brand = 'Orientbell',
        finish = 'High Gloss',
        colorTone = 'Italian Marble Veins',
        roomType = 'living_room',
        tileImageUrl,
      } = req.body;

      const roomLabel =
        roomType === 'master_bathroom'
          ? 'luxury contemporary master bathroom with backlit LED mirror and freestanding vanity'
          : roomType === 'modern_kitchen'
          ? 'modern open-concept modular kitchen with fluted cabinets and under-cabinet warm cove lighting'
          : 'expansive luxury penthouse living room with modern designer sofa and panoramic terrace windows';

      const prompt = `A breathtaking, hyper-realistic architectural interior photograph of a ${roomLabel}. The space prominently features "${tileName}" by ${brand} tiles on the floor and feature accent surfaces with a rich ${finish} reflective polish, ${colorTone}. Shot with a wide-angle 24mm architectural lens, soft warm golden-hour lighting, crisp specular reflections, seamless tile joints, interior design magazine cover quality, 8k resolution, immaculate perspective.`;

      let generatedImageUrl: string | null = null;
      let aiNotes: string = '';

      if (process.env.GEMINI_API_KEY) {
        // First try gemini-3.1-flash-lite-image
        try {
          const contentsParts: any[] = [{ text: prompt }];

          // If a custom image was provided, include it in the multimodal prompt
          if (tileImageUrl && typeof tileImageUrl === 'string' && tileImageUrl.startsWith('data:image')) {
            const matches = tileImageUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
            if (matches && matches[2]) {
              contentsParts.push({
                inlineData: {
                  mimeType: matches[1] || 'image/jpeg',
                  data: matches[2],
                },
              });
            }
          }

          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: { parts: contentsParts },
            config: {
              imageConfig: {
                aspectRatio: '16:9',
              },
            },
          });

          for (const part of response.candidates?.[0]?.content?.parts ?? []) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType ?? 'image/jpeg';
              generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            } else if (part.text) {
              aiNotes += part.text;
            }
          }
        } catch (imgError: any) {
          console.warn('Gemini 3.1 image generation note:', imgError?.message || imgError);
          // If image generation failed (e.g. quota limit), fetch architectural interior advice via gemini-3.8-flash
          try {
            const textResponse = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: `As a luxury architectural interior designer, provide a 2-sentence design vision for installing "${tileName}" (${brand}, ${finish}, ${colorTone}) in a ${roomLabel}. Highlight ambient lighting and aesthetic harmony.`,
            });
            aiNotes = textResponse.text || '';
          } catch (textErr) {
            console.warn('Gemini 3.8 fallback text note:', textErr);
          }
        }
      } else {
        aiNotes = 'Gemini API key is configured automatically in production.';
      }

      return res.json({
        success: true,
        imageUrl: generatedImageUrl,
        description: aiNotes,
        promptUsed: prompt,
      });
    } catch (err: any) {
      console.error('generate-mockup endpoint error:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Failed to process mockup request',
      });
    }
  });

  // Development vs Production
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
