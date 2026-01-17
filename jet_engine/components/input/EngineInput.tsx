interface Props {
  engineId: string
  setEngineId: (v: string) => void
}

export default function EngineInput({ engineId, setEngineId }: Props) {
  return (
    <input
      value={engineId}
      onChange={(e) => setEngineId(e.target.value)}
      placeholder="Engine ID (e.g. ENG_007)"
      className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/20"
    />
  )
}
