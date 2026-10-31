// src/routes/map/POST_explain.ts
import { Request, Response } from "express";
import { explainRisk as callFastApi } from "../../services/fastapi";

type Coord = { lat: number; lng: number };

export async function explainRiskHandler(req: Request, res: Response) {
  try {
    const body = req.body;

    let coord: Coord;

    if (body?.lat !== undefined && body?.lng !== undefined) {
      coord = { lat: Number(body.lat), lng: Number(body.lng) };
    } else {
      return res.status(400).json({ error: "Provide lat and lng" });
    }

    try {
      const r = await callFastApi(coord.lat, coord.lng);
      return res.json(r);
    } catch (err) {
      console.error("explain call failed for", coord, err);
      return res.status(500).json({
        error: "explain_failed",
        details: (err as Error).message,
      });
    }
  } catch (err) {
    console.error("explainRiskHandler error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}
