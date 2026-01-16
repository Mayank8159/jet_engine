import os
import joblib
import pandas as pd
import numpy as np
import warnings
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict

# 1. SETUP & SILENCE LOGS
# This ensures that even system-level library logs don't clutter your terminal
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
warnings.filterwarnings("ignore")

app = FastAPI(
    title="Jet Engine RUL Predictive API",
    description="Backend for predicting Remaining Useful Life (RUL) using NASA CMAPSS data",
    version="1.0.0"
)

# 2. CORS CONFIGURATION
# Essential for Next.js (port 3000) to communicate with FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. GLOBAL MODEL STATE
# We load these as None first to handle cases where train.py hasn't run yet
model = None
model_features = None

MODEL_PATH = "models/rul_model.pkl"
FEAT_PATH = "models/features.pkl"

def load_assets():
    global model, model_features
    if os.path.exists(MODEL_PATH) and os.path.exists(FEAT_PATH):
        model = joblib.load(MODEL_PATH)
        model_features = joblib.load(FEAT_PATH)
        print("✅ Model and Features loaded successfully.")
    else:
        print("❌ Model files missing. Please run scripts/train.py first.")

@app.on_event("startup")
async def startup_event():
    load_assets()

# 4. DATA SCHEMAS
class PredictionInput(BaseModel):
    unit_id: int = Field(..., example=1)
    cycle: int = Field(..., example=120)
    sensors: Dict[str, float] = Field(..., example={"s2": 642.3, "s3": 1589.2, "s4": 1403.1})

class PredictionResponse(BaseModel):
    unit_id: int
    predicted_rul: float
    health_score: float
    risk_level: str
    status: str

# 5. ENDPOINTS
@app.get("/health")
async def health_check():
    """Verify API and Model status."""
    return {
        "status": "online",
        "model_loaded": model is not None,
        "environment": "production-ready"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_rul(data: PredictionInput):
    """Predict RUL based on sensor snapshots."""
    if model is None:
        raise HTTPException(status_code=503, detail="Machine Learning model not available.")

    try:
        # Prepare data for XGBoost
        input_dict = data.sensors.copy()
        input_dict['cycle'] = data.cycle
        
        # Convert to DataFrame and align with training features
        df = pd.DataFrame([input_dict])
        df = df.reindex(columns=model_features, fill_value=0)
        
        # Inference
        raw_prediction = model.predict(df)[0]
        rul = max(0, float(raw_prediction))
        
        # Calculate Health Metrics (Assuming 200 cycles is a standard lifespan)
        health_percent = min(100.0, (rul / 200.0) * 100.0)
        
        # Determine Risk Category
        if rul < 30:
            risk = "High"
            status = "Immediate Maintenance Required"
        elif rul < 75:
            risk = "Moderate"
            status = "Schedule Inspection Soon"
        else:
            risk = "Low"
            status = "Operating within Normal Parameters"

        return {
            "unit_id": data.unit_id,
            "predicted_rul": round(rul, 2),
            "health_score": round(health_percent, 1),
            "risk_level": risk,
            "status": status
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Inference Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)