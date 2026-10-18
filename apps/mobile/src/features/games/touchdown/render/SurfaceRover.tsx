import { useEffect, useRef, useState, useMemo } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { haptic } from "@/utils/haptics";
import type { CompassTarget } from "../ui/Compass";
import type { Hero } from "@thelastsignal/data";

interface SurfaceRoverProps {
  hero: Hero;
  joyX: number;
  joyY: number;
  brake: boolean;
  onCompassUpdate: (targets: CompassTarget[], speedKmh: number) => void;
  onCollectEcho: (echoIndex: number, text: string) => void;
  onReachMachine: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const RADAR_SIZE = Math.min(SCREEN_WIDTH - 48, 320);

export function SurfaceRover({
  hero,
  joyX,
  joyY,
  brake,
  onCompassUpdate,
  onCollectEcho,
  onReachMachine,
}: SurfaceRoverProps) {
  // Deterministic target position based on hero slug
  const targetPos = useMemo(() => {
    const hash = hero.slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const angle = (hash % 360) * (Math.PI / 180);
    const dist = 140 + (hash % 120); // 140 to 260m away
    return {
      x: Math.round(Math.sin(angle) * dist),
      z: Math.round(-Math.cos(angle) * dist),
      dist,
    };
  }, [hero.slug]);

  // 3 echoes scattered along the route
  const echoes = useMemo(() => {
    return [
      {
        id: 1,
        x: Math.round(targetPos.x * 0.32 + 25),
        z: Math.round(targetPos.z * 0.32 - 18),
        date: hero.landing ? hero.landing.date : hero.launch.date,
        text: hero.landing
          ? `Touchdown confirmed on ${hero.landing.date}. All systems telemetry nominal.`
          : `Carrier lock acquired. Initial telemetry verified.`,
      },
      {
        id: 2,
        x: Math.round(targetPos.x * 0.65 - 20),
        z: Math.round(targetPos.z * 0.65 + 24),
        date: hero.end.date,
        text: `Traversing ${hero.restingPlace}. Science instruments operational.`,
      },
      {
        id: 3,
        x: Math.round(targetPos.x * 0.88 + 12),
        z: Math.round(targetPos.z * 0.88 - 10),
        date: hero.end.date,
        text: `Final telemetry packet transmitting back to Deep Space Network.`,
      },
    ];
  }, [targetPos, hero]);

  // React state for HUD rendering
  const [posX, setPosX] = useState(0);
  const [posZ, setPosZ] = useState(0);
  const [heading, setHeading] = useState(0);
  const [trail, setTrail] = useState<{ x: number; z: number }[]>([]);
  const [collectedEchoIds, setCollectedEchoIds] = useState<number[]>([]);

  // Rover physics simulation ref
  const rover = useRef({
    x: 0,
    z: 0,
    heading: 0,
    speed: 0,
    collected: new Set<number>(),
    trail: [] as { x: number; z: number }[],
    finished: false,
  });

  const controls = useRef({ joyX, joyY, brake });
  useEffect(() => {
    controls.current = { joyX, joyY, brake };
  }, [joyX, joyY, brake]);

  useEffect(() => {
    let lastTime = Date.now();
    let frameId: number;

    const loop = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      if (!rover.current.finished) {
        const r = rover.current;
        const c = controls.current;

        // Speed calculation
        const targetSpeed = c.brake ? 0 : c.joyY * 7.2; // forward speed
        r.speed += (targetSpeed - r.speed) * 0.15;

        // Steering
        const turnRate = c.joyX * 90; // deg/sec
        r.heading = (r.heading + turnRate * dt + 360) % 360;

        // Move rover
        const headingRad = (r.heading * Math.PI) / 180;
        r.x += Math.sin(headingRad) * r.speed * dt;
        r.z -= Math.cos(headingRad) * r.speed * dt;

        // Track breadcrumbs
        if (
          r.trail.length === 0 ||
          Math.hypot(
            r.x - r.trail[r.trail.length - 1].x,
            r.z - r.trail[r.trail.length - 1].z
          ) > 12
        ) {
          r.trail.push({ x: r.x, z: r.z });
          if (r.trail.length > 50) r.trail.shift();
          setTrail([...r.trail]);
        }

        // Distance & Bearing to Target Machine
        const dx = targetPos.x - r.x;
        const dz = targetPos.z - r.z;
        const distToMachine = Math.hypot(dx, dz);
        const absMachineAngle = Math.atan2(dx, -dz); // radians
        const relMachineBearing =
          ((absMachineAngle - headingRad + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

        // Compass targets list
        const compassTargets: CompassTarget[] = [
          {
            id: 0,
            isMachine: true,
            bearing: relMachineBearing,
            dist: distToMachine,
            done: false,
          },
        ];

        // Echoes checking
        echoes.forEach((echo) => {
          const edx = echo.x - r.x;
          const edz = echo.z - r.z;
          const edist = Math.hypot(edx, edz);
          const eabsAngle = Math.atan2(edx, -edz);
          const erelBearing =
            ((eabsAngle - headingRad + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

          const isCollected = r.collected.has(echo.id);

          compassTargets.push({
            id: echo.id,
            isMachine: false,
            bearing: erelBearing,
            dist: edist,
            done: isCollected,
          });

          if (!isCollected && edist < 18) {
            r.collected.add(echo.id);
            haptic.medium();
            setCollectedEchoIds(Array.from(r.collected));
            onCollectEcho(echo.id, echo.text);
          }
        });

        onCompassUpdate(compassTargets, Math.abs(r.speed * 3.6));

        // Arrival at resting machine
        if (distToMachine < 16) {
          r.finished = true;
          haptic.success();
          onReachMachine();
          return;
        }

        setPosX(r.x);
        setPosZ(r.z);
        setHeading(r.heading);
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [targetPos, echoes, onCollectEcho, onReachMachine, onCompassUpdate]);

  const radarScale = RADAR_SIZE / 360;
  const radarCenter = RADAR_SIZE / 2;

  return (
    <View style={styles.viewport}>
      {/* Surface Radar Display */}
      <View
        style={[
          styles.radarBox,
          { width: RADAR_SIZE, height: RADAR_SIZE, borderRadius: RADAR_SIZE / 2 },
        ]}
      >
        {/* Radar concentric rings */}
        <View style={styles.radarRingOuter} />
        <View style={styles.radarRingMid} />

        {/* Rover Breadcrumb Wheel Tracks */}
        {trail.map((t, idx) => (
          <View
            key={idx}
            style={[
              styles.trailDot,
              {
                transform: [
                  { translateX: radarCenter + (t.x - posX) * radarScale - 1.5 },
                  { translateY: radarCenter + (t.z - posZ) * radarScale - 1.5 },
                ],
              },
            ]}
          />
        ))}

        {/* Echo Memory Waypoints */}
        {echoes.map((echo) => {
          const isCollected = collectedEchoIds.includes(echo.id);
          return (
            <View
              key={echo.id}
              style={[
                styles.echoMarker,
                isCollected && styles.echoMarkerCollected,
                {
                  transform: [
                    { translateX: radarCenter + (echo.x - posX) * radarScale - 7 },
                    { translateY: radarCenter + (echo.z - posZ) * radarScale - 7 },
                  ],
                },
              ]}
            >
              <Ionicons
                name={isCollected ? "checkmark-circle" : "radio"}
                size={14}
                color={isCollected ? "#10b981" : "#c084fc"}
              />
            </View>
          );
        })}

        {/* Target Machine Beacon Marker */}
        <View
          style={[
            styles.targetMarker,
            {
              transform: [
                {
                  translateX: radarCenter + (targetPos.x - posX) * radarScale - 10,
                },
                {
                  translateY: radarCenter + (targetPos.z - posZ) * radarScale - 10,
                },
              ],
            },
          ]}
        >
          <Ionicons name="flag" size={14} color="#a78bfa" />
        </View>

        {/* Center Rover Indicator */}
        <View
          style={[
            styles.centerRover,
            {
              left: radarCenter - 14,
              top: radarCenter - 14,
              transform: [{ rotate: `${heading}deg` }],
            },
          ]}
        >
          <Ionicons name="navigate" size={28} color="#ffffff" />
        </View>
      </View>

      <Text style={styles.scanLabel}>SURFACE TOPOLOGY RADAR</Text>
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
  radarBox: {
    backgroundColor: "rgba(11, 10, 29, 0.7)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
    position: "relative",
    overflow: "hidden",
  },
  radarRingOuter: {
    position: "absolute",
    inset: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  radarRingMid: {
    position: "absolute",
    inset: 60,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  trailDot: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  echoMarker: {
    position: "absolute",
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  echoMarkerCollected: {
    opacity: 0.4,
  },
  targetMarker: {
    position: "absolute",
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  centerRover: {
    position: "absolute",
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  scanLabel: {
    fontFamily: "monospace",
    fontSize: 9,
    letterSpacing: 2,
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 14,
    textTransform: "uppercase",
  },
});
