import { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

type Chapter = {
  id: number
  title: string
  audio: string
}

const chapters: Chapter[] = [
  { id: 1, title: "Chapter 1 - Introduction", audio: "/audio/ch1.mp3" },
  { id: 2, title: "Chapter 2 - The Beginning", audio: "/audio/ch2.mp3" },
  { id: 3, title: "Chapter 3 - The Journey", audio: "/audio/ch3.mp3" },
]

export default function AudiobookPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentChapter, setCurrentChapter] = useState(chapters[0])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }

    setPlaying(!playing)
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime += seconds
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return

    const percent = (audio.currentTime / audio.duration) * 100
    setProgress(percent)
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const time = (value[0] / 100) * audio.duration
    audio.currentTime = time
    setProgress(value[0])
  }

  const selectChapter = (chapter: Chapter) => {
    setCurrentChapter(chapter)
    setPlaying(false)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.load()
    }
  }

  return (
    <div className="min-h-screen bg-brand p-10 flex justify-center">
    <div className="max-w-3xl w-full space-y-6">

      <Card>
        <CardContent className="p-6 space-y-6">

          {/* Book Info */}
          <div className="flex gap-6">
            <img
              src="/covers/book.jpg"
              className="w-32 h-44 object-cover rounded-xl"
            />

            <div>
              <h1 className="text-2xl font-bold">My Audiobook</h1>
              <p className="text-muted-foreground">by John Doe</p>
              <p className="mt-2 text-sm">{currentChapter.title}</p>
            </div>
          </div>

          {/* Audio */}
          <audio
            ref={audioRef}
            src={currentChapter.audio}
            onTimeUpdate={handleTimeUpdate}
          />

          {/* Progress */}
          <Slider
            value={[progress]}
            max={100}
            step={1}
            onValueChange={handleSeek}
          />

          {/* Controls */}
          <div className="flex justify-center gap-4">

            <Button
              variant="outline"
              onClick={() => skip(-10)}
            >
              -10s
            </Button>

            <Button onClick={togglePlay}>
              {playing ? "Pause" : "Play"}
            </Button>

            <Button
              variant="outline"
              onClick={() => skip(10)}
            >
              +10s
            </Button>

          </div>

        </CardContent>
      </Card>

      {/* Chapters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Chapters</h2>

          {chapters.map((chapter) => (
            <Button
              key={chapter.id}
              variant={
                chapter.id === currentChapter.id
                  ? "default"
                  : "outline"
              }
              className="w-full justify-start"
              onClick={() => selectChapter(chapter)}
            >
              {chapter.title}
            </Button>
          ))}
        </CardContent>
      </Card>

    </div>
    </div>
  )
}