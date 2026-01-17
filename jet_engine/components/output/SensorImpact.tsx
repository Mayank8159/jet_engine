import { PredictionResult } from "@/types/prediction"

export default function SensorImpact({ data }: { data: PredictionResult }) {
  return (
    <div className="space-y-2 mt-4">
      {data.top_sensors.map((s) => (
        <div key={s.sensor} className="flex justify-between">
          <span>{s.sensor}</span>
          <span>{Math.round(s.impact * 100)}%</span>
        </div>
      ))}
    </div>
  )
}
