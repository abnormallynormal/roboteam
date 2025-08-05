"use client";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface FloatingEmoji {
  id: number;
  emoji: string;
  position: number; // Position along the rectangle perimeter
  speed: number; // Speed of movement
}

export default function Temp() {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
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
    // Create initial emojis spread around the rectangle
    const initialEmojis = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      position: (i * 2 * (width + height)) / 40, // Spread emojis evenly
      speed: 2, // Speed of movement in pixels
    }));
    setEmojis(initialEmojis);

    // Animation loop for rectangular motion
    const animate = () => {
      setEmojis((prevEmojis) =>
        prevEmojis.map((emoji) => ({
          ...emoji,
          position: (emoji.position + emoji.speed) % (2 * (width + height)),
        }))
      );
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, []);

  // Fixed getPosition calculation
  const getPosition = (position: number) => {
    const perimeter = 2 * (width + height);
    const pos = position % perimeter;

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

        {/* Main content with padding */}
        <div className="flex items-center justify-center relative z-10 p-20 gap-4">
          <div className="text-5xl font-black">嘟嘟</div>
          <Heart className="h-60 w-60 text-red-500 fill-current" />
          <Heart className="h-60 w-60 text-red-500 fill-current" />
          <Heart className="h-60 w-60 text-red-500 fill-current" />
          <div className="text-5xl font-black">玥玥</div>
        </div>
      </div>
    </div>
  );
}
