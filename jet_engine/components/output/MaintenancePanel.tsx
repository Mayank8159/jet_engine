import { PredictionResult } from "@/types/prediction"

export default function MaintenancePanel({ data }: { data: PredictionResult }) {
  return (
    <div className="space-y-2 mt-4">
      <p className="font-semibold">{data.maintenance_action}</p>
      <p className="text-sm opacity-80">
        Failure Window: {data.time_to_failure.min} – {data.time_to_failure.max} cycles
      </p>
    </div>
  )
}
