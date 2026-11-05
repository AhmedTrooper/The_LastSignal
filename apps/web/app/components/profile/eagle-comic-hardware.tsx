"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import EagleMechanism from "@/app/components/story/eagle-mechanism";
import type { EagleComicIssue } from "@/lib/eagle-comic";

function ThermalGear({ actions, onAction }: { actions: string[]; onAction: (step: string) => void }) {
  const coated = actions.includes("blanket");
  const landed = actions.includes("legs");
  const reduced = useReducedMotion();
  return <div className="eagle-hardware-demo">
    <div onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === "blanket") onAction("blanket"); }}>
      <svg viewBox="0 0 600 245" role="img" aria-label={landed ? "Illustration of insulation and compressed landing-gear honeycomb" : "Illustration of an uncoated lander frame and crushable honeycomb"}>
        <rect width="600" height="245" fill="#f3e9dd" /><path d="M25 213h550" stroke="#afa0b4" strokeWidth="2" />
        <motion.g animate={{ y: landed ? 16 : 0 }} transition={{ duration: reduced ? 0 : 1 }}>
          <path d="M83 98h176v62H83z" fill={coated ? "#d5b06b" : "#d5d0cf"} stroke="#5e496c" strokeWidth="3" /><path d="m94 160-30 44m181-44 31 44" stroke="#756981" strokeWidth="5" /><ellipse cx="63" cy="207" rx="22" ry="5" fill="#b1abb0" /><ellipse cx="277" cy="207" rx="22" ry="5" fill="#b1abb0" />{coated && <path d="M101 118h138m-121 19h117" stroke="#b68a4e" strokeWidth="4" />}
        </motion.g>
        <path d="M23 36l63 46M47 18l65 43" stroke="#ddaa5b" strokeWidth="5" />{coated && <path d="m71 72 34-4-9-30" stroke="#e8b960" strokeWidth="3" fill="none" />}
        <text x="82" y="76" fill="#654771" fontSize="14">{coated ? "Insulation layers in place" : "A frame needs protection"}</text>
        <text x="354" y="56" fill="#654771" fontSize="14">Inside a landing strut</text>
        <motion.g animate={{ scaleY: landed ? 0.65 : 1, y: landed ? 43 : 0 }} style={{ transformOrigin: "438px 160px" }} transition={{ duration: reduced ? 0 : 1 }}>
          {[0, 1, 2, 3].map(i => <path key={i} d={`m${349 + i * 44} 108 20-12 20 12v24l-20 12-20-12z`} fill="#ddbe84" stroke="#7d6388" strokeWidth="3" />)}
        </motion.g>
        <text x="355" y="189" fill="#71597b" fontSize="12">{landed ? "Crushing absorbs energy" : "Crushable aluminium honeycomb"}</text>
        {landed && <><circle cx="334" cy="216" r="7" fill="#759aca" /><text x="354" y="221" fill="#5674a3" fontFamily="monospace" fontSize="11">CONTACT INDICATION</text></>}
      </svg>
    </div>
    <div className="eagle-demo-buttons"><button type="button" draggable onDragStart={event => event.dataTransfer.setData("text/plain", "blanket")} onClick={() => onAction("blanket")}>{coated ? "Blanket in place ✓" : "Place the insulation blanket"}</button><button type="button" disabled={!coated} onClick={() => onAction("legs")}>{landed ? "Landing gear explored ✓" : "Test the landing gear"}</button></div>
    <p className="eagle-demo-note">You can drag the blanket or use the button. The animation illustrates protection and shock absorption—not a measured flight temperature or compression distance.</p>
  </div>;
}

