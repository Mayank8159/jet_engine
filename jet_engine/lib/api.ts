import { PredictionResult } from "@/types/prediction"

interface PredictRULRequest {
  engineId?: string
  data_window: number[][]
}

export async function predictRUL(
  dataWindow: number[][],
  engineId?: string
): Promise<PredictionResult> {
  const body: PredictRULRequest = { data_window: dataWindow }
  if (engineId) body.engineId = engineId

  const res = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Prediction failed: ${errText}`)
  }

  return res.json()
}
