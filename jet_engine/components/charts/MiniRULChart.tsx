import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface Props {
  rulHistory: number[]
  color?: string
}

export default function MiniRULChart({ rulHistory, color = "#60a5fa" }: Props) {
  const data = rulHistory.map((rul, idx) => ({ cycle: idx, rul }))
  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={data}>
        <XAxis dataKey="cycle" hide />
        <YAxis hide />
        <Tooltip />
        <Line type="monotone" dataKey="rul" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
