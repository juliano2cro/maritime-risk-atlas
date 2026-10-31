// src/routes/map/POST_sendCoords.ts
import { Request, Response } from "express";
import { generateIntermediatePoints } from "../../utils/geo";

export const sendCoords = (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body || !Array.isArray(body.points)) {
      return res.status(400).json({ error: "body.points (array) required" });
    }
    const spacing = typeof body.spacing === "number" && body.spacing > 0 ? body.spacing : 1000; // default 10 km
    const inputPoints: { lat: number; lng: number }[] = body.points.map((p: any) => ({
      lat: Number(p.lat),
      lng: Number(p.lng),
    }));

    const allPoints: { lat: number; lng: number }[] = [];

    for (let i = 0; i < inputPoints.length - 1; i++) {
      const a = inputPoints[i];
      const b = inputPoints[i + 1];
      allPoints.push(a);
      const intermediates = generateIntermediatePoints(a.lat, a.lng, b.lat, b.lng, spacing);
      for (const pt of intermediates) allPoints.push(pt);
    }
    // push le dernier
    allPoints.push(inputPoints[inputPoints.length - 1]);

    return res.json({ all_points: allPoints, spacing });
  } catch (err) {
    console.error("sendCoords error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
};
