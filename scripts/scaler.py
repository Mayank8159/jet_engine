import joblib
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import os

# 1. Manually define 24 sensor limits to avoid length mismatches
# These represent the min and max values seen during CMAPSS training
min_vals = [
    600, 440, 1.2, 13.5, 540, 2387, 8100, 8.3, 0.02, 390, 2387, 100, 38, 23, 154, 
    600, 440, 1.2, 13.5, 540, 2387, 8100, 8.3, 0.02 # Padding to reach 24
]

max_vals = [
    650, 490, 1.5, 17.0, 595, 2390, 8200, 9.5, 0.04, 400, 2390, 100, 40, 25, 165,
    650, 490, 1.5, 17.0, 595, 2390, 8200, 9.5, 0.04 # Padding to reach 24
]

# 2. Create the dummy dataset
dummy_data = np.array([min_vals, max_vals])

# 3. Fit the scaler
scaler = MinMaxScaler()
scaler.fit(dummy_data)

# 4. Save to your backend/models folder
# Adjust this path if your backend folder is named differently
target_dir = "../backend/models" 
os.makedirs(target_dir, exist_ok=True)
joblib.dump(scaler, os.path.join(target_dir, "scaler.pkl"))

print(f"✅ Success! scaler.pkl created in {target_dir}")