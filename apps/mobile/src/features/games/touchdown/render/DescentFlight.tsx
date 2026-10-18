import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { haptic } from "@/utils/haptics";
import type { DescentTelemetry } from "../ui/DescentHud";
import type { Hero } from "@thelastsignal/data";

export interface LandingResult {
  ok: boolean;
  grade: "feather" | "smooth" | "firm" | "hard";
  vy: number;
  offset: number;
  fuel: number;
  note?: string;
  reason?: string;
}

interface DescentFlightProps {
  hero: Hero;
  thrust: boolean;
  driftX: number;
  driftY: number;
  onTelemetry: (t: DescentTelemetry) => void;
  onFinish: (result: LandingResult) => void;
}

const ZONE = 40; // 40m landing zone radius

export function DescentFlight({
  hero,
  thrust,
  driftX,
  driftY,
  onTelemetry,
  onFinish,
}: DescentFlightProps) {
  const isMars = hero.body === "mars";
  const gravity = isMars ? 3.71 : 1.62;
  const THRUST_ACCEL = 8.8;

  // React state for perspective visual updates
  const [visAlt, setVisAlt] = useState(420);
  const [visPx, setVisPx] = useState(48);
  const [visPz, setVisPz] = useState(-36);
  const [visBurning, setVisBurning] = useState(false);

  // Physics simulation state in ref for 60fps loop
  const phys = useRef({
    alt: 420,
    vy: -16.0,
    fuel: 100,
    px: 48,
    pz: -36,
    vx: -6.5,
    vz: 4.2,
    finished: false,
  });

  const controls = useRef({ thrust, driftX, driftY });
  useEffect(() => {
    controls.current = { thrust, driftX, driftY };
  }, [thrust, driftX, driftY]);

  useEffect(() => {
    let lastTime = Date.now();
    let frameId: number;

    const loop = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      if (!phys.current.finished) {
        const p = phys.current;
        const c = controls.current;

        const isFiring = c.thrust && p.fuel > 0;
        setVisBurning(isFiring);

        // 1. Vertical acceleration
        let ay = -gravity;
        if (isFiring) {
          ay += THRUST_ACCEL;
          p.fuel = Math.max(0, p.fuel - 14 * dt);
        }

        p.vy += ay * dt;
        p.alt += p.vy * dt;

        // 2. Lateral drift from joystick
        p.vx += c.driftX * 12 * dt;
        p.vz -= c.driftY * 12 * dt; // forward is -z
        p.px += p.vx * dt;
        p.pz += p.vz * dt;

        // Suggested descent speed formula based on altitude
        const targetVy = Math.max(1.8, Math.min(24, Math.sqrt(Math.max(1, p.alt) * 1.6)));
        const vh = Math.hypot(p.vx, p.vz);
        const dist = Math.hypot(p.px, p.pz);

        // Notify parent telemetry HUD
        onTelemetry({
          alt: Math.max(0, p.alt),
          vy: p.vy,
          vh,
          dist,
          targetVy,
          fuel: p.fuel,
          isBurning: isFiring,
          px: p.px,
          pz: p.pz,
        });

        // 3. Touchdown or Crash Event Detection
        if (p.alt <= 0) {
          phys.current.finished = true;
          const touchdownSpeed = Math.abs(p.vy);
          const lateralSpeed = vh;
          const offset = dist;

          if (touchdownSpeed > 7.5) {
            haptic.heavy();
            onFinish({
              ok: false,
              grade: "hard",
              vy: touchdownSpeed,
              offset,
              fuel: p.fuel,
              reason: `CRATER IMPACT: Vertical descent speed was ${touchdownSpeed.toFixed(1)} m/s (Maximum safe tolerance: 4.0 m/s).`,
            });
            return;
          }

          if (lateralSpeed > 4.5) {
            haptic.heavy();
            onFinish({
              ok: false,
              grade: "hard",
              vy: touchdownSpeed,
              offset,
              fuel: p.fuel,
              reason: `LANDER TIPPED: Lateral drift was ${lateralSpeed.toFixed(1)} m/s on touchdown.`,
            });
            return;
          }

          // Successful Landing
          haptic.success();
          const grade: LandingResult["grade"] =
            touchdownSpeed < 1.6
              ? "feather"
              : touchdownSpeed < 2.8
              ? "smooth"
              : touchdownSpeed < 4.2
              ? "firm"
              : "hard";

          onFinish({
            ok: true,
            grade,
            vy: touchdownSpeed,
            offset,
            fuel: p.fuel,
            note:
              offset <= ZONE
                ? "Direct landing in the blue ring."
                : "Outside the ring: a longer drive.",
          });
          return;
        }

        // Update visuals
        setVisAlt(p.alt);
        setVisPx(p.px);
        setVisPz(p.pz);
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gravity, onFinish, onTelemetry]);

  // Dynamic visual sizing based on altitude
  const ringWidth = Math.min(260, Math.max(50, 240 - visAlt * 0.45));
  const ringHeight = Math.min(120, Math.max(24, 110 - visAlt * 0.2));

  return (
    <View style={styles.viewport}>
      {/* Dynamic Starfield & Horizon */}
      <View style={styles.horizonLine} />

      {/* Target LZ Blue Ring (Grows larger as lander nears ground) */}
      <View
        style={[
          styles.targetRing,
          {
            width: ringWidth,
            height: ringHeight,
            transform: [
              { translateX: -visPx * 1.2 },
              { translateY: visPz * 0.6 },
            ],
          },
        ]}
      >
        <View style={styles.ringCrosshair} />
        <Text style={styles.ringLabel}>TARGET ZONE</Text>
      </View>

      {/* Center Lander Chassis Reticle */}
      <View style={styles.landerChassisWrap}>
        <View
          style={[
            styles.landerChassis,
            visBurning && styles.landerChassisFiring,
          ]}
        >
          <Ionicons name="rocket-outline" size={36} color="#ffffff" />
        </View>

        {/* Thruster Flame Core Animation */}
        {visBurning ? (
          <View style={styles.flameWrap}>
            <View style={styles.flameCore} />
            <View style={styles.flameGlow} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#04030c",
  },
  horizonLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    top: "40%",
  },
  targetRing: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#67e8f9",
    backgroundColor: "rgba(103, 232, 249, 0.12)",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCrosshair: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#67e8f9",
  },
  ringLabel: {
    position: "absolute",
    bottom: -16,
    fontFamily: "monospace",
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#67e8f9",
    fontWeight: "700",
  },
  landerChassisWrap: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  landerChassis: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  landerChassisFiring: {
    borderColor: "#fbbf24",
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    shadowColor: "#fbbf24",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  flameWrap: {
    alignItems: "center",
    marginTop: -2,
  },
  flameCore: {
    width: 14,
    height: 32,
    backgroundColor: "#ffffff",
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  flameGlow: {
    position: "absolute",
    width: 24,
    height: 44,
    backgroundColor: "rgba(245, 158, 11, 0.4)",
    borderRadius: 12,
    top: -4,
  },
});
