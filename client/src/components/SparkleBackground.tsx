import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: number;
}

const SparkleBackground = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const createSparkle = () => {
      const id = Date.now();
      const newSparkle: Sparkle = {
        id,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 10 + 5, // Size between 5px and 15px
        duration: Math.random() * 2000 + 1000, // Duration between 1s and 3s
      };

      setSparkles((prev) => [...prev.slice(-20), newSparkle]); // Keep max 20 sparkles for performance

      // Remove the sparkle after its animation ends
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, newSparkle.duration);
    };

    const interval = setInterval(createSparkle, 400); // Create a new sparkle every 400ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sparkle-container fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animation: `sparkle-animation ${sparkle.duration}ms ease-in-out forwards`,
          }}
        />
      ))}
    </div>
  );
};

export default SparkleBackground;