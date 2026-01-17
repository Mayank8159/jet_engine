"use client"

interface Props {
  raw: string
  setRaw: (v: string) => void
}

export default function SensorTextarea({ raw, setRaw }: Props) {
  const fillDemoData = () => {
    const rows = 30
    const cols = 24

    const csv = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () =>
        (Math.random() * 400 + 10).toFixed(2)
      ).join(",")
    ).join("\n")

    setRaw(csv)
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={fillDemoData}
        className="mb-3 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold hover:scale-105 transition"
      >
        Fill Demo Sensor Data
      </button>

      <textarea
        rows={10}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="30 rows × 24 comma-separated values"
        className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/20 font-mono resize-none focus:outline-none"
      />
    </div>
  )
}
