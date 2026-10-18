import { StyleSheet, View, Text } from "react-native";

export interface CompassTarget {
  id: number;
  isMachine: boolean;
  bearing: number; // relative bearing in radians (-PI to PI, 0 = straight ahead)
  dist: number; // meters
  done: boolean;
}

interface CompassProps {
  name: string;
  speedKmh: number;
  targets: CompassTarget[];
}

const COMPASS_WIDTH = 320;
const HALF_WIDTH = COMPASS_WIDTH / 2;

export function Compass({ name, speedKmh, targets }: CompassProps) {
  return (
    <View style={styles.wrapper}>
      {/* 1. Compass Strip Bar */}
      <View style={styles.strip}>
        {/* Center alignment tick */}
        <View style={styles.centerTick} />

        {/* Dynamic target pips along the horizontal azimuth */}
        {targets.map((t) => {
          if (t.done) return null;
          // Clamped normalized bearing from -1 (left) to 1 (right)
          const b = Math.max(-1, Math.min(1, t.bearing / (Math.PI / 2)));
          const x = b * (HALF_WIDTH - 24);
          const opacity = Math.abs(t.bearing) > Math.PI / 2 ? 0.45 : 1;

          return (
            <View
              key={t.id}
              style={[
                styles.pipContainer,
                {
                  transform: [{ translateX: x }],
                  opacity,
                },
              ]}
            >
              {t.isMachine ? (
                <View style={styles.machineDiamond} />
              ) : (
                <View style={styles.echoDot} />
              )}
              <Text style={styles.pipDistText}>{Math.round(t.dist)} m</Text>
            </View>
          );
        })}
      </View>

      {/* 2. Subtitle Legend and Speed Tape */}
      <View style={styles.legendRow}>
        <View style={styles.legendLeft}>
          <Text style={styles.legendViolet}>◆</Text>
          <Text style={styles.legendSiteName} numberOfLines={1}>
            {" "}{name}{" "}
          </Text>
          <Text style={styles.legendCyan}>●</Text>
          <Text style={styles.legendEchoes}> echoes</Text>
        </View>
        <Text style={styles.speedText}>{Math.round(speedKmh)} km/h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: COMPASS_WIDTH,
    alignItems: "center",
  },
  strip: {
    width: "100%",
    height: 52,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 18,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  centerTick: {
    position: "absolute",
    top: 0,
    width: 1.5,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  pipContainer: {
    position: "absolute",
    top: 6,
    alignItems: "center",
    width: 48,
  },
  machineDiamond: {
    width: 9,
    height: 9,
    backgroundColor: "#a78bfa",
    transform: [{ rotate: "45deg" }],
  },
  echoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#67e8f9",
    shadowColor: "#67e8f9",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  pipDistText: {
    fontFamily: "monospace",
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 3,
    fontWeight: "600",
  },
  legendRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 4,
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  legendViolet: {
    color: "#a78bfa",
    fontSize: 10,
  },
  legendCyan: {
    color: "#67e8f9",
    fontSize: 10,
  },
  legendSiteName: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1.2,
    color: "rgba(255, 255, 255, 0.65)",
    textTransform: "uppercase",
  },
  legendEchoes: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1.2,
    color: "rgba(255, 255, 255, 0.65)",
    textTransform: "uppercase",
  },
  speedText: {
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.85)",
  },
});
