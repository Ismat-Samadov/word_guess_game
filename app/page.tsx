import WordGuessGame from '@/components/WordGuessGame'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Word Guess</h1>
        <WordGuessGame />
      </div>
    </main>
  )
}
