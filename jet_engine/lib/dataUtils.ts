/**
 * Transforms raw textarea string into a strictly validated 30x24 numerical matrix.
 */
export function parseSensorCSV(raw: string): number[][] {
  const lines = raw.trim().split("\n").filter(line => line.trim() !== "");
  
  if (lines.length !== 30) {
    throw new Error(`Invalid Cycle Count: Expected 30, found ${lines.length}`);
  }

  return lines.map((line, rowIndex) => {
    const values = line.split(",")
      .map(v => v.trim())
      .filter(v => v !== "");

    if (values.length !== 24) {
      throw new Error(`Cycle ${rowIndex + 1} Error: Expected 24 sensors, found ${values.length}`);
    }

    return values.map(v => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 0; // Sanitize NaN/Infinity to 0
    });
  });
}