import type { EagleMemory } from "@/lib/eagle-story";

/** Event-based archive readings. Missing samples are never interpolated into telemetry. */
export default function EagleTelemetry({ memory }: { memory: EagleMemory }) {
  const readings = [
    ["Altitude / location", memory.record.altitude],
    ["Velocity", memory.record.velocity],
    ["Propellant", memory.record.propellant],
    ["AGC / guidance", memory.record.agc],
    ["Armstrong heart rate", null],
    ["Cabin pressure", null],
    ["Surface temperature", null],
  ];
  return (
    <section aria-label="Historical telemetry snapshot" className="eagle-hud">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5 sm:px-6">
        <p className="eagle-eyebrow flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#c1b4ff]" aria-hidden="true" />Historical snapshot <span className="text-white/35">/</span> {memory.date}</p>
        <span className="font-mono text-[10px] text-white/60">{memory.utc}</span>
      </div>
      <dl className="grid grid-cols-2 lg:grid-cols-4">
        {memory.telemetry.map((reading, index) => (
          <div key={reading.label} className={`min-w-0 px-4 py-4 sm:px-6 ${index > 0 ? "border-l border-white/10" : ""} ${index > 1 ? "border-t lg:border-t-0" : ""}`}>
            <dt className="eagle-eyebrow text-[9px]!">{reading.label}</dt>
            <dd className="mt-2 font-mono text-[clamp(0.9rem,1.4vw,1.2rem)] leading-snug text-[#e5dcff]" title={reading.note}>{reading.value}</dd>
          </div>
        ))}
      </dl>
      <details className="group border-t border-white/10 px-4 sm:px-6">
        <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 font-mono text-[10px] text-white/65">
          <span>Inspect the source record</span><span aria-hidden="true" className="text-lg group-open:rotate-45">+</span>
        </summary>
        <div className="grid gap-6 border-t border-white/10 py-5 md:grid-cols-2">
          <div>
            <p className="text-xs leading-relaxed text-white/65">The display changes with the scene. Clock times identify an event in the transcript; hardware facts and post-flight estimates keep their original context.</p>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-white/65">
              {memory.telemetry.map(reading => <li key={reading.label}><strong className="text-white/90">{reading.label}: </strong>{reading.note}</li>)}
            </ul>
            <a href={memory.source} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center text-xs text-[#c1b4ff] underline underline-offset-4">Open this scene’s source ↗</a>
          </div>
          <dl className="divide-y divide-white/10 text-xs">
            {readings.map(([label, value]) => <div key={label} className="grid grid-cols-[1fr_1.4fr] gap-4 py-2.5"><dt className="text-white/60">{label}</dt><dd className={value ? "text-white/85" : "text-white/45"}>{value ?? "— No scene-matched sample supplied"}</dd></div>)}
          </dl>
        </div>
      </details>
    </section>
  );
}
