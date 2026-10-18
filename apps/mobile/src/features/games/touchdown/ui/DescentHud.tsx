import { StyleSheet, View, Text } from "react-native";

export interface DescentTelemetry {
  alt: number; // Altitude in meters
  vy: number; // Vertical velocity (negative = downward)
  vh: number; // Horizontal speed (m/s)
  dist: number; // Distance to landing zone (m)
  targetVy: number; // Suggested descent speed (m/s)
  fuel: number; // Fuel percentage (0-100)
  isBurning: boolean; // Engine firing
  px: number; // Lander position X relative to target (m)
  pz: number; // Lander position Z relative to target (m)
}

interface DescentHudProps {
  telemetry: DescentTelemetry;
  mars: boolean;
}

export function DescentHud({ telemetry }: DescentHudProps) {
  const { alt, vy, vh, dist, targetVy, fuel, isBurning, px, pz } = telemetry;
  const down = -vy;
  const over = down - targetVy;
  const speedColor =
    down <= 0.2
      ? "#ffffff"
      : over <= 1.5
      ? "#6ee7b7"
      : over <= 5
      ? "#fcd34d"
      : "#fda4af";

  const fuelColor = fuel < 20 ? "#fb7185" : fuel < 40 ? "#fbbf24" : "#a78bfa";

  // Radar math: 180m radius maps to radar scope (diameter 110)
  const RADAR_RADIUS = 50;
  const scale = RADAR_RADIUS / 180;
  const clampedX = Math.max(-RADAR_RADIUS + 4, Math.min(RADAR_RADIUS - 4, px * scale));
  const clampedY = Math.max(-RADAR_RADIUS + 4, Math.min(RADAR_RADIUS - 4, pz * scale));

  return (
    <View style={styles.hudContainer}>
      {/* 1. Main Instrument Tape Card */}
      <View style={styles.card}>
        <View style={styles.altRow}>
          <View>
            <Text style={styles.label}>ALTITUDE</Text>
            <View style={styles.valueRow}>
              <Text style={styles.altValue}>
                {alt >= 100 ? alt.toFixed(0) : alt.toFixed(1)}
              </Text>
              <Text style={styles.altUnit}>m</Text>
            </View>
          </View>

          {/* Vertical Descent Speed Tape */}
          <View style={styles.vTapeTrack}>
            <View
              style={[
                styles.vTapeFill,
                {
                  height: `${Math.min(100, Math.max(0, (down / 28) * 100))}%`,
                  backgroundColor: speedColor,
                },
              ]}
            />
            <View
              style={[
                styles.vTapeTargetTick,
                {
                  bottom: `${Math.min(100, (targetVy / 28) * 100)}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* 2-Column Telemetry Grid */}
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <Text style={styles.gridLabel}>
              Down m/s <Text style={styles.gridSub}>· aim {targetVy.toFixed(0)}</Text>
            </Text>
            <Text style={[styles.gridVal, { color: speedColor }]}>
              {down >= 0 ? "↓" : "↑"} {Math.abs(down).toFixed(1)}
            </Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={styles.gridLabel}>Side m/s</Text>
            <Text
              style={[
                styles.gridVal,
                { color: alt < 150 && vh > 2.4 ? "#fda4af" : "#ffffff" },
              ]}
            >
              {vh.toFixed(1)}
            </Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={styles.gridLabel}>To zone m</Text>
            <Text
              style={[
                styles.gridVal,
                { color: dist <= 40 ? "#67e8f9" : "#ffffff" },
              ]}
            >
              {dist.toFixed(0)}
            </Text>
          </View>
        </View>

        <Text style={styles.modeText}>DRIFT HOLD ON</Text>

        {/* Fuel Gauge */}
        <View style={styles.fuelContainer}>
          <View style={styles.fuelHeader}>
            <Text style={styles.fuelLabel}>
              Fuel{" "}
              {isBurning ? (
                <Text style={styles.burnText}>● burn</Text>
              ) : null}
            </Text>
            <Text style={styles.fuelNum}>{Math.max(0, Math.round(fuel))}%</Text>
          </View>
          <View style={styles.fuelTrack}>
            <View
              style={[
                styles.fuelFill,
                {
                  width: `${Math.max(0, Math.min(100, fuel))}%`,
                  backgroundColor: fuelColor,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* 2. Circular Radar Scope */}
      <View style={styles.radarCard}>
        <Text style={styles.radarLabel}>AHEAD</Text>
        {/* Radar Rings */}
        <View style={[styles.radarRing, { width: 100, height: 100, borderRadius: 50 }]} />
        <View style={[styles.radarRing, { width: 64, height: 64, borderRadius: 32 }]} />
        {/* Target Zone Ring */}
        <View style={styles.radarTargetZone} />
        {/* Crosshair Lines */}
        <View style={styles.radarCrossH} />
        <View style={styles.radarCrossV} />

        {/* Target LZ Marker (Diamond) */}
        <View style={styles.targetDiamond} />

        {/* Lander Position Marker (Dot) */}
        <View
          style={[
            styles.landerDot,
            {
              transform: [
                { translateX: -clampedX },
                { translateY: clampedY },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hudContainer: {
    alignItems: "flex-end",
    gap: 8,
  },
  card: {
    width: 180,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 18,
    padding: 12,
  },
  altRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  label: {
    fontFamily: "monospace",
    fontSize: 9,
    letterSpacing: 1.2,
    color: "rgba(255, 255, 255, 0.55)",
    textTransform: "uppercase",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  altValue: {
    fontFamily: "monospace",
    fontSize: 28,
    fontWeight: "600",
    color: "#ffffff",
  },
  altUnit: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  vTapeTrack: {
    width: 8,
    height: 48,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
    position: "relative",
    justifyContent: "flex-end",
  },
  vTapeFill: {
    width: "100%",
    borderRadius: 4,
  },
  vTapeTargetTick: {
    position: "absolute",
    left: -2,
    right: -2,
    height: 2,
    backgroundColor: "#ffffff",
    borderRadius: 1,
  },
  grid: {
    marginTop: 8,
    gap: 4,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridLabel: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.55)",
  },
  gridSub: {
    color: "rgba(255, 255, 255, 0.35)",
  },
  gridVal: {
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "600",
  },
  modeText: {
    fontFamily: "monospace",
    fontSize: 8,
    letterSpacing: 1.2,
    color: "rgba(255, 255, 255, 0.45)",
    marginTop: 6,
    textTransform: "uppercase",
  },
  fuelContainer: {
    marginTop: 6,
  },
  fuelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fuelLabel: {
    fontFamily: "monospace",
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.55)",
  },
  burnText: {
    color: "#f59e0b",
    fontWeight: "700",
  },
  fuelNum: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
  },
  fuelTrack: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 3,
  },
  fuelFill: {
    height: "100%",
    borderRadius: 2,
  },
  radarCard: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  radarLabel: {
    position: "absolute",
    top: 5,
    fontFamily: "monospace",
    fontSize: 7,
    letterSpacing: 1.5,
    color: "rgba(255, 255, 255, 0.4)",
  },
  radarRing: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  radarTargetZone: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.2,
    borderColor: "#67e8f9",
    backgroundColor: "rgba(103, 232, 249, 0.15)",
  },
  radarCrossH: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  radarCrossV: {
    position: "absolute",
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  targetDiamond: {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: "#a78bfa",
    transform: [{ rotate: "45deg" }],
  },
  landerDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
  },
});
