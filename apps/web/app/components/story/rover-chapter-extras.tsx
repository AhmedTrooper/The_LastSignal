"use client";

import Image from "next/image";
import { useState } from "react";
import { LRV_INVESTIGATIONS, PATHFINDER_INVESTIGATIONS } from "@/lib/rover-investigations";
import { LRV_PHOTOS, LRV_RESOURCES } from "@/lib/lrv-media";
import { PATHFINDER_PHOTOS, PATHFINDER_RESOURCES } from "@/lib/pathfinder-media";
import { LRV_FACTS, LRV_POSITION } from "@/lib/lrv-sources";
import { PATHFINDER_FACTS, PATHFINDER_POSITION } from "@/lib/pathfinder-sources";
import type { LrvScene, PathfinderScene } from "@/lib/rover-scenes";
import LrvIllustration from "./lrv-illustration";
import PathfinderIllustration from "./pathfinder-illustration";
import "./reviewed-rovers.css";

const lrvImages: Record<string, (keyof typeof LRV_PHOTOS)[]> = { "the-wheels-unfold": ["deployment"], "uphill-to-a-white-rock": ["slope", "genesis"], "a-wall-with-layers": ["route"], "parked-to-watch": ["cover"] };
const pathfinderImages: Record<string, (keyof typeof PATHFINDER_PHOTOS)[]> = { "two-jobs-one-journey": ["preparation", "hardware"], "the-rocks-with-nicknames": ["yogi"], "the-station-watched-the-sky": ["clouds"], "the-record-outlived-the-link": ["orbital", "cover"] };

export default function RoverChapterExtras({ machine, chapter }: { machine: "lrv" | "pathfinder"; chapter: string }) {
  const [selected, setSelected] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const lunar = machine === "lrv";
  const investigation = (lunar ? LRV_INVESTIGATIONS : PATHFINDER_INVESTIGATIONS)[chapter];
  const choice = investigation?.choices[selected];
  const photos = lunar ? (lrvImages[chapter] ?? []).map(key => LRV_PHOTOS[key]) : (pathfinderImages[chapter] ?? []).map(key => PATHFINDER_PHOTOS[key]);
  const resources = lunar ? LRV_RESOURCES : PATHFINDER_RESOURCES;
  const showResources = lunar ? chapter === "the-seatbelt-passenger" || chapter === "parked-to-watch" || chapter === "the-wheels-stayed-the-clues-travelled" : chapter === "the-record-outlived-the-link";
  const video = resources.find(resource => resource.kind === "video");
  const slug = lunar ? "apollo-15-rover" : "pathfinder-sojourner";
  return <div className={`reviewed-rover-extras ${machine}-extras`}>
    {investigation && choice && <section className="reviewed-rover-activity"><p className="tc-eyebrow">Try a real mission question</p><h3>{investigation.question}</h3>{lunar ? <LrvIllustration key={choice.scene} scene={choice.scene as LrvScene} /> : <PathfinderIllustration key={choice.scene} scene={choice.scene as PathfinderScene} />}<div role="group" aria-label={investigation.question}>{investigation.choices.map((option, index) => <button key={option.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{option.label}</button>)}</div><p role="status" aria-live="polite">{choice.explanation}</p><a href={investigation.source} target="_blank" rel="noopener noreferrer">Check this explanation in NASA’s record ↗</a></section>}
    <p className="reviewed-rover-note">AI-assisted teaching illustrations, not live commands, exact hardware reconstructions or simulated mission telemetry.</p>
    {photos.map(photo => <figure key={photo.name} className="reviewed-rover-archive"><p className="tc-eyebrow">NASA evidence · {photo.name}</p><div className="reviewed-rover-photo"><Image src={photo.src} alt={photo.alt} fill sizes="(min-width:900px) 720px, 90vw" className="object-contain" /></div><figcaption><strong>{photo.title}</strong><p>{photo.alt}</p><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit} · Original and context ↗</a></figcaption></figure>)}
    {showResources && <section className="reviewed-rover-archive"><h3>Explore the original evidence</h3>{resources.map(resource => <p key={resource.url}><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title} ↗</a><span>{resource.description}</span><a href={resource.source} target="_blank" rel="noopener noreferrer">NASA source page ↗</a></p>)}{video?.kind === "video" && <><button type="button" aria-expanded={videoOpen} onClick={() => setVideoOpen(value => !value)}>{videoOpen ? "Close archive player" : "Open NASA archive player"}</button>{videoOpen && <iframe className="reviewed-rover-video" src={`https://www.youtube-nocookie.com/embed/${video.embedId}`} title={video.title} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />}<p>No automatic playback. This is sourced archive imagery/video, not the imagined narration or a live spacecraft signal.</p></>}</section>}
    <details className="reviewed-rover-ledger"><summary>Mission facts, lifespan and what remains unknown</summary><p>Dates of activity, a last received data cycle and a proven time of electrical failure are different things.</p><dl>{(lunar ? LRV_FACTS : PATHFINDER_FACTS).map(fact => <div key={fact.id}><dt>{fact.label}</dt><dd>{fact.value === null ? "Not established by the reviewed record" : `${fact.value}${fact.unit ? ` ${fact.unit}` : ""}`}<p>{fact.note}</p><a href={fact.source} target="_blank" rel="noopener noreferrer">NASA source · {fact.locator} ↗</a></dd></div>)}</dl><p>{lunar ? LRV_POSITION.appliesTo : PATHFINDER_POSITION.appliesTo}</p><p>{lunar ? "Falcon: 26.13239° N, 3.63330° E; DE421 mean Earth/polar rotation axis. Rover parking coordinates are not supplied." : "Pathfinder site: 19.33° N, 33.55° W. 326.45° E is the explicit conversion 360 − 33.55, not a new measurement. The cited passage does not specify a reference frame."}</p></details>
    <a className="reviewed-rover-download" href={`/api/stories/${slug}/evidence`} download>Download the NASA source ledger, facts and shared story JSON ↗</a>
  </div>;
}
