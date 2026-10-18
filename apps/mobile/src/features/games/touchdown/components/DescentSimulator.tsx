import { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { haptic } from "@/utils/haptics";
import type { Hero } from "@thelastsignal/data";

interface DescentSimulatorProps {
  hero: Hero;
  onSuccess: (stats: { landingSpeed: number; fuelLeft: number }) => void;
  onCrash: (reason: string) => void;
  onAbort: () => void;
}

export function DescentSimulator({
  hero,
  onSuccess,
  onCrash,
  onAbort,
}: DescentSimulatorProps) {
  const isMars = hero.body === "mars";
  // Planetary gravity (m/s^2)
  const gravity = isMars ? 3.71 : 1.62;
  const THRUST_ACCEL = 8.8; // Upward acceleration when burning (m/s^2)
  const SAFE_DESCENT_SPEED = 3.6; // Max safe vertical touchdown speed (m/s)
  const SAFE_HORIZ_SPEED = 2.4; // Max safe horizontal drift (m/s)

  // Flight simulation state (tracked with refs for 60fps physics loop + react state for HUD)
  const [alt, setAlt] = useState(420); // Altitude in meters
  const [vy, setVy] = useState(-16.0); // Vertical velocity (m/s, negative = downwards)
  const [fuel, setFuel] = useState(100); // Fuel percentage
  const [posX, setPosX] = useState(48); // Horizontal drift X (meters from target)
  const [posZ, setPosZ] = useState(-36); // Horizontal drift Z (meters from target)
  const [vx, setVx] = useState(-6.5); // Horizontal speed X
  const [vz, setVz] = useState(4.2); // Horizontal speed Z
  const [isBurning, setIsBurning] = useState(false);
  const [statusMsg, setStatusMsg] = useState("AUTOPILOT ENGAGED • RETRO-BURN AVAILABLE");

  // Physics loop state refs to avoid React render lag in 60fps loop
  const phys = useRef({
    alt: 420,
    vy: -16.0,
    fuel: 100,
    posX: 48,
    posZ: -36,
    vx: -6.5,
    vz: 4.2,
    isBurning: false,
    gimbalX: 0,
    gimbalZ: 0,
    finished: false,
  });

  const animFrame = useRef<number | null>(null);
  const lastTime = useRef<number>(0);

  // Handle retro-burn button hold
  const startBurn = useCallback(() => {
    phys.current.isBurning = true;
    setIsBurning(true);
    haptic.medium();
  }, []);

  const stopBurn = useCallback(() => {
    phys.current.isBurning = false;
    setIsBurning(false);
  }, []);

  // Lateral RCS steering nudges
  const nudgeLateral = useCallback((dx: number, dz: number) => {
    if (phys.current.finished) return;
    phys.current.vx += dx * 2.8;
    phys.current.vz += dz * 2.8;
    phys.current.fuel = Math.max(0, phys.current.fuel - 0.8);
    haptic.light();
  }, []);

  // Main 60 FPS Physics Simulation Loop
  useEffect(() => {
    lastTime.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTime.current) / 1000, 0.08); // dt in seconds
      lastTime.current = now;

      if (!phys.current.finished) {
        const p = phys.current;

        // 1. Calculate vertical acceleration
        let ay = -gravity;
        if (p.isBurning && p.fuel > 0) {
          ay += THRUST_ACCEL;
          p.fuel = Math.max(0, p.fuel - 7.5 * dt); // Deplete fuel
        }

        // 2. Integrate vertical velocity & altitude
        p.vy += ay * dt;
        p.alt += p.vy * dt;

        // 3. Integrate horizontal drift
        p.posX += p.vx * dt;
        p.posZ += p.vz * dt;
        // Atmospheric drag dampens horizontal velocity slightly
        p.vx *= 0.992;
        p.vz *= 0.992;

        // 4. Check Ground Touchdown vs Crash
        if (p.alt <= 0) {
          p.alt = 0;
          p.finished = true;

          const speed = Math.abs(p.vy);
          const horizSpeed = Math.sqrt(p.vx * p.vx + p.vz * p.vz);

          if (speed > SAFE_DESCENT_SPEED) {
            haptic.heavy();
            onCrash(
              `HARD IMPACT: Descent rate was ${speed.toFixed(1)} m/s (Maximum safe threshold: ${SAFE_DESCENT_SPEED} m/s).`
            );
          } else if (horizSpeed > SAFE_HORIZ_SPEED) {
            haptic.heavy();
            onCrash(
              `LANDER TIPPED: Lateral drift was ${horizSpeed.toFixed(1)} m/s (Maximum safe threshold: ${SAFE_HORIZ_SPEED} m/s).`
            );
          } else {
            haptic.success();
            onSuccess({
              landingSpeed: speed,
              fuelLeft: Math.round(p.fuel),
            });
          }
          return;
        }

        // Update React state for HUD
        setAlt(Math.max(0, Math.round(p.alt)));
        setVy(Math.round(p.vy * 10) / 10);
        setFuel(Math.round(p.fuel));
        setPosX(Math.round(p.posX));
        setPosZ(Math.round(p.posZ));
        setVx(Math.round(p.vx * 10) / 10);
        setVz(Math.round(p.vz * 10) / 10);

        // Flight computer telemetry advisory
        if (p.alt < 80 && Math.abs(p.vy) > SAFE_DESCENT_SPEED) {
          setStatusMsg("CRITICAL: VELOCITY HIGH! HOLD RETRO-BURN!");
        } else if (p.fuel < 15) {
          setStatusMsg("WARNING: LOW FUEL LEVEL!");
        } else if (p.isBurning) {
          setStatusMsg("THRUSTERS FIRING • DECELERATING");
        } else {
          setStatusMsg("GLIDE DESCENT • HOLD BURN TO DECELERATE");
        }
      }

      animFrame.current = requestAnimationFrame(loop);
    };

    animFrame.current = requestAnimationFrame(loop);

    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [gravity, SAFE_DESCENT_SPEED, SAFE_HORIZ_SPEED, onCrash, onSuccess]);

  const descentSpeed = Math.abs(vy);
  const isSpeedSafe = descentSpeed <= SAFE_DESCENT_SPEED;
  const horizSpeed = Math.sqrt(vx * vx + vz * vz);
  const isHorizSafe = horizSpeed <= SAFE_HORIZ_SPEED;
  const distFromTarget = Math.round(Math.sqrt(posX * posX + posZ * posZ));

  return (
    <View style={styles.container}>
      {/* 1. Header Flight Status */}
      <View style={styles.header}>
        <View style={styles.siteInfo}>
          <Text style={styles.siteTarget}>DESCENT: {hero.name.toUpperCase()}</Text>
          <Text style={styles.planetBadge}>
            {isMars ? "MARS ATMOSPHERE (3.71 m/s²)" : "LUNAR GRAVITY (1.62 m/s²)"}
          </Text>
        </View>

        <Pressable onPress={onAbort} style={styles.abortBtn}>
          <Text style={styles.abortText}>ABORT</Text>
        </Pressable>
      </View>

      {/* 2. Main Descent Viewport (Target Reticle + Surface Perspective) */}
      <View style={styles.viewport}>
        {/* Dynamic Horizon and Altitude Perspective Lines */}
        <View style={styles.perspectiveStage}>
          {/* Surface Landing Target Ellipse (grows larger as altitude drops) */}
          <View
            style={[
              styles.targetEllipse,
              {
                width: Math.min(260, Math.max(60, 240 - alt * 0.45)),
                height: Math.min(120, Math.max(25, 110 - alt * 0.2)),
                transform: [
                  { translateX: -posX * 1.2 },
                  { translateY: posZ * 0.6 },
                ],
              },
            ]}
          >
            <View style={styles.targetCrosshair} />
            <Text style={styles.targetLabel}>TARGET LZ</Text>
          </View>

          {/* Central Lander Reticle */}
          <View style={styles.landerGraphicWrap}>
            <View
              style={[
                styles.landerChassis,
                isBurning && styles.landerChassisFiring,
              ]}
            >
              <Ionicons name="rocket-outline" size={36} color="#ffffff" />
            </View>

            {/* Dynamic Thruster Exhaust Flame Animation */}
            {isBurning && fuel > 0 && (
              <View style={styles.flameContainer}>
                <View style={styles.flameCore} />
                <View style={styles.flameOuter} />
              </View>
            )}
          </View>
        </View>

        {/* Flight Computer Telemetry Message Strip */}
        <View
          style={[
            styles.telemetryStrip,
            !isSpeedSafe && alt < 120 && styles.telemetryStripAlert,
          ]}
        >
          <Ionicons
            name={
              !isSpeedSafe && alt < 120
                ? "warning"
                : isBurning
                ? "flame"
                : "hardware-chip"
            }
            size={13}
            color={!isSpeedSafe && alt < 120 ? "#ef4444" : "#38bdf8"}
          />
          <Text
            style={[
              styles.telemetryText,
              !isSpeedSafe && alt < 120 && styles.telemetryTextAlert,
            ]}
          >
            {statusMsg}
          </Text>
        </View>
      </View>

      {/* 3. Real-Time Telemetry HUD Tapes */}
      <View style={styles.hudRow}>
        {/* Altitude Tape */}
        <View style={styles.hudCard}>
          <Text style={styles.hudLabel}>ALTITUDE</Text>
          <View style={styles.hudValueRow}>
            <Text style={styles.hudValueBig}>{alt}</Text>
            <Text style={styles.hudUnit}>m</Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${Math.min(100, (alt / 450) * 100)}%` },
              ]}
            />
          </View>
        </View>

        {/* Vertical Descent Speed Tape */}
        <View
          style={[
            styles.hudCard,
            !isSpeedSafe && alt < 100 && styles.hudCardDanger,
          ]}
        >
          <Text style={styles.hudLabel}>DESCENT RATE</Text>
          <View style={styles.hudValueRow}>
            <Text
              style={[
                styles.hudValueBig,
                { color: isSpeedSafe ? "#10b981" : "#ef4444" },
              ]}
            >
              {descentSpeed.toFixed(1)}
            </Text>
            <Text style={styles.hudUnit}>m/s</Text>
          </View>
          <Text style={styles.hudSub}>SAFE: &lt; {SAFE_DESCENT_SPEED} m/s</Text>
        </View>

        {/* Fuel Gauge */}
        <View style={styles.hudCard}>
          <Text style={styles.hudLabel}>HYPERGOLIC FUEL</Text>
          <View style={styles.hudValueRow}>
            <Text
              style={[
                styles.hudValueBig,
                { color: fuel > 25 ? "#f59e0b" : "#ef4444" },
              ]}
            >
              {fuel}
            </Text>
            <Text style={styles.hudUnit}>%</Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${fuel}%`,
                  backgroundColor: fuel > 25 ? "#f59e0b" : "#ef4444",
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* 4. Flight Controls: Lateral Gimbal Nudges + Retro-Burn Button */}
      <View style={styles.controlsRow}>
        {/* Lateral RCS Nudge Cross */}
        <View style={styles.rcsCluster}>
          <Text style={styles.rcsLabel}>RCS GIMBAL</Text>
          <View style={styles.rcsGrid}>
            <Pressable
              onPress={() => nudgeLateral(0, -1)}
              style={styles.rcsBtn}
            >
              <Ionicons name="caret-up" size={16} color="#ffffff" />
            </Pressable>
            <View style={styles.rcsMiddleRow}>
              <Pressable
                onPress={() => nudgeLateral(-1, 0)}
                style={styles.rcsBtn}
              >
                <Ionicons name="caret-back" size={16} color="#ffffff" />
              </Pressable>
              <View style={styles.rcsCenterMarker}>
                <Text style={styles.rcsDistText}>{distFromTarget}m</Text>
                <Text
                  style={[
                    styles.rcsDriftText,
                    { color: isHorizSafe ? "#10b981" : "#ef4444" },
                  ]}
                >
                  {horizSpeed.toFixed(1)}m/s
                </Text>
              </View>
              <Pressable
                onPress={() => nudgeLateral(1, 0)}
                style={styles.rcsBtn}
              >
                <Ionicons name="caret-forward" size={16} color="#ffffff" />
              </Pressable>
            </View>
            <Pressable
              onPress={() => nudgeLateral(0, 1)}
              style={styles.rcsBtn}
            >
              <Ionicons name="caret-down" size={16} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* Massive Primary Retro-Burn Hold Button */}
        <View style={styles.burnCluster}>
          <Pressable
            onPressIn={startBurn}
            onPressOut={stopBurn}
            disabled={fuel <= 0}
            style={({ pressed }) => [
              styles.burnBtn,
              pressed && styles.burnBtnPressed,
              fuel <= 0 && styles.burnBtnDisabled,
            ]}
          >
            <Ionicons name="flame" size={32} color="#ffffff" />
            <Text style={styles.burnBtnTitle}>HOLD FOR RETRO-BURN</Text>
            <Text style={styles.burnBtnSub}>+8.8 m/s² COUNTER-THRUST</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070814",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  siteInfo: {
    gap: 2,
  },
  siteTarget: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },
  planetBadge: {
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  abortBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  abortText: {
    color: "#ef4444",
    fontSize: 10,
    fontWeight: "800",
  },
  viewport: {
    height: 220,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderRadius: 20,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    justifyContent: "space-between",
    padding: 12,
  },
  perspectiveStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  targetEllipse: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#38bdf8",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(56, 189, 248, 0.08)",
  },
  targetCrosshair: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#38bdf8",
  },
  targetLabel: {
    position: "absolute",
    top: -16,
    color: "#38bdf8",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
  },
  landerGraphicWrap: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  landerChassis: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(99, 102, 241, 0.25)",
    borderColor: "#a5b4fc",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  landerChassisFiring: {
    borderColor: "#f59e0b",
    backgroundColor: "rgba(245, 158, 11, 0.3)",
    transform: [{ scale: 1.05 }],
  },
  flameContainer: {
    position: "absolute",
    top: 54,
    alignItems: "center",
  },
  flameCore: {
    width: 8,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    zIndex: 2,
  },
  flameOuter: {
    position: "absolute",
    top: 2,
    width: 18,
    height: 38,
    borderRadius: 9,
    backgroundColor: "#f59e0b",
    opacity: 0.8,
  },
  telemetryStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(10, 15, 30, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    alignSelf: "center",
  },
  telemetryStripAlert: {
    backgroundColor: "rgba(239, 68, 68, 0.25)",
    borderColor: "rgba(239, 68, 68, 0.6)",
  },
  telemetryText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  telemetryTextAlert: {
    color: "#fca5a5",
  },
  hudRow: {
    flexDirection: "row",
    gap: 8,
  },
  hudCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 14,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    padding: 10,
    gap: 4,
  },
  hudCardDanger: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },
  hudLabel: {
    color: "rgba(255, 255, 255, 0.45)",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  hudValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  hudValueBig: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  hudUnit: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 10,
    fontWeight: "700",
  },
  hudSub: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 8,
    fontWeight: "700",
  },
  barTrack: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 2,
  },
  barFill: {
    height: "100%",
    backgroundColor: "#38bdf8",
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    alignItems: "center",
  },
  rcsCluster: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    gap: 4,
  },
  rcsLabel: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  rcsGrid: {
    alignItems: "center",
    gap: 3,
  },
  rcsMiddleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  rcsBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  rcsCenterMarker: {
    width: 38,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  rcsDistText: {
    color: "#38bdf8",
    fontSize: 9,
    fontWeight: "900",
  },
  rcsDriftText: {
    fontSize: 7.5,
    fontWeight: "800",
  },
  burnCluster: {
    flex: 1,
  },
  burnBtn: {
    backgroundColor: "#ea580c",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    shadowColor: "#ea580c",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  burnBtnPressed: {
    backgroundColor: "#c2410c",
    transform: [{ scale: 0.97 }],
  },
  burnBtnDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    shadowOpacity: 0,
  },
  burnBtnTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  burnBtnSub: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});
