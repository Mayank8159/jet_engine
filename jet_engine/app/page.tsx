"use client";

import React, { useState } from "react";
import { getRULPrediction } from "../services/rulService";
import { PredictionResponse } from "../types/rul";

const SEQ_LEN = 30;
const NUM_FEATURES = 24; // 🔥 MUST MATCH TRAINING

function generateWindow(): number[][] {
  return Array.from({ length: SEQ_LEN }, () =>
    Array.from({ length: NUM_FEATURES }, () =>
      Number(Math.random().toFixed(4))
    )
  );
}

export default function RulDashboard() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const window = generateWindow();
      const result = await getRULPrediction(window);
      setPrediction(result);
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Check backend logs.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">
        Jet Engine Remaining Useful Life
      </h1>

      <button
        onClick={handlePredict}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Analyzing..." : "Predict RUL"}
      </button>

      {prediction && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Predicted RUL</p>
          <p className="text-4xl font-bold">
            {prediction.predicted_rul} cycles
          </p>

          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
              prediction.status === "Healthy"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {prediction.status}
          </span>
        </div>
      )}
    </div>
  );
}
