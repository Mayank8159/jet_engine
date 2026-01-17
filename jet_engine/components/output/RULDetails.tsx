import { PredictionResult } from "@/types/prediction"

export default function RULDetails({ data }: { data: PredictionResult }) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
      <div>Predicted RUL</div>
      <div className="font-bold">{data.predicted_rul} cycles</div>

      <div>Risk Score</div>
      <div className="font-bold">{data.risk_score}</div>

      <div>Confidence</div>
      <div className="font-bold">{Math.round(data.confidence * 100)}%</div>
    </div>
  )
}
