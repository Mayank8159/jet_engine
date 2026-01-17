// utils/mockData.ts

/**
 * Generates a raw 30x24 matrix of sensor data for a single engine.
 * This matches the shape expected by the LSTM model (TIME_STEPS, NUM_FEATURES).
 */
export const generateSampleTelemetry = (wearFactor: number = 0.5) => {
  const rows = 30; // TIME_STEPS
  const cols = 24; // NUM_FEATURES
  
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => {
      // Logic: wearFactor (0 to 1) pushes values higher
      // This ensures the model returns different RULs for different engines
      const baseValue = 0.2 + (wearFactor * 0.6);
      const noise = Math.random() * 0.1;
      return parseFloat((baseValue + noise).toFixed(4));
    })
  );
};

/**
 * Generates the initial shell of the fleet.
 * 'data' is undefined initially to trigger the "Syncing..." UI state.
 */
export const generateDemoFleet = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    engineId: `ENG-${1001 + i}`,
    data: undefined, // Will be populated by the fetch call in page.tsx
  }));
};