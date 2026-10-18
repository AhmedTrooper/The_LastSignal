import { useState, useRef, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  PanResponder,
  type GestureResponderEvent,
  type PanResponderGestureState,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import type { Hero } from "@thelastsignal/data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const RADAR_SIZE = Math.min(SCREEN_WIDTH - 32, 320);

interface SurfaceSimulatorProps {
  hero: Hero;
  onReachMachine: () => void;
  onCollectEcho: (echoIndex: number, text: string) => void;
  onAbort: () => void;
}

export function SurfaceSimulator({
  hero,
  onReachMachine,
  onCollectEcho,
  onAbort,
}: SurfaceSimulatorProps) {
  const isMars = hero.body === "mars";

  // Target machine coordinates relative to landing site (meters)
  // Derive deterministic target position using hero name seed
  const targetPos = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < hero.slug.length; i++) seed += hero.slug.charCodeAt(i);
    const angle = (seed % 360) * (Math.PI / 180);
    const dist = 260 + (seed % 90);
    return {
      x: Math.round(Math.cos(angle) * dist),
      z: Math.round(Math.sin(angle) * dist),
      dist,
    };
  }, [hero.slug]);

  // Three collectible telemetry echo waypoints along the journey
  const echoes = useMemo(() => {
    return [
      {
        id: 0,
        x: Math.round(targetPos.x * 0.32 + 25),
        z: Math.round(targetPos.z * 0.32 - 18),
        collected: false,
        text: hero.landing
          ? `Touchdown confirmed on ${hero.landing.date}. All systems telemetry nominal.`
          : `Carrier lock acquired. Initial telemetry verified.`,
      },
      {
        id: 1,
        x: Math.round(targetPos.x * 0.65 - 20),
        z: Math.round(targetPos.z * 0.65 + 24),
        collected: false,
        text: `Traversing ${hero.restingPlace}. Science instruments operational.`,
      },
      {
        id: 2,
        x: Math.round(targetPos.x * 0.88 + 12),
        z: Math.round(targetPos.z * 0.88 - 10),
        collected: false,
        text: `Final telemetry packet transmitting back to Deep Space Network.`,
      },
    ];
  }, [targetPos, hero]);

  // Rover physics state
  const rover = useRef({
    x: 0, // Current rover position (meters)
    z: 0,
    heading: 0, // Rover heading angle in degrees (0 = North/Up)
    speed: 0, // Current velocity (m/s)
    collectedEchoes: new Set<number>(),
    trail: [] as { x: number; z: number }[],
    finished: false,
  });

  // UI state for reactive HUD
  const [posX, setPosX] = useState(0);
  const [posZ, setPosZ] = useState(0);
  const [heading, setHeading] = useState(0);
  const [distance, setDistance] = useState(targetPos.dist);
  const [signalDbm, setSignalDbm] = useState(-105);
  const [bearingAngle, setBearingAngle] = useState(0);
  const [collectedCount, setCollectedCount] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [trail, setTrail] = useState<{ x: number; z: number }[]>([]);
  const [collectedEchoIds, setCollectedEchoIds] = useState<number[]>([]);
  const [echoAlert, setEchoAlert] = useState<string | null>(null);

  // Virtual Joystick input state: vector [-1..1]
  const [joyInput] = useState(() => ({ x: 0, y: 0 }));
  const [joyKnobPos, setJoyKnobPos] = useState({ x: 0, y: 0 });

  // PanResponder for Analog Virtual Joystick
  const [joyPanResponder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        haptic.selection();
      },
      onPanResponderMove: (
        _: GestureResponderEvent,
        gesture: PanResponderGestureState
      ) => {
        const maxRadius = 45;
        const dist = Math.sqrt(
          gesture.dx * gesture.dx + gesture.dy * gesture.dy
        );
        const clampedDist = Math.min(dist, maxRadius);
        const angle = Math.atan2(gesture.dy, gesture.dx);

        const knobX = Math.cos(angle) * clampedDist;
        const knobY = Math.sin(angle) * clampedDist;

        setJoyKnobPos({ x: knobX, y: knobY });
        joyInput.x = knobX / maxRadius;
        joyInput.y = knobY / maxRadius;
      },
      onPanResponderRelease: () => {
        setJoyKnobPos({ x: 0, y: 0 });
        joyInput.x = 0;
        joyInput.y = 0;
      },
    })
  );

  // 60 FPS Rover Driving Physics Loop
  useEffect(() => {
    let lastTime = Date.now();
    let frameId: number;

    const loop = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      if (!rover.current.finished) {
        const r = rover.current;
        const j = joyInput;

        // Joystick Y controls forward/reverse speed (-y is forward)
        const targetSpeed = -j.y * 7.5; // Max 7.5 m/s
        r.speed += (targetSpeed - r.speed) * 0.15; // Smooth acceleration/deceleration

        // Joystick X controls steering turn rate
        const turnRate = j.x * 90; // Max 90 deg/sec
        r.heading = (r.heading + turnRate * dt + 360) % 360;

        // Move rover in heading direction
        const headingRad = (r.heading * Math.PI) / 180;
        r.x += Math.sin(headingRad) * r.speed * dt;
        r.z -= Math.cos(headingRad) * r.speed * dt;

        // Leave track breadcrumb every 12 meters
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
        const currentDist = Math.hypot(dx, dz);

        // Compass bearing angle relative to rover heading
        const absoluteTargetAngle = (Math.atan2(dx, -dz) * 180) / Math.PI;
        const relativeBearing = (absoluteTargetAngle - r.heading + 360) % 360;

        // Signal strength model (dBm increases as distance decreases)
        const dbm = Math.min(
          -28,
          Math.round(-115 + (1 - Math.min(1, currentDist / targetPos.dist)) * 82)
        );

        // Check telemetry echoes proximity (within 18 meters)
        echoes.forEach((echo) => {
          if (!r.collectedEchoes.has(echo.id)) {
            const echoDist = Math.hypot(echo.x - r.x, echo.z - r.z);
            if (echoDist < 18) {
              r.collectedEchoes.add(echo.id);
              haptic.medium();
              setCollectedCount(r.collectedEchoes.size);
              setCollectedEchoIds(Array.from(r.collectedEchoes));
              setEchoAlert(echo.text);
              onCollectEcho(echo.id, echo.text);
              setTimeout(() => setEchoAlert(null), 5000);
            }
          }
        });

        // Arrival criteria: within 16 meters of the machine
        if (currentDist < 16) {
          r.finished = true;
          haptic.success();
          onReachMachine();
          return;
        }

        // Update UI states
        setPosX(Math.round(r.x));
        setPosZ(Math.round(r.z));
        setHeading(Math.round(r.heading));
        setDistance(Math.round(currentDist));
        setSignalDbm(dbm);
        setBearingAngle(Math.round(relativeBearing));
        setSpeed(Math.abs(r.speed));
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [targetPos, echoes, onReachMachine, onCollectEcho, joyInput]);

  // Radar scale factor (meters to radar pixels)
  const radarScale = RADAR_SIZE / 380;
  const radarCenter = RADAR_SIZE / 2;

  return (
    <View style={styles.container}>
      {/* 1. Header Navigation Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>SURFACE PILOT: {hero.name.toUpperCase()}</Text>
          <Text style={styles.headerSub}>
            EXTRATERRESTRIAL TRAVERSAL • {hero.restingPlace}
          </Text>
        </View>

        <Pressable onPress={onAbort} style={styles.abortBtn}>
          <Text style={styles.abortText}>ABORT</Text>
        </Pressable>
      </View>

      {/* 2. Topographical Radar & Directional Viewport */}
      <View
        style={[
          styles.radarBox,
          {
            width: RADAR_SIZE,
            height: RADAR_SIZE,
            backgroundColor: isMars ? "#1f0f08" : "#0d1117",
          },
        ]}
      >
        {/* Topographical Contour Elevation Rings */}
        <View style={styles.contourRing1} />
        <View style={styles.contourRing2} />
        <View style={styles.contourRing3} />
        <View style={styles.radarCrosshairH} />
        <View style={styles.radarCrosshairV} />

        {/* Lander Touchdown Base Marker (0,0) */}
        <View
          style={[
            styles.baseMarker,
            {
              transform: [
                { translateX: radarCenter - posX * radarScale - 6 },
                { translateY: radarCenter - posZ * radarScale - 6 },
              ],
            },
          ]}
        >
          <Ionicons name="flag" size={12} color="#10b981" />
        </View>

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
                  translateX:
                    radarCenter + (targetPos.x - posX) * radarScale - 10,
                },
                {
                  translateY:
                    radarCenter + (targetPos.z - posZ) * radarScale - 10,
                },
              ],
            },
          ]}
        >
          <View style={styles.targetPulseRing} />
          <Ionicons name="sparkles" size={16} color="#f59e0b" />
        </View>

        {/* Center Rover Avatar */}
        <View
          style={[
            styles.roverAvatar,
            {
              transform: [{ rotate: `${heading}deg` }],
            },
          ]}
        >
          <View style={styles.roverNose} />
          <View style={styles.roverBody} />
          <View style={styles.wheelL} />
          <View style={styles.wheelR} />
        </View>

        {/* Compass Needle (Upper Right HUD) */}
        <View style={styles.compassOverlay}>
          <View
            style={[
              styles.compassNeedleWrap,
              { transform: [{ rotate: `${bearingAngle}deg` }] },
            ]}
          >
            <Ionicons name="navigate" size={24} color="#38bdf8" />
          </View>
          <Text style={styles.compassText}>{distance}m</Text>
        </View>

        {/* Signal Strength Meter (Upper Left HUD) */}
        <View style={styles.signalOverlay}>
          <Ionicons name="cellular" size={16} color="#38bdf8" />
          <Text style={styles.signalText}>{signalDbm} dBm</Text>
        </View>
      </View>

      {/* 3. Echo Alert Card (Displays when recovering telemetry memories) */}
      {echoAlert && (
        <View style={styles.echoAlertBox}>
          <Ionicons name="radio-outline" size={16} color="#c084fc" />
          <View style={styles.echoAlertCol}>
            <Text style={styles.echoAlertTitle}>ARCHIVAL ECHO RECOVERED</Text>
            <Text style={styles.echoAlertDesc}>{echoAlert}</Text>
          </View>
        </View>
      )}

      {/* 4. Controls: Virtual Joystick & Driving Telemetry */}
      <View style={styles.controlsSection}>
        {/* Virtual Joystick */}
        <View style={styles.joystickArea}>
          <View style={styles.joystickBase} {...joyPanResponder.panHandlers}>
            <View
              style={[
                styles.joystickKnob,
                {
                  transform: [
                    { translateX: joyKnobPos.x },
                    { translateY: joyKnobPos.y },
                  ],
                },
              ]}
            >
              <View style={styles.joystickKnobCore} />
            </View>
          </View>
          <Text style={styles.joystickLabel}>DRIVE &amp; STEER ROVER</Text>
        </View>

        {/* Driving Metrics Bento */}
        <View style={styles.metricsCol}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>TARGET BEARING</Text>
            <Text style={styles.metricVal}>{distance} m</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>ROVER SPEED</Text>
            <Text style={styles.metricVal}>
              {speed.toFixed(1)} m/s
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>ECHOES SECURED</Text>
            <Text style={styles.metricVal}>{collectedCount} / 3</Text>
          </View>
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
  headerLeft: {
    gap: 2,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },
  headerSub: {
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: "800",
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
  radarBox: {
    borderRadius: 24,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    alignSelf: "center",
  },
  contourRing1: {
    position: "absolute",
    top: "10%",
    left: "10%",
    width: "80%",
    height: "80%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  contourRing2: {
    position: "absolute",
    top: "25%",
    left: "25%",
    width: "50%",
    height: "50%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  contourRing3: {
    position: "absolute",
    top: "40%",
    left: "40%",
    width: "20%",
    height: "20%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  radarCrosshairH: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  radarCrosshairV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  baseMarker: {
    position: "absolute",
    width: 12,
    height: 12,
  },
  trailDot: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  echoMarker: {
    position: "absolute",
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  echoMarkerCollected: {
    opacity: 0.5,
  },
  targetMarker: {
    position: "absolute",
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  targetPulseRing: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#f59e0b",
    opacity: 0.7,
  },
  roverAvatar: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 24,
    height: 32,
    marginTop: -16,
    marginLeft: -12,
    alignItems: "center",
    justifyContent: "center",
  },
  roverBody: {
    width: 14,
    height: 20,
    backgroundColor: "#ffffff",
    borderRadius: 3,
  },
  roverNose: {
    position: "absolute",
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#38bdf8",
  },
  wheelL: {
    position: "absolute",
    left: 1,
    top: 4,
    width: 3,
    height: 14,
    backgroundColor: "#475569",
    borderRadius: 1,
  },
  wheelR: {
    position: "absolute",
    right: 1,
    top: 4,
    width: 3,
    height: 14,
    backgroundColor: "#475569",
    borderRadius: 1,
  },
  compassOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  compassNeedleWrap: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  compassText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 2,
  },
  signalOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  signalText: {
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: "800",
  },
  echoAlertBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(192, 132, 252, 0.15)",
    borderColor: "rgba(192, 132, 252, 0.4)",
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
  },
  echoAlertCol: {
    flex: 1,
  },
  echoAlertTitle: {
    color: "#c084fc",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  echoAlertDesc: {
    color: "#ffffff",
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  controlsSection: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginTop: 4,
  },
  joystickArea: {
    alignItems: "center",
    gap: 6,
  },
  joystickBase: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  joystickKnob: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(99, 102, 241, 0.8)",
    borderColor: "#ffffff",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  joystickKnobCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  joystickLabel: {
    color: "rgba(255, 255, 255, 0.45)",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  metricsCol: {
    flex: 1,
    gap: 6,
  },
  metricCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  metricLabel: {
    color: "rgba(255, 255, 255, 0.45)",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  metricVal: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 1,
  },
});
