'use client'

import Tile from './Tile'

interface GridProps {
  guesses: string[]
  currentGuess: string
  answer: string
  maxGuesses: number
  wordLength: number
  shake: boolean
}

export default function Grid({ guesses, currentGuess, answer, maxGuesses, wordLength, shake }: GridProps) {
  const empRows = Array.from({ length: maxGuesses - guesses.length - (currentGuess ? 1 : 0) })

  return (
    <div className="grid gap-1 mb-4">
      {/* Completed guesses */}
      {guesses.map((guess, i) => (
        <div key={i} className="flex gap-1">
          {guess.split('').map((letter, j) => {
            let state: 'correct' | 'present' | 'absent' = 'absent'

            if (letter === answer[j]) {
              state = 'correct'
            } else if (answer.includes(letter)) {
              state = 'present'
            }

            return (
              <Tile key={j} letter={letter} state={state} animate />
            )
          })}
        </div>
      ))}

      {/* Current guess */}
      {currentGuess && (
        <div className={`flex gap-1 ${shake ? 'shake' : ''}`}>
          {currentGuess.split('').map((letter, i) => (
            <Tile key={i} letter={letter} state="tbd" animate />
          ))}
          {Array.from({ length: wordLength - currentGuess.length }).map((_, i) => (
            <Tile key={`empty-${i}`} letter="" state="empty" />
          ))}
        </div>
      )}

      {/* Empty rows */}
      {empRows.map((_, i) => (
        <div key={`empty-row-${i}`} className="flex gap-1">
          {Array.from({ length: wordLength }).map((_, j) => (
            <Tile key={j} letter="" state="empty" />
          ))}
        </div>
      ))}
    </div>
  )
}
