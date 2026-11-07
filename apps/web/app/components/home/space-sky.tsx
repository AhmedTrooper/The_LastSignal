/**
 * Decorative starfield for the home hero. Purely presentational, so it is hidden from
 * assistive tech and from the reduced-motion stylesheet (which stops the twinkle).
 */
const STARS = [
  [12, 18, 2.2, 0], [28, 62, 1.4, 1.4], [41, 12, 1.8, 2.8], [57, 44, 1.2, 0.7],
  [68, 22, 2.6, 3.4], [74, 71, 1.5, 1.9], [86, 38, 1.1, 2.4], [8, 78, 1.7, 3.1],
  [33, 88, 1.3, 1.1], [47, 71, 2.4, 2.1], [62, 90, 1.4, 0.5], [92, 60, 1.6, 2.7],
  [4, 44, 1.1, 1.7], [22, 34, 1.9, 2.2], [79, 8, 1.2, 1.3], [53, 30, 1.1, 2.9],
  [89, 88, 2.1, 0.9], [17, 8, 1.5, 3.6], [66, 55, 1.3, 1.6], [36, 55, 1.9, 2.5],
] as const;

export default function SpaceSky({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="rv-sky-stars">
        {STARS.map(([x, y, size, delay], index) => (
          <span
            key={index}
            className={`rv-sky-star${index === 0 || index === 10 ? " rv-sky-star-beacon" : ""}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
      <div className="rv-sky-aurora rv-sky-aurora-a" />
      <div className="rv-sky-aurora rv-sky-aurora-b" />
    </div>
  );
}
