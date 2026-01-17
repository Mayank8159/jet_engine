import requests
import numpy as np
import json

BASE_URL = "http://127.0.0.1:8000/predict"

def generate_window(scale_factor=1.0, noise=True):
    """
    Generates a 30x24 window. 
    scale_factor: Multiplier to simulate sensor drift/heat.
    """
    # Base nominal values (simulating typical sensor averages)
    base_data = np.full((30, 24), 100.0) 
    
    # Add a trend to specific 'impact' sensors (T24, Nf)
    # T24 is usually index 3 or 4 in CMAPSS-like datasets
    base_data[:, 3] = np.linspace(150, 150 * scale_factor, 30) 
    
    if noise:
        base_data += np.random.normal(0, 1, (30, 24))
        
    return base_data.tolist()

def run_test(name, scale):
    payload = {
        "engineId": f"STRESS_TEST_{name}",
        "data_window": generate_window(scale_factor=scale)
    }
    
    try:
        response = requests.post(BASE_URL, json=payload)
        response.raise_for_status()
        data = response.json()
        print(f"[{name:.<12}] RUL: {data['predicted_rul']:>6} | Status: {data['status']}")
    except Exception as e:
        print(f"[{name:.<12}] FAILED: {e}")

if __name__ == "__main__":
    print("🚀 Starting LSTM Sensitivity Stress Test...\n")
    
    # Scenario 1: Nominal (Healthy)
    run_test("NOMINAL", 1.0)
    
    # Scenario 2: Moderate Degradation (15% increase in heat/friction)
    run_test("DEGRADED", 1.15)
    
    # Scenario 3: Near Failure (40% increase in stress)
    run_test("NEAR_FAILURE", 1.4)
    
    # Scenario 4: Extreme (Saturation Check)
    run_test("EXTREME", 5.0)

    print("\n💡 Analysis: If RUL is the same for all tests, check your Scaling logic.")