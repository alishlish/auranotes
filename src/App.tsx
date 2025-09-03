import { useState } from "react"
import { findMatches, personaVectorFromAnswers } from "./utils/similarity"
import type { Perfume } from "./utils/similarity"

const questions = [
  { q: "Night in or Night out?", a: ["In", "Out"] },
  { q: "Pick a vibe:", a: ["Cozy", "Edgy", "Playful"] },
  { q: "Season you thrive in?", a: ["Summer", "Winter", "Autumn", "Spring"] },
]

export default function App() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [result, setResult] = useState<(Perfume & { score: number })[]>([])

  function choose(a: string) {
    const next = [...answers, a]
    setAnswers(next)
    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      const vec = personaVectorFromAnswers(next)
      const matches = findMatches(vec)
      setResult(matches)
      setStep(step + 1)
    }
  }

  if (step < questions.length) {
    const current = questions[step]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-violet-100 p-6">
        <h1 className="text-2xl font-serif mb-6">{current.q}</h1>
        <div className="flex gap-4">
          {current.a.map((a) => (
            <button
              key={a}
              onClick={() => choose(a)}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-violet-50 flex flex-col items-center p-8">
      <h1 className="text-3xl font-serif font-bold mb-6">✨ You as a Perfume ✨</h1>

      {result.length > 0 && (
        <div className="bg-white shadow-xl rounded-2xl p-6 max-w-xl w-full">
          <h2 className="text-xl font-semibold mb-4">Top Matches</h2>
          <ul className="space-y-4">
            {result.map((p) => (
              <li key={p.id} className="p-4 border rounded-lg">
                <div className="font-bold">{p.name}</div>
                <div className="text-sm text-gray-600">{p.brand}</div>
                <div className="mt-2 text-xs text-gray-500">
                  Notes: {[...p.top, ...p.heart, ...p.base].join(", ")}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Score: {p.score.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
