import perfumes from "../data/perfumes.json"

// type of one perfume object
export type Perfume = (typeof perfumes)[0]

// fixed vocabulary for demo
const vocab = ["jasmine", "vanilla", "patchouli", "lemon", "apple", "cedar", "musk"]

// cosine similarity
export function cosineSim(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] ** 2
    nb += b[i] ** 2
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9)
}

// map quiz answers → a numeric vector
export function personaVectorFromAnswers(answers: string[]): number[] {
  const vec = Array(vocab.length).fill(0)
  if (answers.includes("Cozy")) vec[vocab.indexOf("vanilla")] = 1
  if (answers.includes("Edgy")) vec[vocab.indexOf("patchouli")] = 1
  if (answers.includes("Playful")) vec[vocab.indexOf("jasmine")] = 1
  if (answers.includes("Summer")) vec[vocab.indexOf("lemon")] = 1
  if (answers.includes("Winter")) vec[vocab.indexOf("musk")] = 1
  if (answers.includes("Autumn")) vec[vocab.indexOf("cedar")] = 1
  if (answers.includes("Spring")) vec[vocab.indexOf("apple")] = 1
  return vec
}

// find top matches
export function findMatches(vec: number[]): (Perfume & { score: number })[] {
  return perfumes
    .map((p) => {
      const notes = [...p.top, ...p.heart, ...p.base]
      const pvec = vocab.map((n) => (notes.includes(n) ? 1 : 0))
      return { ...p, score: cosineSim(vec, pvec) }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}
