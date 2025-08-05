"use client";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface FloatingEmoji {
  id: number;
  emoji: string;
  position: number; // Position along the rectangle perimeter
  speed: number; // Speed of movement
}

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  opacity: number;
  scale: number;
}

export default function Temp() {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const [direction, setDirection] = useState(1); // 1 for clockwise, -1 for counterclockwise
  const [heartParticles, setHeartParticles] = useState<HeartParticle[]>([]);
  const [isExploding, setIsExploding] = useState(false);
  const emojiList = [
    "🔥",
    "🪶",
    "🤍",
    "🌟",
    "💗",
    "♾️",
    "💗",
    "🌲",
    "👑",
    "🌙",
  ];

  // Rectangle dimensions - made wider
  const padding = 100;
  const width = 1200; // Increased from 800
  const height = 400;

  useEffect(() => {
    // Create initial emojis spread around the rectangle - only once
    const initialEmojis = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      emoji: emojiList[i % emojiList.length],
      position: (i * 2 * (width + height)) / 40, // Spread emojis evenly
      speed: 2, // Speed of movement in pixels
    }));
    setEmojis(initialEmojis);
  }, []);

  useEffect(() => {
    // Animation loop for rectangular motion
    const animate = () => {
      setEmojis((prevEmojis) =>
        prevEmojis.map((emoji) => ({
          ...emoji,
          position:
            (emoji.position + emoji.speed * direction) % (2 * (width + height)),
        }))
      );

      // Animate heart particles
      setHeartParticles((prevParticles) => {
        const updated = prevParticles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.4, // slightly less gravity
            opacity: particle.opacity - 0.025, // fade faster
            scale: particle.scale * 0.992,
          }))
          .filter((particle) => particle.opacity > 0.1); // Remove particles sooner

        // Reset explosion state when all particles are gone
        if (updated.length === 0 && prevParticles.length > 0) {
          setIsExploding(false);
        }

        return updated;
      });
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, [direction]);

  // Handle spacebar press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        // Prevent multiple explosions too quickly
        if (heartParticles.length > 0) return;

        setDirection((prev) => -prev); // Switch direction

        // Create heart particles from the 3 big hearts
        const newParticles: HeartParticle[] = [];
        const heartPositions = [
          { x: 0, y: 0 }, // Center heart
          { x: -130, y: 0 }, // Left heart (approximate)
          { x: 130, y: 0 }, // Right heart (approximate)
        ];

        heartPositions.forEach((heartPos, heartIndex) => {
          // Create fewer particles per heart (8 instead of 18)
          for (let i = 0; i < 8; i++) {
            newParticles.push({
              id: Date.now() + heartIndex * 100 + i,
              x: heartPos.x + (Math.random() - 0.5) * 60, // Random spread around heart
              y: heartPos.y + (Math.random() - 0.5) * 60,
              vx: (Math.random() - 0.5) * 8, // Random horizontal velocity
              vy: -Math.random() * 8 - 5, // Upward velocity
              opacity: 1,
              scale: 0.8 + Math.random() * 0.4,
            });
          }
        });

        setHeartParticles((prev) => [...prev, ...newParticles]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Fixed getPosition calculation
  const getPosition = (position: number) => {
    const perimeter = 2 * (width + height);
    let pos = position % perimeter;
    if (pos < 0) pos += perimeter; // Handle negative positions

    if (pos < width) {
      // Top edge (left to right)
      return { x: pos - width / 2, y: -height / 2 };
    } else if (pos < width + height) {
      // Right edge (top to bottom)
      return { x: width / 2, y: pos - width - height / 2 };
    } else if (pos < 2 * width + height) {
      // Bottom edge (right to left)
      return { x: width / 2 - (pos - width - height), y: height / 2 };
    } else {
      // Left edge (bottom to top)
      return { x: -width / 2, y: height / 2 - (pos - 2 * width - height) };
    }
  };

  return (
    <div className="relative min-h-screen bg-pink-200 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Rectangle border emojis */}
        {emojis.map((emoji) => {
          const pos = getPosition(emoji.position);
          return (
            <div
              key={emoji.id}
              className="absolute text-2xl pointer-events-none"
              style={{
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: "translate(-50%, -50%)",
                transition: "all 0.016s linear",
              }}
            >
              {emoji.emoji}
            </div>
          );
        })}

        {/* Heart particles */}
        {heartParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-2xl pointer-events-none"
            style={{
              left: `calc(50% + ${particle.x}px)`,
              top: `calc(50% + ${particle.y}px)`,
              transform: `translate(-50%, -50%) scale(${particle.scale})`,
              opacity: particle.opacity,
            }}
          >
            ❤️
          </div>
        ))}

        {/* Main content with padding */}
        <div className="flex items-center justify-center relative z-10 p-20 gap-4">
          <div className="text-5xl font-black">嘟嘟</div>
          <Heart className="h-60 w-60 text-red-500 fill-current" />
          <Heart className="h-60 w-60 text-red-500 fill-current" />
          <Heart className="h-60 w-60 text-red-500 fill-current" />
          <div className="text-5xl font-black">玥玥</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-gray-600 text-sm">
        Press SPACE to switch direction and create heart explosion! ❤️
      </div>
    </div>
  );
}
