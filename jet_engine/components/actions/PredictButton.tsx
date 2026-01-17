export default function PredictButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold hover:scale-105 transition"
    >
      🚀 Predict RUL
    </button>
  )
}
