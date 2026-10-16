import { useMemo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Colors } from "@/constants/theme";

const round = (n: number) => Math.round(n * 100) / 100;

function heights(seed: string, count: number) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return Array.from({ length: count }, (_, i) => {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    const envelope = Math.sin(((i + 1) / (count + 1)) * Math.PI) ** 0.6;
    return round(0.18 + ((h % 1000) / 1000) * 0.82 * envelope);
  });
}

interface WaveformProps {
  seed?: string;
  bars?: number;
  fade?: number;
  color?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function Waveform({
  seed = "signal",
  bars = 28,
  fade = 0.35,
  color = Colors.light.violet,
  height = 24,
  style,
}: WaveformProps) {
  const hs = useMemo(() => heights(seed, bars), [seed, bars]);

  return (
    <View style={[styles.container, { height }, style]}>
      <View style={styles.barsRow}>
        {hs.map((v, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                backgroundColor: color,
                height: Math.max(3, round(v * height)),
              },
            ]}
          />
        ))}
      </View>
      {fade > 0 && (
        <View style={styles.tailWrap}>
          <View style={[styles.tailLine, { backgroundColor: color }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  bar: {
    width: 2,
    borderRadius: 1,
  },
  tailWrap: {
    flex: 1,
    paddingLeft: 2,
    justifyContent: "center",
  },
  tailLine: {
    height: 1.5,
    opacity: 0.5,
  },
});
