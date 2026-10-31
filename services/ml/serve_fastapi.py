"""Local inference service. No model means unavailable, never a fabricated score."""
from contextlib import asynccontextmanager
import logging
import os
from pathlib import Path

import mlflow.sklearn
import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
MODEL_PATH = Path(os.environ.get("MODEL_PATH", str(Path(__file__).parent / "best_model")))
model = None
explainer = None


@asynccontextmanager
async def lifespan(app):
    global model, explainer
    model = None
    explainer = None
    if MODEL_PATH.exists():
        model = mlflow.sklearn.load_model(str(MODEL_PATH))
        try:
            explainer = shap.TreeExplainer(model)
        except Exception:
            logger.warning("SHAP tree explanation unavailable for this model", exc_info=True)
    else:
        logger.warning("No trained model at %s; inference returns HTTP 503", MODEL_PATH)
    yield


app = FastAPI(title="Maritime Risk Atlas ML API", lifespan=lifespan)


class AttackInput(BaseModel):
    longitude: float = Field(ge=-180, le=180, allow_inf_nan=False)
    latitude: float = Field(ge=-90, le=90, allow_inf_nan=False)


def features(point):
    return pd.DataFrame([{"longitude": point.longitude, "latitude": point.latitude}])


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.get("/ready")
def ready():
    if model is None:
        return JSONResponse(status_code=503, content={"status": "model_unavailable"})
    model.predict(features(AttackInput(longitude=0, latitude=0)))
    return {"status": "ready"}


@app.get("/")
def root():
    return {"message": "Maritime Risk Atlas ML API", "docs": "/docs"}


@app.post("/predict")
def predict(point: AttackInput):
    if model is None:
        raise HTTPException(503, "No trained model available")
    X = features(point)
    return {"prediction": int(model.predict(X)[0]),
            "probability_success": float(model.predict_proba(X)[0][1])}


@app.post("/explain")
def explain(point: AttackInput):
    if model is None or explainer is None:
        raise HTTPException(503, "Explanation unavailable")
    X = features(point)
    raw = explainer.shap_values(X)
    if isinstance(raw, list):
        values = np.asarray(raw[1])[0]
    else:
        values = np.asarray(raw)
        values = values[0, :, 1] if values.ndim == 3 else values[0]
    base = np.asarray(explainer.expected_value).reshape(-1)
    return {"input": point.model_dump(),
            "expected_value": float(base[1] if base.size > 1 else base[0]),
            "shap_values": values.tolist(), "feature_names": X.columns.tolist()}
