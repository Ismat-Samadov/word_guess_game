# Word Guess Game

A fun and interactive word guessing game built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎮 Wordle-style gameplay
- 🎨 Beautiful UI with animations
- ⌨️ Full keyboard support
- 📱 Responsive design
- 🚀 Optimized for Vercel deployment

## Getting Started

### Development

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

### Production Build

```bash
npm run build
npm start
```

## How to Play

1. Guess the 5-letter word in 6 tries
2. After each guess, the tiles change color:
   - 🟩 Green: Letter is correct and in the right position
   - 🟨 Yellow: Letter is in the word but wrong position
   - ⬜ Gray: Letter is not in the word
3. Use the on-screen keyboard or your physical keyboard to play

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ismat-Samadov/word_guess_game)

Simply click the button above or:

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Click "Deploy"

Your game will be live in seconds!

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## License

MIT
