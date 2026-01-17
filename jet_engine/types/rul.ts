export interface PredictionResponse {
  predicted_rul: number;
  status: "Healthy" | "Critical";
}
