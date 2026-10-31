"""Contract checks using a temporary fixture model, never the production model."""
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import mlflow.sklearn
import pandas as pd
from fastapi.testclient import TestClient
from sklearn.ensemble import RandomForestClassifier

import serve_fastapi as service


class ServiceContractTests(unittest.TestCase):
    def test_missing_model_is_explicitly_unavailable(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(service, "MODEL_PATH", Path(directory) / "missing"):
                with TestClient(service.app) as client:
                    self.assertEqual(client.get("/health").status_code, 200)
                    self.assertFalse(client.get("/health").json()["model_loaded"])
                    self.assertEqual(client.get("/ready").status_code, 503)
                    point = {"longitude": 10, "latitude": 5}
                    self.assertEqual(client.post("/predict", json=point).status_code, 503)
                    self.assertEqual(client.post("/explain", json=point).status_code, 503)
                    self.assertEqual(client.post("/predict", json={"longitude": 0, "latitude": 95}).status_code, 422)

    def test_model_prediction_and_explanation_contract(self):
        X = pd.DataFrame({"longitude": [0, 1, 2, 80, 81, 82], "latitude": [0, 1, 2, 20, 21, 22]})
        model = RandomForestClassifier(n_estimators=5, random_state=42).fit(X, [0, 0, 0, 1, 1, 1])
        with tempfile.TemporaryDirectory() as directory:
            model_path = Path(directory) / "model"
            mlflow.sklearn.save_model(model, str(model_path))
            with patch.object(service, "MODEL_PATH", model_path):
                with TestClient(service.app) as client:
                    self.assertEqual(client.get("/ready").status_code, 200)
                    point = {"longitude": 80, "latitude": 20}
                    prediction = client.post("/predict", json=point)
                    self.assertEqual(prediction.status_code, 200)
                    self.assertTrue(0 <= prediction.json()["probability_success"] <= 1)
                    response = client.post("/explain", json=point)
                    self.assertEqual(response.status_code, 200)
                    explanation = response.json()
                    self.assertEqual(explanation["feature_names"], ["longitude", "latitude"])
                    self.assertEqual(len(explanation["shap_values"]), 2)
                    self.assertIsInstance(explanation["expected_value"], float)
                    self.assertAlmostEqual(explanation["expected_value"] + sum(explanation["shap_values"]), prediction.json()["probability_success"], places=6)


if __name__ == "__main__":
    unittest.main()
