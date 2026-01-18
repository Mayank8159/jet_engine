export async function predictRUL(dataWindow: number[][], engineId?: string) {
  const response = await fetch("https://jet-engine.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: dataWindow }), // Matches main.py schema
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.detail || "Prediction failed");
  }

  return response.json();
}