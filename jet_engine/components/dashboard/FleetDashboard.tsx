"use client"
import GlassCard from "../layout/GlassCard"
import MiniRULChart from "../charts/MiniRULChart"
import { PredictionResult } from "@/types/prediction"

interface Props {
  fleet: { engineId: string; data: PredictionResult }[]
}

export default function FleetDashboard({ fleet }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fleet.map((engine) => {
        const data = engine.data
        const statusColor =
          data.status === "Healthy"
            ? "bg-green-100 text-green-800"
            : data.status === "Warning"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"

        return (
          <GlassCard key={engine.engineId}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{engine.engineId}</h3>
              <span className={`px-2 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
                {data.status}
              </span>
            </div>
            <p className="text-sm">Health: {data.health_percent}%</p>
            <p className="text-sm">RUL: {data.predicted_rul} cycles</p>
            <MiniRULChart rulHistory={data.rul_history} />
          </GlassCard>
        )
      })}
    </div>
  )
}
