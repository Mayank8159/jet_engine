interface Props {
  raw: string
  setRaw: (v: string) => void
}

export default function SensorTextarea({ raw, setRaw }: Props) {
  return (
    <textarea
      rows={8}
      value={raw}
      onChange={(e) => setRaw(e.target.value)}
      placeholder="Paste sensor data (30 rows × 24 values)"
      className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/20 font-mono"
    />
  )
}
