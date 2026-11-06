import { EAGLE_COMPONENTS, type EagleComponentId } from "@/lib/eagle-components";
import { EAGLE_LESSONS } from "@/lib/eagle-lessons";
import "./eagle-learning.css";

export function EagleComponentList({ ids }: { ids: readonly EagleComponentId[] }) {
  return <div className="eagle-learning-components">{ids.map(id => { const part = EAGLE_COMPONENTS[id]; return <article key={id}><p className="eagle-learning-type">{part.belongsTo}</p><h3>{part.name}</h3><p>{part.job}</p><p className="eagle-learning-why"><strong>Why it mattered: </strong>{part.why}</p><a href={part.source} target="_blank" rel="noopener noreferrer">Read this component&apos;s source ↗</a></article>; })}</div>;
}

export default function EagleLearningLens({ memory, compact = false }: { memory: string; compact?: boolean }) {
  const lesson = EAGLE_LESSONS[memory];
  if (!lesson) return null;
  return <section className={`eagle-learning-lens ${compact ? "is-compact" : ""}`} aria-label="What Eagle’s equipment made possible">
    <p className="eagle-learning-kicker">The hardware behind this memory</p>
    <h2>{lesson.question}</h2><p className="eagle-learning-answer">{lesson.answer}</p>
    <details><summary>Meet the actual components</summary><EagleComponentList ids={lesson.components} /></details>
  </section>;
}
