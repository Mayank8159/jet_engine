"use client"

import { useState } from "react"
import GlassCard from "../layout/GlassCard"
import MiniRULChart from "../charts/MiniRULChart"
import EngineInput from "../input/EngineInput"
import SensorTextarea from "../input/SensorTextarea"
import { predictRUL } from "@/lib/api"
import { PredictionResult } from "@/types/prediction"
import { parseSensorCSV } from "@/utils/parseCSV"

export default function SingleEngine() {
  const [engineId, setEngineId] = useState("")
  const [sensorData, setSensorData] = useState("")
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    if (!sensorData.trim()) {
      alert("Please enter sensor data (30×24)")
      return
    }

    setLoading(true)

    try {
      // ✅ CORRECT PARSING (FIXES 30×1 BUG)
      const dataWindow = parseSensorCSV(sensorData)

      console.log("Parsed shape:", dataWindow.length, dataWindow[0].length)

      const result = await predictRUL(dataWindow, engineId || undefined)
      setPrediction(result)
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Prediction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard>
        <h1 className="text-2xl font-bold mb-4">
          Single Engine Predictive Dashboard
        </h1>

        <EngineInput engineId={engineId} setEngineId={setEngineId} />
        <SensorTextarea raw={sensorData} setRaw={setSensorData} />

        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold hover:scale-105 transition-transform duration-200"
        >
          {loading ? "Analyzing..." : "🚀 Predict RUL"}
        </button>
      </GlassCard>

      {prediction && (
        <GlassCard>
          <h2 className="text-xl font-bold mb-2">
            Engine: {engineId || "Unknown"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                Remaining Useful Life (RUL)
              </p>
              <p className="text-3xl font-bold">
                {prediction.predicted_rul} cycles
              </p>

              <p className="text-sm text-gray-300 mt-2">Health</p>
              <p className="text-xl font-semibold">
                {prediction.health_percent}%
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  prediction.status === "Healthy"
                    ? "bg-green-100 text-green-800"
                    : prediction.status === "Warning"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {prediction.status}
              </span>

              {prediction.status !== "Healthy" && (
                <div className="mt-2 p-2 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
                  ⚠️ {prediction.maintenance_action}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-1">
                Degradation Trend
              </p>
              <MiniRULChart rulHistory={prediction.rul_history} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <p>Risk Score</p>
              <p className="font-semibold">{prediction.risk_score}</p>
            </div>
            <div>
              <p>Confidence</p>
              <p className="font-semibold">{prediction.confidence}</p>
            </div>
            <div>
              <p>Health Grade</p>
              <p className="font-semibold">{prediction.health_grade}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-300 mb-1">
              Top Sensor Impacts
            </p>
            <ul className="list-disc list-inside">
              {prediction.top_sensors.map((s, i) => (
                <li key={i}>
                  {s.sensor}: {Math.round(s.impact * 100)}%
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
