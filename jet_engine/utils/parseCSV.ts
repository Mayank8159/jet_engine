export function parseSensorCSV(
  raw: string,
  rows = 30,
  cols = 24
): number[][] {
  const lines = raw
    .trim()
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)

  if (lines.length !== rows) {
    throw new Error(`Expected ${rows} rows, got ${lines.length}`)
  }

  const matrix = lines.map((line, rowIdx) => {
    const values = line.split(",").map(v => Number(v.trim()))

    if (values.length !== cols) {
      throw new Error(
        `Row ${rowIdx + 1}: expected ${cols} values, got ${values.length}`
      )
    }

    if (values.some(v => Number.isNaN(v))) {
      throw new Error(`Row ${rowIdx + 1}: contains invalid number`)
    }

    return values
  })

  return matrix
}
