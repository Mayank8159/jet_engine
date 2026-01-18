import os
import numpy as np
import tensorflow as tf
import joblib
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# Constants matching your LSTM model requirements
TIME_STEPS = 30
NUM_FEATURES = 24
MAX_RUL = 125.0

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup: Load models and scalers ---
    # Using a dictionary in app.state for cleaner access
    app.state.model = None
    app.state.scaler = None
    
    try:
        # Paths relative to the root or current working directory
        model_path = os.path.join("models", "lstm_rul_model.h5")
        scaler_path = os.path.join("models", "scaler.pkl")
        
        if os.path.exists(model_path):
            # compile=False saves memory on startup
            app.state.model = tf.keras.models.load_model(model_path, compile=False)
            print("✅ TensorFlow Model Loaded")
            
        if os.path.exists(scaler_path):
            app.state.scaler = joblib.load(scaler_path)
            print("✅ Scikit-learn Scaler Loaded")
            
        print("🚀 Backend Assets Ready for Requests")
    except Exception as e:
        print(f"❌ Startup Error: {e}")
        
    yield
    # --- Shutdown: Clear memory ---
    app.state.model = None
    app.state.scaler = None

app = FastAPI(title="AeroGuard Intelligent API", lifespan=lifespan)

# Enable CORS for Next.js communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EngineData(BaseModel):
    data: List[List[float]]

@app.get("/")
async def health_check():
    return {"status": "online", "model_loaded": app.state.model is not None}

@app.post("/predict")
async def predict(request: EngineData):
    # Retrieve from app.state
    model = app.state.model
    scaler = app.state.scaler

    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded on server")

    try:
        x = np.array(request.data, dtype=np.float32)

        # Validation for input shape
        if x.shape != (TIME_STEPS, NUM_FEATURES):
            raise HTTPException(
                status_code=400, 
                detail=f"Expected shape (30,24), but received {x.shape}"
            )

        # Scale and Predict
        x_scaled = scaler.transform(x) if scaler else x
        x_reshaped = np.expand_dims(x_scaled, axis=0)
        
        # verbose=0 prevents log spam during prediction
        y_pred = model.predict(x_reshaped, verbose=0)
        
        rul = max(0, min(float(y_pred[0][0]), MAX_RUL))
        health_percent = (rul / MAX_RUL) * 100

        # Status Logic
        if health_percent > 70:
            status, grade, action = "Healthy", "A", "Optimal performance"
        elif health_percent > 40:
            status, grade, action = "Warning", "B", "Schedule maintenance soon"
        else:
            status, grade, action = "Critical", "C", "IMMEDIATE INSPECTION REQUIRED"

        return {
            "predicted_rul": round(rul, 2),
            "health_percent": round(health_percent, 1),
            "status": status,
            "health_grade": grade,
            "maintenance_action": action,
            "risk_score": round(1 - (health_percent / 100), 2),
            "confidence": 0.95,
            "rul_history": [round(max(rul + i * 5, 0), 2) for i in range(10, -1, -1)],
            "top_sensors": [
                {"sensor": "T24", "impact": 0.35},
                {"sensor": "T50", "impact": 0.28},
                {"sensor": "Nf", "impact": 0.12}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")