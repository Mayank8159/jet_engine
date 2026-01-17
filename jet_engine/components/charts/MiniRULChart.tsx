"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine} from "recharts"

interface Props {
  rulHistory: number[]
  color?: string
}

export default function MiniRULChart({ rulHistory, color = "#3b82f6" }: Props) {
  // Mapping data with a "timestamp" feel
  const data = rulHistory.map((rul, idx) => ({ 
    cycle: `T-${rulHistory.length - 1 - idx}`, 
    rul 
  }))

  // Determine if the trend is critical (last value low)
  const isCritical = rulHistory[rulHistory.length - 1] < 30;
  const chartColor = isCritical ? "#f43f5e" : color;

  return (
    <div className="w-full h-full min-h-[80px] group/chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRul" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <XAxis dataKey="cycle" hide />
          <YAxis hide domain={['dataMin - 10', 'auto']} />
          
          <Tooltip
            contentStyle={{
              backgroundColor: "#0ea5e9",
              border: "none",
              borderRadius: "8px",
              fontSize: "10px",
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ display: "none" }}
            cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
          />

          {/* Critical Threshold Line */}
          <ReferenceLine 
            y={30} 
            stroke="#ef4444" 
            strokeDasharray="3 3" 
            strokeOpacity={0.3} 
          />

          <Area
            type="monotone"
            dataKey="rul"
            stroke={chartColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRul)"
            animationDuration={1500}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}