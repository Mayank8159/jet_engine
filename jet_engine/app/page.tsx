"use client"

import { useState, useEffect, useCallback } from "react"
import { ShieldCheck, RefreshCw } from "lucide-react"
import SingleEngine from "@/components/dashboard/SingleEngine"
import FleetDashboard from "@/components/dashboard/FleetDashboard"
import { generateDemoFleet } from "@/utils/mockData"

export default function Page() {
  const [fleet, setFleet] = useState<any[]>([])
  const [showFleet, setShowFleet] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const fetchEnginePrediction = async (engineId: string) => {
    try {
      // Create valid mock input: 30 time steps of 24 sensors
      const mockInput = Array(30).fill(0).map(() => 
        Array(24).fill(0).map(() => Math.random() * 0.4 + 0.1)
      );

      // Using 127.0.0.1 to avoid DNS resolution issues
      const response = await fetch("https://jet-engine.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: mockInput }),
      });

      if (!response.ok) throw new Error("Connection Refused");
      
      const result = await response.json();

      setFleet((prev) =>
        prev.map((eng) =>
          eng.engineId === engineId ? { ...eng, data: result } : eng
        )
      );
    } catch (error) {
      console.error(`Sync error for ${engineId}:`, error);
    }
  };

  const syncAll = useCallback(async () => {
    setIsSyncing(true);
    await Promise.all(fleet.map(eng => fetchEnginePrediction(eng.engineId)));
    setIsSyncing(false);
  }, [fleet]);

  useEffect(() => {
    const initial = generateDemoFleet(6);
    setFleet(initial);
    // Trigger initial fetch
    initial.forEach((eng: any) => fetchEnginePrediction(eng.engineId));
  }, []);

  return (
    <main className="relative min-h-screen bg-[#050507] text-slate-200 p-6">
      {/* Background Effect */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none bg-[grid-white/10]" 
           style={{ backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className={isSyncing ? "animate-spin" : ""} />
              Live Telemetry Active
            </div>
            <h1 className="text-3xl font-black italic uppercase">Aero<span className="text-blue-500">Guard</span></h1>
          </div>

          <div className="flex gap-4 items-center">
            <button onClick={syncAll} className="p-2 bg-white/5 rounded-lg hover:bg-white/10">
              <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
            </button>
            <div className="bg-white/5 p-1 rounded-xl flex border border-white/10">
              <button onClick={() => setShowFleet(false)} className={`px-4 py-2 rounded-lg text-xs font-bold ${!showFleet ? "bg-blue-600" : ""}`}>DIAGNOSTICS</button>
              <button onClick={() => setShowFleet(true)} className={`px-4 py-2 rounded-lg text-xs font-bold ${showFleet ? "bg-blue-600" : ""}`}>FLEET VIEW</button>
            </div>
          </div>
        </header>

        <section>{showFleet ? <FleetDashboard fleet={fleet} /> : <SingleEngine />}</section>
      </div>
    </main>
  );
}