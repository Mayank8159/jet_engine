"use client"

import { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  intensity?: "low" | "medium" | "high"
}

export default function GlassCard({ 
  children, 
  className = "", 
  intensity = "medium" 
}: GlassCardProps) {
  
  // Define intensity levels as standard strings
  const blurLevels = {
    low: "backdrop-blur-md bg-white/5",
    medium: "backdrop-blur-xl bg-white/[0.08]",
    high: "backdrop-blur-2xl bg-white/[0.12]"
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-6 transition-all duration-300
        saturate-[1.8] contrast-[1.1]
        border border-white/10 border-t-white/20 border-l-white/20
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:bg-white/[0.10]
        ${blurLevels[intensity]}
        ${className}
      `}
    >
      {/* Decorative "Inner Glow" Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.05] to-transparent opacity-50" />
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}