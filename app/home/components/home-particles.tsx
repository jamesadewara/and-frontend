"use client";

export function Particles() {
  const dots = Array.from({ length: 22 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => {
        const size = 2 + (i % 5);
        return (
          <span
            key={i}
            className="particle absolute rounded-full bg-primary/40"
            style={{
              width: size,
              height: size,
              top: `${(i * 53) % 100}%`,
              left: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 8) * 0.7}s`,
              animationDuration: `${10 + (i % 6)}s`,
            }}
          />
        );
      })}
    </div>
  );
}
