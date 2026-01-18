"use client"

import { useState, useEffect } from "react"
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
  const [error, setError] = useState<string | null>(null)

  // Clear error after 5 seconds automatically
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handlePredict = async () => {
    setError(null); // Reset alerts
    if (!sensorData.trim()) {
      setError("DATA INPUT REQUIRED: NO TELEMETRY DETECTED");
      return;
    }
    
    setLoading(true);
    try {
      const dataWindow = parseSensorCSV(sensorData);
      
      if (dataWindow.length !== 30) {
        throw new Error(`SEQUENCE ERROR: EXPECTED 30 TIME-STEPS, RECEIVED ${dataWindow.length}`);
      }

      const result = await predictRUL(dataWindow, engineId || undefined);
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || "SYSTEM FAILURE: API UNREACHABLE");
    } finally {
      setLoading(false);
    }
  };

  const needleRotation = prediction ? (prediction.health_percent * 1.8) - 90 : -90;

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative">
      
      {/* --- MASTER CAUTION ALERT SYSTEM --- */}
      {error && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xl">
          <div className="bg-black/90 border-2 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] rounded-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-red-600 px-4 py-1 flex justify-between items-center">
              <span className="text-[10px] font-black text-white italic tracking-tighter italic">MASTER WARNING</span>
              <button onClick={() => setError(null)} className="text-white text-xs">✕</button>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="bg-red-600/20 p-2 rounded-full">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-red-500 font-mono text-sm font-bold tracking-tighter uppercase">Inference Fault Detected</h3>
                <p className="text-white/80 text-xs font-mono mt-1">{error}</p>
              </div>
            </div>
            <div className="h-1 bg-red-600/30 w-full">
              <div className="h-full bg-red-600 animate-[shrink_5s_linear_forwards]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      <GlassCard>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tighter text-white uppercase italic">
            Aero<span className="text-cyan-500">Guard</span> Terminal
          </h1>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded border border-cyan-500/30 bg-cyan-500/5">
              <span className="text-[10px] font-mono text-cyan-400">STATUS: {loading ? 'SCANNING...' : 'READY'}</span>
            </div>
          </div>
        </div>

        <EngineInput engineId={engineId} setEngineId={setEngineId} />
        <SensorTextarea raw={sensorData} setRaw={setSensorData} />

        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-black uppercase tracking-widest shadow-lg shadow-cyan-900/20 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {loading ? "PROCESSING..." : "RUN DIAGNOSTIC"}
        </button>
      </GlassCard>

      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* CORE HEALTH GAUGE */}
          <GlassCard className="lg:col-span-4 flex flex-col items-center justify-center min-h-[350px] relative">
            <div className="absolute top-4 left-4 flex gap-1">
               <div className={`h-1.5 w-4 rounded-sm ${prediction.status === 'Healthy' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-green-900'}`} />
               <div className={`h-1.5 w-4 rounded-sm ${prediction.status === 'Warning' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' : 'bg-yellow-900'}`} />
               <div className={`h-1.5 w-4 rounded-sm ${prediction.status === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-red-900'}`} />
            </div>
            
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-8">Core Engine Health</p>
            
            <div className="relative w-64 h-32 overflow-hidden">
              <div className="absolute top-0 w-64 h-64 rounded-full border-[16px] border-white/5" />
              <svg className="absolute top-0 w-64 h-64 -rotate-90">
                <circle cx="128" cy="128" r="112" fill="transparent" stroke="url(#gaugeGradient)" strokeWidth="16" strokeDasharray="351.8" strokeDashoffset="0" />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 left-1/2 w-1.5 h-28 bg-white origin-bottom rounded-full transition-all duration-1000 shadow-[0_0_10px_white]"
                style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }} />
            </div>

            <div className="text-center -mt-4 z-10">
              <span className="text-5xl font-black text-white tracking-tighter">{prediction.health_percent}%</span>
              <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${
                prediction.status === 'Healthy' ? 'text-green-400' : prediction.status === 'Warning' ? 'text-yellow-400' : 'text-red-500'
              }`}>
                {prediction.status} System
              </p>
            </div>
          </GlassCard>

          {/* DATA CONTENT */}
          <GlassCard className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2 italic">Remaining Useful Life</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-cyan-400">{prediction.predicted_rul}</span>
                  <span className="text-xl text-gray-500 font-mono">CYC</span>
                </div>
              </div>
              <div className={`p-4 rounded-2xl border flex flex-col justify-center transition-colors ${
                prediction.status === 'Healthy' ? 'bg-white/5 border-white/10' : 'bg-red-500/10 border-red-500/30'
              }`}>
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2 italic">Action Required</p>
                <p className={`text-sm font-bold ${prediction.status === 'Healthy' ? 'text-white' : 'text-red-400'}`}>
                   {prediction.status !== 'Healthy' ? '⚠️ ' : ''}{prediction.maintenance_action}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-gray-500 font-bold uppercase mb-4 tracking-tighter italic">Degradation Profile // {engineId || 'ID_NULL'}</p>
            <div className="h-40 w-full">
              <MiniRULChart rulHistory={prediction.rul_history || []} />
            </div>
          </GlassCard>

          {/* SENSOR IMPACTS */}
          <GlassCard className="lg:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {prediction.top_sensors?.map((s, i) => (
                <div key={i} className="space-y-3 p-4 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono text-cyan-500/70">CH_{s.sensor}</span>
                    <span className="text-sm font-black text-white italic">{(s.impact * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${s.impact * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tailwind helper for the shrink animation */}
      <style jsx global>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}