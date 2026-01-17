"use client"

import { Zap, Loader2 } from "lucide-react"

interface Props {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
}

export default function PredictButton({ 
  onClick, 
  isLoading = false, 
  disabled = false 
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        relative w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm
        transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden
        ${isLoading || disabled 
          ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5" 
          : "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-[0.98] border-t border-white/20"
        }
      `}
    >
      {/* Shimmer Effect Overlay */}
      {!isLoading && !disabled && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      )}

      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing Telemetry...</span>
        </>
      ) : (
        <>
          <Zap className={`w-5 h-5 ${disabled ? 'text-gray-500' : 'text-cyan-200'}`} />
          <span>Execute RUL Analysis</span>
        </>
      )}

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </button>
  )
}