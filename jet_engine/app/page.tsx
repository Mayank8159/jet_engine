"use client"

import { useState, useEffect } from "react"
import { Activity, Users, ShieldCheck } from "lucide-react"
import SingleEngine from "@/components/dashboard/SingleEngine"
import FleetDashboard from "@/components/dashboard/FleetDashboard"
import { generateDemoFleet } from "@/utils/mockData" // Import from utils

export default function Page() {
  // Use a null or empty state initially to prevent SSR/Hydration mismatch errors
  const [fleet, setFleet] = useState<any[]>([])
  const [showFleet, setShowFleet] = useState(false)

  // Standard Industry Pattern: Generate data on mount
  useEffect(() => {
    setFleet(generateDemoFleet(6))
  }, [])

  return (
    <main className="relative min-h-screen w-full bg-[#050507] text-slate-200 font-sans">
      {/* BACKGROUND SYSTEM */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#050507]" />
        <div 
          className="absolute inset-0 opacity-[0.1]" 
          style={{ 
            backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050507_90%)]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto p-6 space-y-8">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <ShieldCheck size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Propulsion Intelligence Terminal</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">
              Aero<span className="text-blue-500">Guard</span> Dashboard
            </h1>
          </div>

          {/* VIEW SWITCHER */}
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
            <button
              onClick={() => setShowFleet(false)}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                !showFleet ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
              }`}
            >
              DIAGNOSTICS
            </button>
            <button
              onClick={() => setShowFleet(true)}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                showFleet ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
              }`}
            >
              FLEET VIEW
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <section className="min-h-[60vh]">
          {showFleet ? (
            <FleetDashboard fleet={fleet} />
          ) : (
            <SingleEngine />
          )}
        </section>

        {/* FOOTER */}
        <footer className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-600 font-mono uppercase tracking-widest">
          <span>&copy; 2026 AeroGuard Dynamics</span>
          <span>System Status: <span className="text-emerald-500">Optimal</span></span>
        </footer>
      </div>
    </main>
  )
}