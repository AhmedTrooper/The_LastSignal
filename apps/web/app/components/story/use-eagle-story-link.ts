"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { connectEagle } from "@/lib/eagle-link";

export function useEagleStoryLink(index: number, total: number, title: string, consoleHref: string) {
  const connection = useRef<ReturnType<typeof connectEagle> | null>(null);
  const visit = useRef("");
  const state = useRef({ index, title, done: false });
  const acknowledged = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [linked, setLinked] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    state.current.index = index;
    state.current.title = title;
    if (!state.current.done && visit.current) connection.current?.send({ type: "SCENE_PROGRESS", session: visit.current, machineId: "apollo-11-lander", scene: index + 1, total, title });
  }, [index, total, title]);

  useEffect(() => {
    visit.current = new URLSearchParams(window.location.search).get("visit") ?? "";
    const sendStatus = () => {
      if (!visit.current) return;
      const current = state.current;
      connection.current?.send(current.done
        ? { type: "STORY_COMPLETED", session: visit.current, machineId: "apollo-11-lander" }
        : { type: "SCENE_PROGRESS", session: visit.current, machineId: "apollo-11-lander", scene: current.index + 1, total, title: current.title });
    };
    const link = connectEagle(message => {
      if (!visit.current || message.session !== visit.current) return;
      if (message.type === "CONSOLE_READY" || message.type === "STORY_ACK") setLinked(true);
      if (message.type === "STORY_ACK" && state.current.done) acknowledged.current = true;
      if (message.type === "STATUS_REQUEST") sendStatus();
    });
    connection.current = link;
    sendStatus();
    const close = () => { if (visit.current && !state.current.done) link.send({ type: "STORY_CLOSED", session: visit.current, machineId: "apollo-11-lander" }); };
    window.addEventListener("pagehide", close);
    window.addEventListener("pageshow", sendStatus);
    return () => { window.removeEventListener("pagehide", close); window.removeEventListener("pageshow", sendStatus); link.close(); connection.current = null; if (timer.current) clearTimeout(timer.current); };
  }, [total]);

  const finish = useCallback(() => {
    if (state.current.done) return;
    state.current.done = true;
    setDone(true);
    if (visit.current) connection.current?.send({ type: "STORY_COMPLETED", session: visit.current, machineId: "apollo-11-lander" });
    // Give the paired console time to acknowledge before closing a link-opened tab.
    timer.current = setTimeout(() => {
      if (visit.current && acknowledged.current) window.close();
      timer.current = setTimeout(() => { window.location.assign(`${consoleHref}?storyCompleted=true`); }, 200);
    }, 180);
  }, [consoleHref]);

  return { linked, done, finish };
}
