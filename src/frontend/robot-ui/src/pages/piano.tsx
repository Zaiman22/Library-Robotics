import { useRef } from "react"
import backButton from "@/components/backButton"

const WHITE_KEY_WIDTH = 80
const BLACK_KEY_WIDTH = 48

const WHITE_KEYS = [
  { note: "C", freq: 261.63 },
  { note: "D", freq: 293.66 },
  { note: "E", freq: 329.63 },
  { note: "F", freq: 349.23 },
  { note: "G", freq: 392.0 },
  { note: "A", freq: 440.0 },
  { note: "B", freq: 493.88 },
  { note: "C", freq: 523.25 },
]

// afterIndex: the black key sits right after this white key's index
const BLACK_KEYS = [
  { note: "C#", freq: 277.18, afterIndex: 0 },
  { note: "D#", freq: 311.13, afterIndex: 1 },
  { note: "F#", freq: 369.99, afterIndex: 3 },
  { note: "G#", freq: 415.3, afterIndex: 4 },
  { note: "A#", freq: 466.16, afterIndex: 5 },
]

export default function PianoPage() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const playNote = (freq: number) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    const ctx = audioCtxRef.current

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.value = freq

    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.8)
  }

  return (
    <div className="min-h-screen bg-brand flex flex-col items-center justify-center select-none">
      {backButton()}

      <h1 className="text-5xl font-extrabold text-white mb-12">🎹 Piano</h1>

      <div
        className="relative flex"
        style={{ width: WHITE_KEYS.length * WHITE_KEY_WIDTH }}
      >
        {WHITE_KEYS.map((key, i) => (
          <button
            key={i}
            style={{ width: WHITE_KEY_WIDTH }}
            onMouseDown={() => playNote(key.freq)}
            onTouchStart={(e) => {
              e.preventDefault()
              playNote(key.freq)
            }}
            className="h-72 bg-white border border-brand-dark/30 rounded-b-xl shadow-md active:bg-brand/20 transition-colors flex items-end justify-center pb-4 text-brand-dark font-semibold"
          >
            {key.note}
          </button>
        ))}

        {BLACK_KEYS.map((key) => (
          <button
            key={key.note + key.afterIndex}
            style={{
              position: "absolute",
              top: 0,
              left: (key.afterIndex + 1) * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2,
              width: BLACK_KEY_WIDTH,
            }}
            onMouseDown={() => playNote(key.freq)}
            onTouchStart={(e) => {
              e.preventDefault()
              playNote(key.freq)
            }}
            className="h-44 bg-brand-dark rounded-b-lg shadow-lg active:bg-brand-dark/70 transition-colors z-10"
          />
        ))}
      </div>
    </div>
  )
}
