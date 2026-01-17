import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface Props {
  rulHistory: number[]
}

export default function RULChart({ rulHistory }: Props) {
  const chartData = rulHistory.map((rul, idx) => ({ cycle: idx, rul }))

  return (
    <div className="mt-6">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <XAxis dataKey="cycle" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="rul" stroke="#60a5fa" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
