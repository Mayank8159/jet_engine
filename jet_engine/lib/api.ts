import { PredictionResult } from "@/types/prediction"

interface PredictRULRequest {
  engineId?: string
  data_window: number[][]
}

/** 🔒 Converts null / undefined / NaN → 0 */
function sanitizeWindow(window: any[][]): number[][] {
  return window.map(row =>
    row.map(value => {
      const num = Number(value)
      return Number.isFinite(num) ? num : 0
    })
  )
}

export async function predictRUL(
  dataWindow: any[][],
  engineId?: string
): Promise<PredictionResult> {

  // ✅ sanitize BEFORE sending
  const safeWindow = sanitizeWindow(dataWindow)

  const body: PredictRULRequest = {
    data_window: safeWindow,
    ...(engineId && { engineId }),
  }

  console.log("🚀 Sending payload:", body) // DEBUG (remove later)

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
