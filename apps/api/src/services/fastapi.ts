import axios from "axios";

const FASTAPI_BASE_URL = "http://localhost:8080";

export async function predictRisk(latitude: number, longitude: number) {
    try {
        const response = await axios.post(`${FASTAPI_BASE_URL}/predict`, {
            latitude,
            longitude
        });

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
        });

        return response.data;
    } catch (error) {
        console.error("FastAPI explain error:", error);
        throw new Error("FastAPI unreachable");
    }
}
