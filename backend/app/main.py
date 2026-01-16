import os
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Jet Engine LSTM RUL API")

# CORS Setup for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all for testing; change to localhost:3000 later
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CORRECTED LOADING LOGIC ---
# This matches your file: C:\Users\...\backend\models\lstm_rul_model.h5
MODEL_PATH = os.path.join("models", "lstm_rul_model.h5")
model = None

@app.on_event("startup")
async def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        try:
            # We use compile=False to avoid errors if custom metrics were used during training
            model = tf.keras.models.load_model(MODEL_PATH, compile=False)
            print(f"✅ SUCCESS: LSTM Model loaded from {MODEL_PATH}")
        except Exception as e:
            print(f"❌ ERROR: Found file but failed to load: {e}")
    else:
        print(f"❌ ERROR: File NOT found at {MODEL_PATH}")
        # Print current directory to help debug paths
        print(f"Current Working Directory: {os.getcwd()}")

# --- DATA SCHEMA ---
class EngineData(BaseModel):
    # LSTMs expect a sequence: [TimeSteps, Features]
    # Example: A 2D list of sensor readings
    data_window: list

@app.get("/health")
def health():
    return {"status": "online", "model_loaded": model is not None}

@app.post("/predict")
async def predict(data: EngineData):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Convert input to 3D tensor: (BatchSize, TimeSteps, Features)
        input_array = np.array(data.data_window)
        reshaped_input = np.expand_dims(input_array, axis=0)
        
        prediction = model.predict(reshaped_input)
        rul = float(prediction[0][0])

        return {
            "predicted_rul": round(rul, 2),
            "status": "Healthy" if rul > 50 else "Critical"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))