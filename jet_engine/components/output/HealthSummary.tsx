import { PredictionResult } from "@/types/prediction"

export default function HealthSummary({ data }: { data: PredictionResult }) {
  return (
    <div className="text-center space-y-2">
      <h2 className="text-3xl font-bold">{data.status}</h2>
      <p className="text-xl">{data.health_percent}% Health</p>
      <p className="opacity-80">Grade {data.health_grade}</p>
    </div>
  )
}
