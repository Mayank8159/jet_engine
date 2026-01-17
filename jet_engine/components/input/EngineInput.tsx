"use client"

import { Cpu, Search, Hash } from "lucide-react"

interface Props {
  engineId: string
  setEngineId: (v: string) => void
}

export default function EngineInput({ engineId, setEngineId }: Props) {
  return (
    <div className="w-full group">
      {/* Field Label with Icon */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <Cpu className="w-4 h-4 text-blue-400" />
        <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
          Asset Serial Number
        </label>
      </div>

      <div className="relative flex items-center">
        {/* Left Icon Accessory */}
        <div className="absolute left-4 text-gray-500 group-focus-within:text-blue-400 transition-colors">
          <Hash size={18} />
        </div>

        {/* The Input */}
        <input
          type="text"
          value={engineId}
          onChange={(e) => setEngineId(e.target.value.toUpperCase())} // Auto-uppercase for industrial IDs
          placeholder="E.G. UNIT-0982-A"
          className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 text-white border border-white/10 
                     font-mono text-sm tracking-widest placeholder:text-gray-600 placeholder:font-sans
                     focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 
                     hover:border-white/20 transition-all duration-200"
        />

        {/* Right Indicator (Visual Polish) */}
        <div className="absolute right-4">
          <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] transition-all duration-500 ${
            engineId.length > 3 
              ? "bg-emerald-500 shadow-emerald-500/50" 
              : "bg-gray-700 shadow-transparent"
          }`} />
        </div>
      </div>

      {/* Helper Footer */}
      <div className="flex justify-between items-center mt-2 px-1">
        <p className="text-[10px] text-gray-500 font-medium italic">
          Fleet Registry: Global_Aviation_North
        </p>
        {engineId && (
          <span className="text-[10px] text-blue-400/80 font-mono animate-pulse">
            Ready for Analysis
          </span>
        )}
      </div>
    </div>
  )
}