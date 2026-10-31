import axios from "axios";

const FASTAPI_BASE_URL = (process.env.ML_API_URL || "http://localhost:8080").replace(/\/$/, "");

export async function predictRisk(latitude: number, longitude: number) {
    try {
        const response = await axios.post(`${FASTAPI_BASE_URL}/predict`, {
            latitude,
            longitude
        }, { timeout: 15000 });

        return response.data;
    } catch (error) {
        console.error("FastAPI predict error:", error);
        throw new Error("FastAPI unreachable");
    }
}

export async function explainRisk(latitude: number, longitude: number) {
    try {
        const response = await axios.post(`${FASTAPI_BASE_URL}/explain`, {
            latitude,
            longitude
        }, { timeout: 15000 });

        return response.data;
    } catch (error) {
        console.error("FastAPI explain error:", error);
        throw new Error("FastAPI unreachable");
    }
}
