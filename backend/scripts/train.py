import os
import sys
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

# =============================
# CONFIG
# =============================
SEQ_LEN = 30
EPOCHS = 20
BATCH_SIZE = 64

TRAIN_PATH = "../data/train_FD001.txt"
TEST_PATH = "../data/test_FD001.txt"
RUL_PATH = "../data/RUL_FD001.txt"
MODEL_PATH = "../models/lstm_rul_model.h5"

# =============================
# MAIN
# =============================
def main():
    print("🔥 train.py started")
    print("Python:", sys.version)
    print("TensorFlow:", tf.__version__)

    # ---------- FILE CHECK ----------
    for path in [TRAIN_PATH, TEST_PATH, RUL_PATH]:
        if not os.path.exists(path):
            raise FileNotFoundError(f"❌ File not found: {path}")

    # ---------- LOAD TRAIN ----------
    print("📂 Loading training data...")
    train = pd.read_csv(TRAIN_PATH, sep=" ", header=None)
    train = train.drop([26, 27], axis=1)
    train.columns = ["id","cycle"] + \
        [f"op_setting{i}" for i in range(1,4)] + \
        [f"sensor{i}" for i in range(1,22)]

    # ---------- NORMALIZE ----------
    print("🔄 Normalizing features...")
    scaler = MinMaxScaler()
    features = train.columns[2:]
    train[features] = scaler.fit_transform(train[features].astype(float))

    # ---------- SEQUENCES ----------
    print("🔁 Generating sequences...")
    X_train, y_train = [], []

    for eid in train['id'].unique():
        df = train[train['id'] == eid]
        rul = df['cycle'].max() - df['cycle']
        data = df[features].values

        for i in range(len(data) - SEQ_LEN):
            X_train.append(data[i:i+SEQ_LEN])
            y_train.append(rul.iloc[i+SEQ_LEN])

    X_train = np.array(X_train)
    y_train = np.array(y_train)

    print("✅ Training samples:", X_train.shape)

    # ---------- MODEL ----------
    print("🧠 Building LSTM model...")
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(SEQ_LEN, len(features))),
        Dropout(0.2),
        LSTM(32),
        Dense(1)
    ])

    model.compile(optimizer="adam", loss="mse")
    model.summary()

    # ---------- TRAIN ----------
    print("🚀 Training started...")
    model.fit(
        X_train, y_train,
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        validation_split=0.2,
        verbose=1
    )

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    model.save(MODEL_PATH)
    print(f"💾 Model saved to {MODEL_PATH}")

    # ---------- TEST ----------
    print("📊 Running inference...")
    test = pd.read_csv(TEST_PATH, sep=" ", header=None)
    test = test.drop([26, 27], axis=1)
    test.columns = train.columns
    test[features] = scaler.transform(test[features].astype(float))

    true_rul = pd.read_csv(RUL_PATH, header=None)[0]

    X_test = []
    for eid in test['id'].unique():
        df = test[test['id'] == eid]
        X_test.append(df[features].values[-SEQ_LEN:])

    X_test = np.array(X_test)
    preds = model.predict(X_test).flatten()

    # ---------- HEALTH SCORE ----------
    def health_score(rul, max_rul=130):
        return max(0, min(100, (rul / max_rul) * 100))

    for i, (p, t) in enumerate(zip(preds, true_rul)):
        print(f"Engine {i+1:03d} | Pred RUL={p:.1f} | True RUL={t} | Health={health_score(p):.1f}%")

    print("🎉 Training & evaluation completed successfully")

# =============================
# ENTRY POINT
# =============================
if __name__ == "__main__":
    main()
