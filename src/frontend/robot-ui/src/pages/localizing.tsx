import { Loader2 } from "lucide-react"

export default function LocalizingPage() {
  return (
    <div className="min-h-screen bg-amber-500 flex flex-col items-center justify-center text-center p-10 select-none">
      <Loader2 className="w-20 h-20 text-white animate-spin mb-8" />
      <h1 className="text-6xl font-extrabold text-white mb-4">Sedang Melokalisasi</h1>
      <p className="text-3xl text-white/90">Mohon menjauh dari robot</p>
    </div>
  )
}
