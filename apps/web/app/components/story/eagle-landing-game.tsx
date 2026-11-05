"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOULDERS, LANDING_ZONE, initialLanding, stepLanding, type LandingState } from "@/lib/eagle-landing";
import { ArrowLeft, ArrowRight, Play } from "@/app/components/icons";

type Props = { onLanded?: () => void; compact?: boolean };

/** A small Three.js control game. Its readouts are explicit gameplay units. */
export default function EagleLandingGame({ onLanded, compact = false }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef(initialLanding());
  const controls = useRef({ throttle: 55, left: false, right: false, paused: false });
  const landed = useRef(onLanded);
  const [hud, setHud] = useState<LandingState>(initialLanding);
  const [throttle, setThrottle] = useState(55);
  const [paused, setPaused] = useState(false);
  const [graphics, setGraphics] = useState<"loading" | "ready" | "unavailable">("loading");
  const [steering, setSteering] = useState(0);

  useEffect(() => { landed.current = onLanded; }, [onLanded]);
  const start = useCallback(() => {
    state.current = { ...initialLanding(), status: "flying" };
    controls.current.left = false;
    controls.current.right = false;
    controls.current.paused = false;
    controls.current.throttle = 55;
    setThrottle(55); setSteering(0); setPaused(false); setHud(state.current);
  }, []);
  const setPower = (value: number) => { controls.current.throttle = value; setThrottle(value); };
  const pause = useCallback(() => {
    controls.current.paused = !controls.current.paused;
    setPaused(controls.current.paused);
  }, []);
  const steer = (direction: -1 | 1, pressed: boolean) => {
    if (direction === -1) controls.current.left = pressed;
    else controls.current.right = pressed;
    setSteering(Number(controls.current.right) - Number(controls.current.left));
  };

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    void import("three").then(THREE => {
      if (disposed || !host.current) return;
      const element = host.current;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); } catch { setGraphics("unavailable"); return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x090910);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.setAttribute("aria-hidden", "true");
      element.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x090910, 65, 150);
      const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 220);
      camera.position.set(25, 24, 50);
      camera.lookAt(1, 8, 0);
      scene.add(new THREE.HemisphereLight(0xc7d2ff, 0x292230, 2.5));
      const sun = new THREE.DirectionalLight(0xffe2b0, 3.5);
      sun.position.set(-24, 35, 20);
      scene.add(sun);

      const surface = new THREE.Mesh(new THREE.PlaneGeometry(180, 100), new THREE.MeshStandardMaterial({ color: 0x514b49, roughness: 1 }));
      surface.rotation.x = -Math.PI / 2;
      surface.position.y = -1.25;
      scene.add(surface);
      const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x756c61, roughness: 1, flatShading: true });
      BOULDERS.forEach((x, i) => {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 + i % 2 * 0.5, 0), rockMaterial);
        rock.position.set(x, -0.4, i % 2 ? -1 : 1.5);
        rock.scale.set(1.2, 0.7, 0.9); rock.rotation.set(i, i * 0.9, 0.2);
        scene.add(rock);
      });
      for (let i = 0; i < 55; i++) {
        const x = (i * 17.1) % 95 - 45, z = (i * 8.3) % 55 - 35;
        if (Math.hypot(x - LANDING_ZONE.x, z) < 5) continue;
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.15 + i % 4 * 0.08), rockMaterial);
        rock.position.set(x, -1.1, z);
        scene.add(rock);
      }
      const pad = new THREE.Mesh(new THREE.RingGeometry(2.4, LANDING_ZONE.halfWidth, 64), new THREE.MeshBasicMaterial({ color: 0xbdaaff, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(LANDING_ZONE.x, -1.2, 0);
      scene.add(pad);
      const zone = new THREE.Mesh(new THREE.CircleGeometry(LANDING_ZONE.halfWidth, 64), new THREE.MeshBasicMaterial({ color: 0xa991fa, opacity: 0.1, transparent: true, side: THREE.DoubleSide }));
      zone.rotation.x = -Math.PI / 2; zone.position.copy(pad.position); zone.position.y += 0.01;
      scene.add(zone);

      const craft = new THREE.Group();
      const gold = new THREE.MeshStandardMaterial({ color: 0xb28d4e, metalness: 0.55, roughness: 0.6, flatShading: true });
      const silver = new THREE.MeshStandardMaterial({ color: 0xd8d3d4, metalness: 0.6, roughness: 0.55, flatShading: true });
      const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x252331, metalness: 0.2, roughness: 0.3 });
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.9, 8), gold);
      lower.position.y = 0.6; craft.add(lower);
      const cabin = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4, 0), silver);
      cabin.scale.set(1, 0.85, 0.8); cabin.position.y = 2.05; craft.add(cabin);
      for (const x of [-0.55, 0.55]) {
        const window = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.45), windowMaterial);
        window.position.set(x, 2.25, 1.08); craft.add(window);
      }
      const strut = (a: number[], b: number[]) => {
        const from = new THREE.Vector3(...a), to = new THREE.Vector3(...b);
        const line = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, from.distanceTo(to), 6), silver);
        line.position.copy(from.clone().add(to).multiplyScalar(0.5));
        line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.sub(from).normalize());
        craft.add(line);
      };
      for (let i = 0; i < 4; i++) {
        const angle = i * Math.PI / 2 + Math.PI / 4;
        const x = Math.cos(angle), z = Math.sin(angle);
        strut([x, 0.75, z], [x * 2.35, -0.85, z * 2.35]);
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.13, 12), silver);
        foot.position.set(x * 2.35, -0.95, z * 2.35); craft.add(foot);
      }
      const plume = new THREE.Mesh(new THREE.ConeGeometry(0.42, 3, 12), new THREE.MeshBasicMaterial({ color: 0xdac4ff, transparent: true, opacity: 0.5 }));
      plume.rotation.z = Math.PI;
      plume.position.y = -1;
      craft.add(plume);
      scene.add(craft);
      const shadow = new THREE.Mesh(new THREE.CircleGeometry(2, 32), new THREE.MeshBasicMaterial({ color: 0x080810, transparent: true, opacity: 0.4 }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.18;
      scene.add(shadow);
      const vertices = new Float32Array(240 * 3);
      for (let i = 0; i < 240; i++) {
        vertices[i * 3] = ((i * 61.73) % 180) - 90;
        vertices[i * 3 + 1] = 24 + (i * 17.9) % 70;
        vertices[i * 3 + 2] = -40 - (i * 3.7) % 40;
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xdad7ea, size: 0.12 })));

      const resize = () => {
        const { width, height } = element.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(1, height);
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(element); resize();
      let last = 0, update = 0;
      renderer.setAnimationLoop((now: number) => {
        const dt = last ? (now - last) / 1000 : 0;
        last = now;
        if (document.hidden) return;
        const before = state.current;
        if (!controls.current.paused) state.current = stepLanding(before, controls.current.throttle, Number(controls.current.right) - Number(controls.current.left), dt);
        if (before.status !== "landed" && state.current.status === "landed") landed.current?.();
        craft.position.set(state.current.x, state.current.y, 0);
        craft.rotation.z = (Number(controls.current.left) - Number(controls.current.right)) * 0.1;
        plume.visible = state.current.status === "flying" && state.current.fuel > 0;
        plume.scale.y = Math.max(0.1, controls.current.throttle / 100);
        shadow.position.x = state.current.x;
        shadow.scale.setScalar(0.8 + state.current.y * 0.035);
        if ((state.current.status === "flying" && !controls.current.paused && now - update > 100) || before.status !== state.current.status) { update = now; setHud({ ...state.current }); }
        renderer.render(scene, camera);
      });
      const hide = () => {
        controls.current.left = false; controls.current.right = false; setSteering(0);
        if (document.hidden && state.current.status === "flying") { controls.current.paused = true; setPaused(true); }
      };
      const loseContext = (event: Event) => { event.preventDefault(); controls.current.paused = true; setPaused(true); setGraphics("unavailable"); };
      document.addEventListener("visibilitychange", hide);
      window.addEventListener("blur", hide);
      renderer.domElement.addEventListener("webglcontextlost", loseContext);
      setGraphics("ready");
      cleanup = () => {
        renderer.setAnimationLoop(null); observer.disconnect();
        document.removeEventListener("visibilitychange", hide); window.removeEventListener("blur", hide);
        renderer.domElement.removeEventListener("webglcontextlost", loseContext);
        const geometries = new Set<InstanceType<typeof THREE.BufferGeometry>>();
        const materials = new Set<InstanceType<typeof THREE.Material>>();
        scene.traverse(object => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
            geometries.add(object.geometry);
            (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
          }
        });
        geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => { if (!disposed) setGraphics("unavailable"); });
    return () => { disposed = true; cleanup(); };
  }, []);

  const keyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).tagName === "INPUT") return;
    if (["ArrowLeft", "a", "A"].includes(event.key)) { event.preventDefault(); steer(-1, true); }
    if (["ArrowRight", "d", "D"].includes(event.key)) { event.preventDefault(); steer(1, true); }
  };
  const keyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (["ArrowLeft", "a", "A"].includes(event.key)) steer(-1, false);
    if (["ArrowRight", "d", "D"].includes(event.key)) steer(1, false);
  };

  return (
    <section className="eagle-mechanism" aria-label="Eagle landing control game" onKeyDown={keyDown} onKeyUp={keyUp}>
      <div className="relative">
        <div ref={host} className={`relative bg-[#090910] ${compact ? "aspect-[4/3]" : "aspect-[16/9] min-h-64"} [&_canvas]:h-full [&_canvas]:w-full`} aria-label="Illustrated lunar approach with boulders and a clear landing zone" role="img" />
        <div className="pointer-events-none absolute inset-x-3 top-3 flex justify-between gap-3 font-mono text-[9px] text-white/65"><span className="rounded bg-black/50 px-2 py-1">THREE.JS · ILLUSTRATIVE TERRAIN</span><span className="rounded bg-black/50 px-2 py-1">{paused ? "PAUSED" : hud.status.toUpperCase()}</span></div>
        {hud.status === "ready" && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 px-5 text-center"><p className="display text-3xl text-white">Find a place for my feet.</p><p className="mt-3 max-w-sm text-xs leading-relaxed text-white/75">Clear the boulders. Brake sideways. Use thrust to settle gently on the violet patch.</p><button type="button" onClick={start} disabled={graphics !== "ready"} className="eagle-utility mt-5 bg-violet! disabled:opacity-40"><Play className="h-4 w-4" />{graphics === "loading" ? "Preparing the approach…" : "Take the controls"}</button></div>}
        {graphics === "unavailable" && <div className="absolute inset-0 flex items-center justify-center bg-[#090910]/95 p-6 text-center text-sm text-white/65">3D graphics aren’t available here. The original film and schematic remain available in the story.</div>}
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-4 gap-2 border-b border-white/10 pb-3 font-mono text-[9px] text-white/60"><span>HEIGHT <strong className="mt-1 block text-base text-[#ddceff]">{hud.y.toFixed(1)} <span className="text-[9px]">u</span></strong></span><span>DESCENT <strong className="mt-1 block text-base text-[#ddceff]">{Math.max(0, -hud.vy).toFixed(1)} <span className="text-[9px]">u/s</span></strong></span><span>DRIFT <strong className="mt-1 block text-base text-[#ddceff]">{hud.vx < 0 ? "←" : "→"}{Math.abs(hud.vx).toFixed(1)}</strong></span><span>RESERVE <strong className="mt-1 block text-base text-[#ddceff]">{Math.round(hud.fuel)}%</strong></span></div>
        <label className="mt-4 block text-xs text-white/75">Engine thrust <span className="float-right font-mono text-[#c1b4ff]">{throttle}%</span><input type="range" min="0" max="100" value={throttle} onChange={event => setPower(Number(event.target.value))} aria-label="Landing engine thrust" className="eagle-audio-range mt-1 w-full" /></label>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {([-1, 1] as const).map(direction => <button key={direction} type="button" aria-label={direction === -1 ? "Hold left thrust" : "Hold right thrust"} aria-pressed={steering === direction} onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); steer(direction, true); }} onPointerUp={() => steer(direction, false)} onPointerCancel={() => steer(direction, false)} onLostPointerCapture={() => steer(direction, false)} onKeyDown={event => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); steer(direction, true); } }} onKeyUp={event => { if (event.key === " " || event.key === "Enter") steer(direction, false); }} onBlur={() => steer(direction, false)} className="eagle-utility touch-none select-none" disabled={hud.status !== "flying"}>{direction === -1 ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}Hold {direction === -1 ? "left" : "right"}</button>)}
          {hud.status === "flying" && <button type="button" onClick={pause} className="eagle-utility">{paused ? "Resume" : "Pause"}</button>}
          {hud.status !== "ready" && <button type="button" onClick={start} className="ml-auto min-h-11 text-xs text-white/60 hover:text-white">Try again</button>}
        </div>
        <p role="status" className={`mt-3 text-xs leading-relaxed ${hud.status === "landed" ? "text-[#d4c4ff]" : "text-white/65"}`}>{hud.reason}</p>
        <details className="mt-3 text-[10px] leading-relaxed text-white/45"><summary className="cursor-pointer py-2">Controls &amp; what this illustrates</summary><p>Arrow keys or A/D steer while focus is inside the game. The slider changes thrust. Reach the clear patch with little sideways motion and a gentle descent. These are invented gameplay units and terrain, not Apollo 11 flight telemetry. The historical lesson is the need to avoid rough ground while managing the approach.</p><a href="https://apollojournals.org/alsj/a11/a11.landing.html" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[#c1b4ff] underline">Read the actual landing record ↗</a></details>
      </div>
    </section>
  );
}
