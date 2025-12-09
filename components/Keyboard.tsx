'use client'

type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd'

interface KeyboardProps {
  onKeyPress: (key: string) => void
  onDelete: () => void
  onSubmit: () => void
  letterStates: Record<string, LetterState>
  disabled: boolean
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'],
]

export default function Keyboard({ onKeyPress, onDelete, onSubmit, letterStates, disabled }: KeyboardProps) {
  const getKeyColor = (key: string) => {
    const state = letterStates[key]
    if (state === 'correct') return 'bg-correct'
    if (state === 'present') return 'bg-present'
    if (state === 'absent') return 'bg-gray-600'
    return 'bg-gray-500'
  }

  const handleClick = (key: string) => {
    if (disabled) return

    if (key === 'ENTER') {
      onSubmit()
    } else if (key === 'DELETE') {
      onDelete()
    } else {
      onKeyPress(key)
    }
  }

  return (
    <div className="w-full max-w-lg">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex gap-1 justify-center mb-1">
          {row.map((key) => {
            const isSpecial = key === 'ENTER' || key === 'DELETE'
            return (
              <button
                key={key}
                onClick={() => handleClick(key)}
                disabled={disabled}
                className={`
                  ${isSpecial ? 'px-3 text-xs' : 'w-9'}
                  h-14 rounded font-bold uppercase
                  ${getKeyColor(key)}
                  hover:opacity-80
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all
                `}
              >
                {key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
