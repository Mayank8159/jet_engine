import axios from "axios";
import { PredictionResponse } from "../types/rul";

const API_URL = "http://127.0.0.1:8000";

export async function getRULPrediction(
  window: number[][]
): Promise<PredictionResponse> {
  const response = await axios.post(`${API_URL}/predict`, {
    data_window: window,
  });

  return response.data;
}
