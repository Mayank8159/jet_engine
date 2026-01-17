"use client"

import { Database, FileJson, Trash2, CheckCircle2, AlertCircle } from "lucide-react"

interface Props {
  raw: string
  setRaw: (v: string) => void
}

export default function SensorTextarea({ raw, setRaw }: Props) {
  // Parsing logic for real-time stats
  const rows = raw.trim() ? raw.trim().split("\n") : []
  const rowCount = rows.length
  const colCount = rows[0] ? rows[0].split(",").length : 0
  
  const isValid = rowCount === 30 && colCount === 24

  const fillDemoData = () => {
    const rowsArr = 30
    const colsArr = 24
    const csv = Array.from({ length: rowsArr }, () =>
      Array.from({ length: colsArr }, () =>
        (Math.random() * 400 + 10).toFixed(2)
      ).join(",")
    ).join("\n")
    setRaw(csv)
  }

  return (
    <div className="w-full group">
      {/* Terminal Header/Toolbar */}
      <div className="flex flex-wrap mt-4 items-center justify-between gap-4 mb-3 px-1">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Telemetry Input Buffer
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fillDemoData}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-all"
          >
            <FileJson size={14} />
            Generate Sample
          </button>
          
          <button
            type="button"
            onClick={() => setRaw("")}
            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
            title="Clear Buffer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className="relative rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden focus-within:border-blue-500/50 transition-colors">
        <textarea
          rows={12}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Paste CSV telemetry (30x24 sensor matrix)..."
          className="w-full p-4 bg-transparent text-blue-100 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-gray-600 custom-scrollbar"
        />

        {/* Real-time Status Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-t border-white/5 font-mono text-[10px] uppercase tracking-tighter">
          <div className="flex gap-4">
            <span className={rowCount === 30 ? "text-emerald-400" : "text-gray-500"}>
              Rows: <span className="font-bold">{rowCount}</span> / 30
            </span>
            <span className={colCount === 24 ? "text-emerald-400" : "text-gray-500"}>
              Sensors: <span className="font-bold">{colCount}</span> / 24
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isValid ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 size={12} /> Buffer Ready
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-500/70">
                <AlertCircle size={12} /> Payload Mismatch
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-gray-500 italic px-1">
        * Standard operational window requires a 30-cycle lookback across 24 sensor channels.
      </p>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}