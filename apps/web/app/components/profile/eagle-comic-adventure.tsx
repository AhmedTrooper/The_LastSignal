"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookIcon, Play, SparkIcon } from "@/app/components/icons";
import { EAGLE_COMIC_ISSUES, EAGLE_COMIC_SAVE, EMPTY_EAGLE_COMIC, comicIssueReady, readEagleComicProgress } from "@/lib/eagle-comic";
import { EAGLE_MEDIA } from "@/lib/eagle-media";
import { connectEagle, readEagleStatus } from "@/lib/eagle-link";
import EagleConsole, { type EagleConsoleProps } from "./eagle-console";
import EagleComicHardware from "./eagle-comic-hardware";
import EagleIssueArt from "./eagle-issue-art";
import EagleMediaPlayer from "./eagle-media-player";
import { useEagleVoice } from "./use-eagle-voice";
import "./eagle-comic.css";
import EagleJourneyNav from "./eagle-journey-nav";
import { EagleComponentList } from "./eagle-learning-lens";
import { APOLLO_BOOK } from "@/lib/machine-books/apollo";

export default function EagleComicAdventure(props: EagleConsoleProps) {
  const [progress, setProgress] = useState(EMPTY_EAGLE_COMIC);
  const [restored, setRestored] = useState(false);
  const [extras, setExtras] = useState(false);
  const [showRecording, setShowRecording] = useState(false);
  const [pauseRecording, setPauseRecording] = useState(0);
  const [otherStory, setOtherStory] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const needsFocus = useRef(false);
  const visit = useRef("");
  const swipe = useRef({ x: 0, y: 0 });
  const issue = EAGLE_COMIC_ISSUES[progress.issue];
  const panel = issue.panels[Math.min(progress.panel, 2)];
  const actions = progress.actions[issue.id] ?? [];
  const ready = comicIssueReady(issue, actions);
  const voice = useEagleVoice(`${issue.id}-${progress.panel}`);
  const done = progress.collected.length === EAGLE_COMIC_ISSUES.length && progress.panel === 5;
  const recording = issue.id === "overload" ? EAGLE_MEDIA["landing-audio"] : issue.id === "goodbye" ? EAGLE_MEDIA["ascent-audio"] : null;

  useEffect(() => {
    try { visit.current = sessionStorage.getItem("tls:eagle:story-session") ?? ""; } catch { /* Optional cross-tab continuity. */ }
    let saved = EMPTY_EAGLE_COMIC;
    try { saved = readEagleComicProgress(localStorage.getItem(EAGLE_COMIC_SAVE)); } catch { /* Storage is optional. */ }
    const frame = requestAnimationFrame(() => { setProgress(saved); setRestored(true); });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (restored) try { localStorage.setItem(EAGLE_COMIC_SAVE, JSON.stringify(progress)); } catch { /* The comic works without a saved position. */ }
    if (needsFocus.current) { heading.current?.focus({ preventScroll: true }); document.getElementById("eagle-comic-reader")?.scrollIntoView({ block: "start", behavior: "instant" }); needsFocus.current = false; }
  }, [progress, restored]);
  useEffect(() => {
    const link = connectEagle(message => {
      if (!visit.current || message.session !== visit.current) return;
      if (message.type === "SCENE_PROGRESS") { setOtherStory(`Your other story tab · memory ${message.scene}/${message.total}`); link.send({ type: "CONSOLE_READY", session: message.session, machineId: "apollo-11-lander" }); }
      if (message.type === "STORY_COMPLETED") { setOtherStory("Welcome back. You remembered the part that stayed."); link.send({ type: "STORY_ACK", session: message.session, machineId: "apollo-11-lander" }); }
      if (message.type === "STORY_CLOSED") setOtherStory(null);
    });
    const request = () => { if (visit.current) link.send({ type: "STATUS_REQUEST", session: visit.current, machineId: "apollo-11-lander" }); };
    const restore = readEagleStatus(visit.current);
    const query = new URLSearchParams(window.location.search);
    const returning = query.get("storyCompleted") === "true";
    if (returning) { query.delete("storyCompleted"); const search = query.toString(); window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`); }
    const frame = requestAnimationFrame(() => { if (returning || restore?.type === "STORY_COMPLETED") setOtherStory("Welcome back. You remembered the part that stayed."); request(); });
    window.addEventListener("focus", request);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("focus", request); link.close(); };
  }, []);

  const changePanel = (next: number) => {
    if (next < 0 || next > 4 || (next === 4 && !ready)) return;
    voice.stop(); setPauseRecording(value => value + 1); setShowRecording(false);
    needsFocus.current = true;
    setProgress(previous => ({ ...previous, panel: next }));
  };
  const changeIssue = (next: number) => {
    if (next > progress.collected.length || next < 0 || next >= EAGLE_COMIC_ISSUES.length) return;
    voice.stop(); setShowRecording(false); needsFocus.current = true;
    setProgress(previous => ({ ...previous, issue: next, panel: 0 }));
  };
  const act = useCallback((step: string) => {
    setProgress(previous => {
      const current = EAGLE_COMIC_ISSUES[previous.issue];
      const used = previous.actions[current.id] ?? [];
      if (!current.steps.includes(step) || used.includes(step)) return previous;
      return { ...previous, actions: { ...previous.actions, [current.id]: [...used, step] } };
    });
  }, []);
  const collect = () => {
    if (!ready) return;
    voice.stop(); needsFocus.current = true;
    setProgress(previous => {
      const current = EAGLE_COMIC_ISSUES[previous.issue];
      if (previous.panel !== 4 || !comicIssueReady(current, previous.actions[current.id] ?? [])) return previous;
      return { ...previous, collected: previous.collected.includes(current.id) ? previous.collected : [...previous.collected, current.id], issue: Math.min(previous.issue + 1, EAGLE_COMIC_ISSUES.length - 1), panel: previous.issue === EAGLE_COMIC_ISSUES.length - 1 ? 5 : 0 };
    });
  };

  return (
    <section className="eagle-comic-adventure" aria-label="Eagle’s four-issue interactive comic">
      <EagleJourneyNav />
      {otherStory?.startsWith("Welcome back.") && <div role="status" className="mx-auto my-5 flex max-w-[1320px] flex-wrap items-center justify-between gap-4 rounded-xl border border-[#d7bddf] bg-[#f1e3f8] p-4 text-sm text-[#795189]"><p>{otherStory}</p><Link href="/games/apollo-11-landing" className="eagle-comic-control">Try the landing lesson <ArrowRight className="h-4 w-4" /></Link></div>}
      <header className="eagle-comic-intro"><p className="eagle-comic-kicker">RoverVilla / One Moon mission. Four memories.</p><h1 className="display">I’m Eagle.<br /><span>Want to know why I stayed?</span></h1><p>The crew went home. My landing stage stayed on the Moon. Come into my memories—and see what this strange little machine helped them do.</p><div className="eagle-comic-format"><span><BookIcon className="h-4 w-4" /> Three story panels</span><span><Play className="h-4 w-4" /> Your hands on the hardware</span><span><SparkIcon className="h-4 w-4" /> A discovery to keep</span></div></header>
      <nav className="eagle-issue-library" aria-label="Eagle comic issues">
        {EAGLE_COMIC_ISSUES.map((item, i) => <button type="button" key={item.id} disabled={i > progress.collected.length} aria-current={i === progress.issue ? "step" : undefined} onClick={() => changeIssue(i)} className={i === progress.issue ? "is-active" : ""}><span className="eagle-issue-number">{String(i + 1).padStart(2, "0")}</span><span className="eagle-issue-title">{item.title}</span><span className="eagle-issue-state">{progress.collected.includes(item.id) ? "Memory kept ✓" : i > progress.collected.length ? "Recover the previous memory first" : "Ready to explore"}</span></button>)}
      </nav>
      <Link href="/heroes/apollo-11-lander/book" className="mx-auto my-6 flex max-w-[1320px] flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#c9acd6] bg-[#f0e1f7] p-6 text-[#583566] hover:bg-[#e9d6f2]"><span><span className="block text-lg font-bold">The Chronicles of Eagle</span><span className="mt-2 block text-sm leading-relaxed">One book. {APOLLO_BOOK.chapters.length} standalone true-event chapters. Read each as a comic or a storybook, with narration.</span></span><span className="flex items-center gap-2 text-sm font-semibold">Open my Book &amp; Comic Nook <ArrowRight className="h-4 w-4" /></span></Link>

      <article id="eagle-comic-reader" className="eagle-comic-reader" aria-labelledby="eagle-issue-title">
        <div className="eagle-issue-heading"><div><p className="eagle-comic-kicker">Issue {progress.issue + 1} / {EAGLE_COMIC_ISSUES.length}</p><h2 ref={heading} id="eagle-issue-title" tabIndex={-1} className="display outline-none">{done ? "You remembered the part that stayed." : issue.title}</h2><p>{issue.subtitle}</p></div>{voice.available && !done && <button type="button" className="eagle-comic-control" aria-pressed={voice.speaking} onClick={() => { if (voice.speaking) voice.stop(); else { setPauseRecording(value => value + 1); voice.start(progress.panel < 3 ? panel.bubble : progress.panel === 3 ? "Try the hardware in this illustrative scene. The actions help explain how my equipment worked." : `${issue.discovery.title} ${issue.discovery.knowledge}`); } }}>{voice.speaking ? "Stop Eagle’s voice" : "Hear imagined Eagle"}</button>}</div>

        {done ? <div className="eagle-comic-finish"><EagleIssueArt scene="quiet" /><div><p className="eagle-comic-kicker">Four memories. One extraordinary machine.</p><h3 className="display">I got them on their way.<br />You kept my story going.</h3><p>You explored the design, the difficult landing, the science, and the departure. The thank-you beacon is a small symbol saved on this device—not a message sent to the Moon.</p><Link href="/games/apollo-11-landing" className="eagle-comic-primary">Try Eagle’s 3D landing <ArrowRight className="h-4 w-4" /></Link><button type="button" className="eagle-comic-control mt-3" onClick={() => { voice.stop(); needsFocus.current = true; setProgress(EMPTY_EAGLE_COMIC); }}>Read the comic again</button></div></div> : progress.panel < 3 ? <div className="eagle-comic-panel-layout"><figure className="eagle-comic-panel" onTouchStart={event => { if (event.touches.length === 1) swipe.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => { const touch = event.changedTouches[0]; if (!touch) return; const dx = touch.clientX - swipe.current.x; const dy = touch.clientY - swipe.current.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) changePanel(Math.max(0, Math.min(3, progress.panel + (dx < 0 ? 1 : -1)))); }}><EagleIssueArt scene={panel.scene} /><figcaption className="eagle-comic-bubble">{panel.bubble}</figcaption><p className="eagle-comic-art-label">AI-assisted illustration and imagined dialogue · Not a photograph or original transmission</p></figure><div className="eagle-comic-panel-side"><p className="eagle-comic-kicker">Panel {progress.panel + 1} / 3 · Swipe the art or use Next</p><h3 className="display">{panel.title}</h3><p className="eagle-comic-challenge">{issue.challenge}</p><div className="eagle-panel-dots" role="group" aria-label="Story panels">{issue.panels.map((item, i) => <button type="button" key={item.scene} aria-label={`Panel ${i + 1}: ${item.title}`} aria-pressed={progress.panel === i} onClick={() => changePanel(i)}>{i + 1}</button>)}</div><button type="button" className="eagle-comic-primary" onClick={() => changePanel(progress.panel + 1)}>{progress.panel < 2 ? `Next: ${issue.panels[progress.panel + 1].title}` : "Let me try the hardware"}<ArrowRight className="h-4 w-4" /></button><details className="eagle-comic-note"><summary>Inside the real story</summary><p>{panel.narration}</p><a href={issue.source} target="_blank" rel="noopener noreferrer">Read the historical source ↗</a>{issue.id === "science" && <a href="https://apollojournals.org/alsj/a11/a11.clsout.html#1111231" target="_blank" rel="noopener noreferrer">Read the seismic deployment record ↗</a>}</details></div></div> : progress.panel === 3 ? <div className="eagle-comic-action-stage"><div className="mb-5"><p className="eagle-comic-kicker">Your turn, teammate</p><h3 className="display text-3xl">See what the hardware did.</h3><p className="mt-2 text-sm text-[#75627c]">{actions.length} of {issue.steps.length} actions explored. These are demonstrations—not controls for real lunar equipment.</p></div><EagleComicHardware key={issue.id} issue={issue} actions={actions} onAction={act} /><button type="button" disabled={!ready} className="eagle-comic-primary mt-6" onClick={() => changePanel(4)}>{ready ? "See what this helped us learn" : "Explore the actions to reveal the discovery"}<SparkIcon className="h-4 w-4" /></button></div> : <div className="eagle-discovery-layout"><EagleIssueArt scene={issue.panels[2].scene} engaged /><div className="eagle-discovery-card"><p className="eagle-comic-kicker"><SparkIcon className="inline h-4 w-4" /> Discovery recovered</p><h3 className="display">{issue.discovery.title}</h3><dl><div><dt>The hardware</dt><dd>{issue.discovery.hardware}</dd></div><div><dt>What it made possible</dt><dd>{issue.discovery.knowledge}</dd></div></dl><details className="eagle-comic-note"><summary>Why this memory matters</summary><p>{issue.discovery.legacy}</p><a href={issue.source} target="_blank" rel="noopener noreferrer">Read the source ↗</a></details><button type="button" className="eagle-comic-primary mt-5" onClick={collect}>{progress.issue < EAGLE_COMIC_ISSUES.length - 1 ? "Keep this memory. Open the next issue." : "We remember you, Eagle."}<ArrowRight className="h-4 w-4" /></button></div></div>}

        {progress.panel === 4 && !done && <details className="eagle-comic-note"><summary>Explore the actual components behind this issue</summary><EagleComponentList ids={issue.components} /></details>}
        {!done && <div className="eagle-comic-reader-footer"><button type="button" className="eagle-comic-control" disabled={progress.panel === 0} onClick={() => changePanel(progress.panel - 1)}><ArrowLeft className="h-4 w-4" />Previous</button><span>{voice.available ? "Read-aloud is synthetic. Your pace. No timer." : "Your pace. No timer. Read the bubbles or explore the panels."}</span></div>}
        {recording && !done && <div className="mt-5"><button type="button" className="eagle-comic-control" aria-expanded={showRecording} onClick={() => { voice.stop(); setShowRecording(value => !value); }}>{showRecording ? "Close the original recording" : "Hear the original mission recording"}</button>{showRecording && <div className="mt-4"><EagleMediaPlayer media={recording} onPlay={voice.stop} pauseSignal={pauseRecording} compact /></div>}</div>}
      </article>

      <div className="eagle-comic-extras"><details onToggle={event => { if (event.currentTarget.open) { voice.stop(); setShowRecording(false); } setExtras(event.currentTarget.open); }}><summary>Want more? Explore the real parts, films, recordings, and photo album.</summary>{extras && <EagleConsole {...props} />}</details><div className="mt-5 flex flex-wrap items-center justify-between gap-4"><p className="max-w-xl text-[11px] leading-relaxed text-[#776680]">Story issues are episodes from one Apollo mission—not separate missions. The illustrated characters and dialogue are interpretations; historical sources and original recordings are identified separately.</p><a href={`/heroes/${props.slug}/story`} target="_blank" rel="noopener noreferrer" onClick={event => { voice.stop(); const id = crypto.randomUUID(); visit.current = id; try { sessionStorage.setItem("tls:eagle:story-session", id); } catch { /* The channel works without storage. */ } event.currentTarget.href = `/heroes/${props.slug}/story?visit=${id}`; setOtherStory("Your longer story is opening in another tab."); }} className="eagle-comic-control">Open the eight-memory story ↗</a></div>{otherStory && <p role="status" className="mt-4 rounded-xl bg-[#efe1f6] p-4 text-sm text-[#765188]">{otherStory}</p>}</div>
    </section>
  );
}
