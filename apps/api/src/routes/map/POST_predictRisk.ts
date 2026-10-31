// src/routes/map/POST_predictRisk.ts
import { Request, Response } from "express";
import { predictRisk as callFastApi } from "../../services/fastapi";

type Coord = { lat: number; lng: number };

const CHUNK_SIZE = 20; // nombre d'appels parallèles maximum par batch

async function processChunk(chunk: Coord[]) {
  return Promise.all(chunk.map(async (c) => {
    try {
      const r = await callFastApi(c.lat, c.lng);
      // Attendu : r = { prediction: 0/1, probability_success: 0.40 }
      // Accepte aussi structure r.model_output
      const out = r.model_output ?? r;
      return {
        lat: c.lat,
        lng: c.lng,
        prediction: out.prediction ?? null,
        probability_success: typeof out.probability_success === "number" ? out.probability_success : (out.probability ?? null)
      };
    } catch (err) {
      console.error("predict call failed for", c, err);
      return {
        lat: c.lat,
        lng: c.lng,
        prediction: null,
        probability_success: null
      };
    }
  }));
}

export async function predictRiskHandler(req: Request, res: Response) {
  try {
    const body = req.body;

    let coords: Coord[] = [];

    if (Array.isArray(body?.coords)) {
      coords = body.coords.map((c: any) => ({ lat: Number(c.lat), lng: Number(c.lng) }));
    } else if (body?.latitude !== undefined && body?.longitude !== undefined) {
      coords = [{ lat: Number(body.latitude), lng: Number(body.longitude) }];
    } else {
      return res.status(400).json({ error: "Provide coords: [{lat,lng}] or latitude+longitude" });
    }

    const results: any[] = [];
    for (let i = 0; i < coords.length; i += CHUNK_SIZE) {
      const chunk = coords.slice(i, i + CHUNK_SIZE);
      const chunkRes = await processChunk(chunk);
      results.push(...chunkRes);
      // small delay optionally to be gentle with FastAPI (uncomment if needed)
      // await new Promise((r) => setTimeout(r, 50));
    }

    const probs = results.map((r) => (typeof r.probability_success === "number" ? r.probability_success : 0));
    const global_risk = probs.length ? probs.reduce((a, b) => a + b, 0) / probs.length : null;

    return res.json({ predictions: results, global_risk });
  } catch (err) {
    console.error("predictRiskHandler error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}