function SeismicDemo({ done, onDone }: { done: boolean; onDone: () => void }) {
  const reduced = useReducedMotion();
  return <div className="eagle-hardware-demo"><svg viewBox="0 0 600 225" role="img" aria-label="Illustration of a passive seismic package with unfolding solar panels">
    <rect width="600" height="225" fill="#ece4f2" /><rect x="254" y="63" width="91" height="100" rx="7" fill="#d6bb83" stroke="#695271" strokeWidth="3" />
    <motion.rect x="130" y="75" height="62" fill="#8192ab" stroke="#695271" strokeWidth="3" animate={{ width: done ? 122 : 17 }} transition={{ duration: reduced ? 0 : 0.9 }} /><motion.rect x="347" y="75" height="62" fill="#8192ab" stroke="#695271" strokeWidth="3" animate={{ width: done ? 122 : 17 }} transition={{ duration: reduced ? 0 : 0.9 }} />
    <path d="M45 175h510" stroke="#b7a8bf" strokeWidth="3" />{done && <motion.path d="m54 191 94-1 10-11 11 21 15-34 21 47 15-32 12 11h308" stroke="#98769e" strokeWidth="3" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 1.5 }} />}
    <text x="165" y="35" fill="#695271" fontSize="14">{done ? "The instrument can observe ground motion" : "Open the solar-panel wings"}</text>
  </svg><div className="eagle-demo-buttons"><button type="button" onClick={onDone}>{done ? "Seismic package explored ✓" : "Unfold the solar wings"}</button></div><p className="eagle-demo-note">An illustrative wave, not a recording of a specific moonquake. The crew’s real deployment is described in the source record.</p></div>;
}

export default function EagleComicHardware({ issue, actions, onAction }: { issue: EagleComicIssue; actions: string[]; onAction: (step: string) => void }) {
  const [tool, setTool] = useState<"pen" | "wrench" | null>(actions.includes("breaker") ? "pen" : null);
  if (issue.id === "spider") return <ThermalGear actions={actions} onAction={onAction} />;
  if (issue.id === "overload") return <div className="space-y-4"><EagleMechanism kind="alarm" engaged={actions.includes("guidance")} onEngage={() => onAction("guidance")} action="See guidance take priority" result="Essential guidance is preserved. This is a demonstration of priorities, not a key that reprogrammed the real flight computer." />{actions.includes("guidance") && <EagleMechanism kind="land" engaged={actions.includes("landing")} onEngage={() => onAction("landing")} action="Guide the illustrated approach to clear ground" result="The illustration reaches the clear patch. The original crew guided the real approach with engineering information and human judgment." />}</div>;
  if (issue.id === "science") return <div className="space-y-4"><SeismicDemo done={actions.includes("seismic")} onDone={() => onAction("seismic")} />{actions.includes("seismic") && <EagleMechanism kind="laser" engaged={actions.includes("laser")} onEngage={() => onAction("laser")} action="Follow a laser pulse out and back" result="Corner cubes return light toward its source. Repeated timed observations—not one pulse—reveal the Moon’s long-term motion." />}</div>;
  return <div className="space-y-4"><div className="eagle-hardware-demo p-5"><p className="text-sm font-bold">Which everyday tool did Buzz report using?</p><div className="eagle-demo-buttons mt-3"><button type="button" aria-pressed={tool === "pen"} draggable onDragStart={event => { setTool("pen"); event.dataTransfer.setData("text/plain", "pen"); }} onClick={() => setTool("pen")}>Felt-tip pen</button><button type="button" aria-pressed={tool === "wrench"} onClick={() => setTool("wrench")}>Metal wrench</button></div><div aria-live="polite">{tool === "wrench" && <p className="mt-3 text-xs leading-relaxed">That isn’t the tool described in the mission record. Try the pen.</p>}</div></div>{tool === "pen" && <div onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === "pen") onAction("breaker"); }}><EagleMechanism kind="breaker" engaged={actions.includes("breaker")} onEngage={() => onAction("breaker")} action="Use the felt-tip pen to push the breaker in" result="The illustrated circuit closes. In the mission record, Houston later confirmed that the circuitry looked fine." /></div>}{actions.includes("breaker") && <EagleMechanism kind="ascent" engaged={actions.includes("ascent")} onEngage={() => onAction("ascent")} action="Watch the two stages part" result="The ascent stage departs. The descent stage stays at Tranquility Base." />}{actions.includes("ascent") && <div className="eagle-thankyou-beacon"><p className="text-base font-bold">The part that stayed did its job.</p><p className="mt-2 text-sm leading-relaxed">Would you leave a little thank-you in this story?</p><button type="button" onClick={() => onAction("beacon")} className="mt-4">{actions.includes("beacon") ? "We remember you, Eagle ✓" : "Leave my thank-you beacon"}</button><p className="mt-3 text-[11px] leading-relaxed">A symbolic beacon on this device. It does not send a radio message to the Moon.</p></div>}</div>;
}
