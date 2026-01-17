"use client"
import { useState } from "react"
import SingleEngine from "@/components/dashboard/SingleEngine"
import FleetDashboard from "@/components/dashboard/FleetDashboard"
import { PredictionResult } from "@/types/prediction"

// -------------------
// Helper: Safe Status
// -------------------
const statuses = ["Healthy", "Warning", "Critical"] as const
type Status = (typeof statuses)[number]
function randomStatus(): Status {
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// -------------------
// Demo fleet generator
// -------------------
const generateDemoFleet = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    engineId: `ENG_${i + 1}`,
    data: {
      predicted_rul: Math.floor(Math.random() * 125),
      health_percent: Math.floor(Math.random() * 100),
      health_grade: "A",
      status: randomStatus(),
      risk_score: Math.random(),
      confidence: Math.random(),
      maintenance_action: "Check Soon",
      time_to_failure: { min: 10, max: 50 },
      maintenance_cost: { preventive: 12000, reactive: 48000, savings: 36000 },
      top_sensors: [
        { sensor: "T24", impact: 0.3 },
        { sensor: "Nf", impact: 0.2 },
      ],
      rul_history: Array.from({ length: 10 }, () => Math.floor(Math.random() * 125)),
    } as PredictionResult,
  }))

// -------------------
// Page Component
// -------------------
export default function Page() {
  const [fleet, setFleet] = useState(generateDemoFleet(6))
  const [showFleet, setShowFleet] = useState(false)

  return (
    <main className="relative min-h-screen p-6 text-white flex flex-col gap-6">
      {/* Background Image + Blur Overlay */}
      <div className="absolute inset-0">
        <img
          src="/bgmain.jpg" // replace with your image path
          alt="Jet Engine Background"
          className="w-full h-full object-cover brightness-90 blur-sm"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Jet Engine Predictive Dashboard</h1>

        <button
          onClick={() => setShowFleet(!showFleet)}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold hover:scale-105 transition-transform w-full md:w-auto"
        >
          {showFleet ? "Show Single Engine View" : "Show Fleet View"}
        </button>

        <div className="w-full">
          {showFleet ? (
            <FleetDashboard fleet={fleet} />
          ) : (
            <SingleEngine />
          )}
        </div>
      </div>
    </main>
  )
}
