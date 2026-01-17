// utils/mockData.ts
import { PredictionResult } from "@/types/prediction"

const statuses = ["Healthy", "Warning", "Critical"] as const
type Status = (typeof statuses)[number]

const randomStatus = (): Status => statuses[Math.floor(Math.random() * statuses.length)]

export const generateDemoFleet = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    engineId: `ENG_${String(i + 1).padStart(3, '0')}`,
    data: {
      predicted_rul: Math.floor(Math.random() * 125),
      health_percent: Math.floor(Math.random() * 100),
      health_grade: "A",
      status: randomStatus(),
      risk_score: parseFloat(Math.random().toFixed(2)),
      confidence: parseFloat(Math.random().toFixed(2)),
      maintenance_action: "Routine Inspection Required",
      time_to_failure: { min: 10, max: 50 },
      maintenance_cost: { preventive: 12000, reactive: 48000, savings: 36000 },
      top_sensors: [
        { sensor: "T24", impact: 0.3 },
        { sensor: "Nf", impact: 0.2 },
      ],
      rul_history: Array.from({ length: 15 }, () => Math.floor(Math.random() * 125)).sort((a, b) => b - a),
    } as PredictionResult,
  }))