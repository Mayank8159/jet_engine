interface Props {
  fleetData: { status: string }[]
}

export default function FleetSummary({ fleetData }: Props) {
  const total = fleetData.length
  const healthy = fleetData.filter(e => e.status === "Healthy").length
  const warning = fleetData.filter(e => e.status === "Warning").length
  const critical = fleetData.filter(e => e.status === "Critical").length

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div className="p-3 bg-green-600/20 rounded text-center">Healthy: {healthy}</div>
      <div className="p-3 bg-yellow-600/20 rounded text-center">Warning: {warning}</div>
      <div className="p-3 bg-red-600/20 rounded text-center">Critical: {critical}</div>
      <div className="p-3 bg-white/10 rounded text-center">Total: {total}</div>
    </div>
  )
}
