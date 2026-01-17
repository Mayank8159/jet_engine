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
      // ✅ Parses text and cleans up whitespace/empty lines
      const dataWindow = parseSensorCSV(sensorData)

      console.log("Parsed shape:", dataWindow.length, dataWindow[0]?.length)

      if (dataWindow.length !== 30 || dataWindow[0]?.length !== 24) {
        throw new Error(`Invalid Shape: Got ${dataWindow.length}x${dataWindow[0]?.length}. Need 30x24.`);
      }

      const result = await predictRUL(dataWindow, engineId || undefined)
      setPrediction(result)
    } catch (err: any) {
      console.error("Prediction Error:", err)
      // If backend returns a [object Object], this extracts the message
      const msg = typeof err.message === 'object' ? JSON.stringify(err.message) : err.message;
      alert(msg || "Prediction failed. Check backend logs.");
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
          className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Analyzing Telemetry..." : "Predict RUL"}
        </button>
      </GlassCard>

      {prediction && (
        <GlassCard>
          <h2 className="text-xl font-bold mb-4">
            Analysis Results: {engineId || "System Default"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: RUL & Health */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Remaining Useful Life (RUL)</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  {prediction.predicted_rul} <span className="text-lg font-normal text-gray-500">cycles</span>
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Health Index</p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-semibold">{prediction.health_percent}%</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      prediction.status === "Healthy"
                        ? "bg-green-500/20 text-green-400 border border-green-500/50"
                        : prediction.status === "Warning"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                        : "bg-red-500/20 text-red-400 border border-red-500/50"
                    }`}
                  >
                    {prediction.status}
                  </span>
                </div>
              </div>

              {prediction.status !== "Healthy" && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2 items-start">
                  <span>⚠️</span>
                  <span>{prediction.maintenance_action || "Inspection recommended."}</span>
                </div>
              )}
            </div>

            {/* Right Column: Chart */}
            <div>
              <p className="text-sm text-gray-400 mb-2">Degradation Trend</p>
              <div className="h-32 w-full">
                <MiniRULChart rulHistory={prediction.rul_history || []} />
              </div>
            </div>
          </div>

          <hr className="my-6 border-white/10" />

          {/* Metrics Footer */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-[10px] uppercase text-gray-500">Risk Score</p>
              <p className="font-mono font-bold text-white">{prediction.risk_score || "0.0"}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-[10px] uppercase text-gray-500">Confidence</p>
              <p className="font-mono font-bold text-white">{prediction.confidence || "N/A"}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-[10px] uppercase text-gray-500">Grade</p>
              <p className="font-mono font-bold text-white">{prediction.health_grade || "-"}</p>
            </div>
          </div>

          {/* Sensor Impact List */}
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-3 font-medium">Top Contributing Factors</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(prediction.top_sensors || []).map((s, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded bg-black/20 border border-white/5">
                  <span className="text-xs text-blue-400 font-bold">{s.sensor}</span>
                  <span className="text-xs text-white">{(s.impact * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}