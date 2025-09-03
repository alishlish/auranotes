import perfumes from "../data/perfumes.json"

export type Perfume = (typeof perfumes)[0]

// build vocabulary dynamically from dataset
const vocabSet = new Set<string>()
perfumes.forEach((p) => {
  ;[...p.top, ...p.heart, ...p.base].forEach((n) => {
    if (n && n.trim()) vocabSet.add(n.toLowerCase())
  })
})
const vocab = Array.from(vocabSet)

// cosine similarity
export function cosineSim(a: number[], b: number[]): number {
  let dot = 0,
    na = 0,
    nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] ** 2
    nb += b[i] ** 2
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9)
}

// map quiz answers → vector
export function personaVectorFromAnswers(answers: string[]): number[] {
  const vec = Array(vocab.length).fill(0)

  // simple mapping: vibes → representative notes
  if (answers.includes("Cozy")) bump(["vanilla", "tonka bean", "amber"], vec)
  if (answers.includes("Edgy")) bump(["patchouli", "leather", "incense"], vec)
  if (answers.includes("Playful")) bump(["jasmine", "citrus", "pear"], vec)
  if (answers.includes("Summer")) bump(["lemon", "bergamot", "aquatic"], vec)
  if (answers.includes("Winter")) bump(["musk", "amber", "spices"], vec)
  if (answers.includes("Autumn")) bump(["cedarwood", "sandalwood", "cardamom"], vec)
  if (answers.includes("Spring")) bump(["apple", "rose", "green notes"], vec)

  return vec
}

// helper: increment matching indices
function bump(notes: string[], vec: number[]) {
  notes.forEach((note) => {
    const idx = vocab.indexOf(note.toLowerCase())
    if (idx >= 0) vec[idx] += 1
  })
}

// build perfume vectors
function perfumeVector(p: Perfume): number[] {
  const vec = Array(vocab.length).fill(0)
  ;[...p.top, ...p.heart, ...p.base].forEach((n) => {
    const idx = vocab.indexOf(n.toLowerCase())
    if (idx >= 0) vec[idx] = 1
  })
  return vec
}

// find matches
export function findMatches(vec: number[]): (Perfume & { score: number })[] {
  return perfumes
    .map((p) => {
      const pvec = perfumeVector(p)
      return { ...p, score: cosineSim(vec, pvec) }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) // show top 5 matches
}
