export const parseSensorCSV = (text: string): number[][] => {
  return text
    .trim()
    .split("\n")
    .filter(line => line.trim() !== "") // Removes empty lines that cause 422
    .map((line) => {
      const parts = line.split(",").filter(v => v.trim() !== ""); // Ignore trailing commas
      return parts.map(v => {
        const n = parseFloat(v.trim());
        return isNaN(n) ? 0 : n;
      });
    });
};