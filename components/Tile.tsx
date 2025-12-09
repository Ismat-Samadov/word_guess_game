'use client'

interface TileProps {
  letter: string
  state: 'correct' | 'present' | 'absent' | 'empty' | 'tbd'
  animate?: boolean
}

export default function Tile({ letter, state, animate }: TileProps) {
  const getBackgroundColor = () => {
    switch (state) {
      case 'correct':
        return 'bg-correct'
      case 'present':
        return 'bg-present'
      case 'absent':
        return 'bg-absent'
      case 'tbd':
        return 'bg-gray-700 border-2 border-gray-500'
      default:
        return 'bg-gray-800 border-2 border-gray-700'
    }
  }

  return (
    <div
      className={`
        w-14 h-14 flex items-center justify-center text-2xl font-bold uppercase
        ${getBackgroundColor()}
        ${animate && letter && state === 'tbd' ? 'tile-pop' : ''}
        ${animate && state !== 'tbd' && state !== 'empty' ? 'tile-flip' : ''}
        transition-colors duration-300
      `}
    >
      {letter}
    </div>
  )
}
