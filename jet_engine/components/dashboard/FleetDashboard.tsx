"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, AlertOctagon, Activity, Gauge, Clock, Loader2 } from "lucide-react"
import GlassCard from "../layout/GlassCard"
import MiniRULChart from "../charts/MiniRULChart"
import { PredictionResult } from "@/types/prediction"

interface Props {
  fleet: { engineId: string; data?: PredictionResult }[]
}

export default function FleetDashboard({ fleet }: Props) {
  const [mounted, setMounted] = useState(false)

  // Fix for Hydration Mismatch: Ensure component only renders 
  // interactive parts after mounting on the client.
  useEffect(() => {
    setMounted(true)
  }, [])

  // Safely calculate counts for the summary header
  const criticalCount = fleet.filter(e => e.data?.status === "Critical").length;
  const warningCount = fleet.filter(e => e.data?.status === "Warning").length;

  if (!mounted) return null; // Prevent hydration flash

  if (!fleet || fleet.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-white/10 rounded-xl">
        <p className="text-gray-500 animate-pulse font-mono">Initializing fleet telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fleet Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Fleet Operations</h2>
          <p className="text-sm text-gray-500">Monitoring {fleet.length} active propulsion units</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-md">
            <span className="text-[10px] block uppercase font-bold text-rose-400">Critical</span>
            <span className="text-lg font-mono font-bold text-white">{criticalCount}</span>
          </div>
          <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md">
            <span className="text-[10px] block uppercase font-bold text-amber-400">Warning</span>
            <span className="text-lg font-mono font-bold text-white">{warningCount}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {fleet.map((engine, index) => {
          // Unique key priority: engineId > index
          const cardKey = engine.engineId || `engine-idx-${index}`;
          const { data, engineId } = engine;

          // State 1: Data is still loading for this engine
          if (!data) {
            return (
              <GlassCard key={cardKey} className="flex flex-col items-center justify-center h-80 opacity-60">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-3" />
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                  Syncing {engineId}...
                </p>
              </GlassCard>
            );
          }

          // State 2: Data loaded successfully
          const isCritical = data.status === "Critical";
          const isWarning = data.status === "Warning";

          return (
            <GlassCard 
              key={cardKey} 
              className={`relative overflow-hidden group transition-all duration-300 hover:border-white/30 ${
                isCritical ? "border-l-4 border-l-rose-500" : 
                isWarning ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-emerald-500"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isCritical ? "bg-rose-500/10" : "bg-blue-500/10"}`}>
                    <Activity className={`w-4 h-4 ${isCritical ? "text-rose-400" : "text-blue-400"}`} />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-white tracking-wider">{engineId}</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-tighter">MTU-Series 4000</p>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-white transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Vital Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Gauge size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Health Index</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-white">{data.health_percent}</span>
                    <span className="text-xs text-gray-600 pb-1">%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Est. RUL</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-white">{data.predicted_rul}</span>
                    <span className="text-xs text-gray-600 pb-1">CYC</span>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-gray-500">
                  <span>Degradation Trend</span>
                  <span className={isCritical ? "text-rose-400" : "text-emerald-400"}>
                    {isCritical ? "Rapid Decay" : "Stable"}
                  </span>
                </div>
                <div className="h-24 w-full bg-black/20 rounded-lg p-2">
                  <MiniRULChart rulHistory={data.rul_history} />
                </div>
              </div>

              {/* Status Footer */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isCritical ? "text-rose-400 bg-rose-400/10" : 
                  isWarning ? "text-amber-400 bg-amber-400/10" : "text-emerald-400 bg-emerald-400/10"
                }`}>
                  {isCritical && <AlertOctagon size={10} />}
                  {data.status}
                </div>
                <span className="text-[10px] text-gray-600 font-mono italic">
                  Last Sync: 1m ago
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}