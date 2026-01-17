export interface PredictionResult {
  predicted_rul: number
  health_percent: number
  health_grade: string
  status: "Healthy" | "Warning" | "Critical"
  risk_score: number
  confidence: number
  maintenance_action: string
  time_to_failure: {
    min: number
    max: number
  }
  maintenance_cost: {
    preventive: number
    reactive: number
    savings: number
  }
  top_sensors: {
    sensor: string
    impact: number
  }[]
  rul_history: number[]
}
