// src/index.ts
import express from "express";
import cors from "cors";
import mapRouter from "./routes/map/routes";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.use("/map", mapRouter);

app.listen(port, () => {
  console.log(`Backend Express running on http://localhost:${port}`);
});

