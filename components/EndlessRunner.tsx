'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'box' | 'spike' | 'tall';
}

export default function EndlessRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game state refs (don't trigger re-renders)
  const gameRef = useRef({
    player: {
      x: 100,
      y: 0,
      width: 40,
      height: 40,
      velocityY: 0,
      isJumping: false,
      rotation: 0,
    },
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    ground: 400,
    gravity: 0.6,
    jumpStrength: -16,
    gameSpeed: 5,
    obstacleTimer: 0,
    obstacleInterval: 100,
    score: 0,
    animationFrame: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = Math.min(800, window.innerWidth - 40);
      canvas.height = 500;
      gameRef.current.ground = canvas.height - 100;
      gameRef.current.player.y = gameRef.current.ground - gameRef.current.player.height;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('endlessRunnerHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }

    // Game loop
    let animationId: number;

    const gameLoop = () => {
      if (gameState !== 'playing') {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      const game = gameRef.current;
      const { player, obstacles, particles, ground, gravity, jumpStrength, gameSpeed } = game;

      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1e1b4b');
      gradient.addColorStop(0.5, '#312e81');
      gradient.addColorStop(1, '#4c1d95');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars background
      game.animationFrame++;
      for (let i = 0; i < 50; i++) {
        const x = (i * 157 + game.animationFrame * 0.5) % canvas.width;
        const y = (i * 73) % (canvas.height - 100);
        const size = (i % 3) + 1;
        const alpha = 0.3 + Math.sin(game.animationFrame * 0.05 + i) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(x, y, size, size);
      }

      // Draw ground with pattern
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, ground, canvas.width, canvas.height - ground);

      // Ground line decoration
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, ground);
      ctx.lineTo(canvas.width, ground);
      ctx.stroke();

      // Draw grid pattern on ground
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        const offset = (game.animationFrame * gameSpeed) % 40;
        ctx.beginPath();
        ctx.moveTo(i - offset, ground);
        ctx.lineTo(i - offset, canvas.height);
        ctx.stroke();
      }

      // Apply gravity to player
      player.velocityY += gravity;
      player.y += player.velocityY;

      // Ground collision
      if (player.y >= ground - player.height) {
        player.y = ground - player.height;
        player.velocityY = 0;
        player.isJumping = false;
        player.rotation = 0;
      } else {
        player.rotation += 0.1;
      }

      // Draw player with rotation and shadow
      ctx.save();

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(player.x + player.width / 2, ground + 5, player.width / 2, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Player
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
      if (player.isJumping) {
        ctx.rotate(player.rotation);
      }

      // Player gradient
      const playerGradient = ctx.createLinearGradient(-player.width / 2, -player.height / 2, player.width / 2, player.height / 2);
      playerGradient.addColorStop(0, '#f59e0b');
      playerGradient.addColorStop(1, '#ef4444');
      ctx.fillStyle = playerGradient;

      // Draw rounded rectangle for player
      const radius = 8;
      ctx.beginPath();
      ctx.roundRect(-player.width / 2, -player.height / 2, player.width, player.height, radius);
      ctx.fill();

      // Add eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(player.width / 4 - 5, -5, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(player.width / 4 - 3, -5, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Update and draw obstacles
      game.obstacleTimer++;
      if (game.obstacleTimer > game.obstacleInterval) {
        game.obstacleTimer = 0;
        const types: ('box' | 'spike' | 'tall')[] = ['box', 'spike', 'tall'];
        const type = types[Math.floor(Math.random() * types.length)];

        let height = 40;
        let width = 40;

        if (type === 'spike') {
          height = 50;
          width = 30;
        } else if (type === 'tall') {
          height = 80;
          width = 35;
        }

        obstacles.push({
          x: canvas.width,
          y: ground - height,
          width,
          height,
          type,
        });
      }

      // Update obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= gameSpeed;

        // Draw obstacle with shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(obstacle.x + 5, ground + 5, obstacle.width, 10);

        if (obstacle.type === 'box') {
          const obstacleGradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height);
          obstacleGradient.addColorStop(0, '#8b5cf6');
          obstacleGradient.addColorStop(1, '#6366f1');
          ctx.fillStyle = obstacleGradient;
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          ctx.strokeStyle = '#a78bfa';
          ctx.lineWidth = 2;
          ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === 'spike') {
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
          ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
          ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#991b1b';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (obstacle.type === 'tall') {
          const tallGradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height);
          tallGradient.addColorStop(0, '#14b8a6');
          tallGradient.addColorStop(1, '#0d9488');
          ctx.fillStyle = tallGradient;
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          ctx.strokeStyle = '#2dd4bf';
          ctx.lineWidth = 2;
          ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }

        // Check collision
        if (
          player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y
        ) {
          // Game over
          setGameState('gameOver');
          if (game.score > highScore) {
            setHighScore(game.score);
            localStorage.setItem('endlessRunnerHighScore', game.score.toString());
          }

          // Create explosion particles
          for (let i = 0; i < 30; i++) {
            particles.push({
              x: player.x + player.width / 2,
              y: player.y + player.height / 2,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10 - 3,
              life: 60,
              color: ['#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 4)],
            });
          }
        }

        // Remove off-screen obstacles and increment score
        if (obstacle.x + obstacle.width < 0) {
          obstacles.splice(i, 1);
          game.score += 10;
          setScore(game.score);

          // Increase difficulty
          if (game.score % 100 === 0) {
            game.gameSpeed += 0.5;
            game.obstacleInterval = Math.max(60, game.obstacleInterval - 5);
          }
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.3; // gravity
        particle.life--;

        const alpha = particle.life / 60;
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (particle.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Draw score
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(game.score.toString(), 20, 50);
      ctx.fillText(game.score.toString(), 20, 50);

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [gameState, highScore]);

  // Handle jump
  const handleJump = () => {
    const game = gameRef.current;
    if (gameState === 'start') {
      setGameState('playing');
      game.score = 0;
      setScore(0);
      game.obstacles = [];
      game.particles = [];
      game.gameSpeed = 5;
      game.obstacleInterval = 100;
      game.obstacleTimer = 0;
      game.player.y = game.ground - game.player.height;
      game.player.velocityY = 0;
    } else if (gameState === 'playing') {
      if (!game.player.isJumping) {
        game.player.velocityY = game.jumpStrength;
        game.player.isJumping = true;

        // Add jump particles
        for (let i = 0; i < 8; i++) {
          game.particles.push({
            x: game.player.x + game.player.width / 2,
            y: game.player.y + game.player.height,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 2,
            life: 30,
            color: '#10b981',
          });
        }
      }
    } else if (gameState === 'gameOver') {
      setGameState('start');
      const game = gameRef.current;
      game.player.y = game.ground - game.player.height;
      game.player.velocityY = 0;
      game.player.rotation = 0;
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch controls
  const handleTouch = () => {
    handleJump();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <div className="text-center mb-4">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Endless Runner
        </h1>
        <p className="text-gray-300 text-lg">
          {gameState === 'start' && 'Press SPACE or TAP to start!'}
          {gameState === 'playing' && 'Jump over obstacles!'}
          {gameState === 'gameOver' && 'Game Over! Press SPACE or TAP to restart'}
        </p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleTouch}
          onTouchStart={(e) => {
            e.preventDefault();
            handleTouch();
          }}
          className="border-4 border-purple-500 rounded-lg shadow-2xl cursor-pointer"
          style={{ maxWidth: '100%', touchAction: 'none' }}
        />

        {gameState === 'start' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🏃</div>
              <p className="text-2xl font-bold text-white mb-2">Ready to Run?</p>
              <p className="text-gray-300">Use SPACE / ↑ / W to jump</p>
              {highScore > 0 && (
                <p className="text-yellow-400 mt-4 text-xl">High Score: {highScore}</p>
              )}
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg">
            <div className="text-center bg-gray-900 p-8 rounded-xl border-4 border-red-500">
              <div className="text-6xl mb-4">💥</div>
              <p className="text-3xl font-bold text-red-500 mb-2">Game Over!</p>
              <p className="text-2xl text-white mb-4">Score: {score}</p>
              {score === highScore && score > 0 && (
                <p className="text-yellow-400 text-xl mb-4">🏆 New High Score! 🏆</p>
              )}
              {highScore > 0 && score !== highScore && (
                <p className="text-gray-300 mb-4">High Score: {highScore}</p>
              )}
              <p className="text-gray-400">Press SPACE or TAP to retry</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-8 text-center">
        <div className="bg-gray-800 px-6 py-3 rounded-lg border-2 border-purple-500">
          <p className="text-gray-400 text-sm">Current Score</p>
          <p className="text-3xl font-bold text-purple-400">{score}</p>
        </div>
        <div className="bg-gray-800 px-6 py-3 rounded-lg border-2 border-yellow-500">
          <p className="text-gray-400 text-sm">High Score</p>
          <p className="text-3xl font-bold text-yellow-400">{highScore}</p>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm mt-4">
        <p>💡 Tips: Time your jumps carefully!</p>
        <p>Game speeds up every 100 points!</p>
      </div>
    </div>
  );
}
