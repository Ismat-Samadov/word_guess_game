'use client'

import { useState, useEffect } from 'react'
import Grid from './Grid'
import Keyboard from './Keyboard'

const WORD_LIST = [
  'REACT', 'NEXT', 'CLOUD', 'BUILD', 'MAGIC', 'SPARK', 'QUICK', 'WORLD',
  'BRAVE', 'SMILE', 'PEACE', 'HAPPY', 'CLEAN', 'DREAM', 'LIGHT', 'POWER',
  'FRESH', 'SMART', 'FOCUS', 'SHINE', 'GRACE', 'TRUST', 'VALUE', 'NOBLE'
]

const WORD_LENGTH = 5
const MAX_GUESSES = 6

type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd'

export default function WordGuessGame() {
  const [answer, setAnswer] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({})
  const [shake, setShake] = useState(false)

  // Initialize game
  useEffect(() => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
    setAnswer(randomWord)
  }, [])

  // Handle keyboard input
  useEffect(() => {
    if (gameState !== 'playing') return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit()
      } else if (e.key === 'Backspace') {
        handleDelete()
      } else if (/^[A-Za-z]$/.test(e.key)) {
        handleLetter(e.key.toUpperCase())
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentGuess, gameState, guesses])

  const handleLetter = (letter: string) => {
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + letter)
    }
  }

  const handleDelete = () => {
    setCurrentGuess(prev => prev.slice(0, -1))
  }

  const handleSubmit = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)

    // Update letter states
    const newLetterStates = { ...letterStates }
    const answerArray = answer.split('')
    const guessArray = currentGuess.split('')

    // First pass: mark correct letters
    guessArray.forEach((letter, i) => {
      if (letter === answerArray[i]) {
        newLetterStates[letter] = 'correct'
      }
    })

    // Second pass: mark present and absent letters
    guessArray.forEach((letter, i) => {
      if (letter !== answerArray[i]) {
        if (answerArray.includes(letter) && newLetterStates[letter] !== 'correct') {
          newLetterStates[letter] = 'present'
        } else if (!newLetterStates[letter]) {
          newLetterStates[letter] = 'absent'
        }
      }
    })

    setLetterStates(newLetterStates)

    // Check win/loss conditions
    if (currentGuess === answer) {
      setGameState('won')
    } else if (newGuesses.length === MAX_GUESSES) {
      setGameState('lost')
    }

    setCurrentGuess('')
  }

  const resetGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
    setAnswer(randomWord)
    setGuesses([])
    setCurrentGuess('')
    setGameState('playing')
    setLetterStates({})
    setShake(false)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        answer={answer}
        maxGuesses={MAX_GUESSES}
        wordLength={WORD_LENGTH}
        shake={shake}
      />

      <Keyboard
        onKeyPress={handleLetter}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        letterStates={letterStates}
        disabled={gameState !== 'playing'}
      />

      {gameState !== 'playing' && (
        <div className="text-center mt-4">
          {gameState === 'won' ? (
            <div className="text-green-400 text-2xl mb-4">
              Congratulations! You won!
            </div>
          ) : (
            <div className="text-red-400 text-2xl mb-4">
              Game Over! The word was: {answer}
            </div>
          )}
          <button
            onClick={resetGame}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}
