import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import type { Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

function getSpecIcon(label: string): keyof typeof Ionicons.glyphMap {
  const l = label.toLowerCase();
  if (l.includes("mass") || l.includes("weight")) return "scale-outline";
  if (l.includes("speed") || l.includes("velocity")) return "speedometer-outline";
  if (l.includes("camera") || l.includes("optical")) return "camera-outline";
  if (l.includes("builder") || l.includes("contractor")) return "construct-outline";
  if (l.includes("power") || l.includes("solar") || l.includes("rtg")) return "flash-outline";
  if (l.includes("rocket") || l.includes("vehicle") || l.includes("launch")) return "rocket-outline";
  if (l.includes("distance") || l.includes("range")) return "navigate-outline";
  if (l.includes("crew") || l.includes("pilot")) return "people-outline";
  return "hardware-chip-outline";
}

export function HeroSpecs({ hero }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!hero.specs || hero.specs.length === 0) return null;

  const handlePress = (label: string) => {
    haptic.light();
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.eyebrow} type="small">ENGINEERING</ThemedText>
          <ThemedText style={styles.title} type="subtitle">Technical Specifications</ThemedText>
        </View>
        <View style={styles.badge}>
          <Ionicons name="hardware-chip" size={14} color={Colors.light.violet} />
          <ThemedText style={styles.badgeText} type="small">JPL/NASA</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.subtitle} type="small">
        Hardware architecture, payload instruments, and flight engineering parameters.
      </ThemedText>

      <View style={styles.specsGrid}>
        {hero.specs.map((s, idx) => {
          const icon = getSpecIcon(s.label);
          const isCopied = copiedKey === s.label;

          return (
            <Pressable
              key={`${s.label}-${idx}`}
              onPress={() => handlePress(s.label)}
              style={({ pressed }) => [
                styles.specRow,
                idx % 2 === 1 && styles.specRowAlt,
                pressed && styles.specRowPressed,
                isCopied && styles.specRowCopied,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${s.label}: ${s.value}`}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={icon} size={15} color={isCopied ? "#ffffff" : Colors.light.violet} />
              </View>

              <View style={styles.labelWrap}>
                <ThemedText style={styles.specLabel} type="small">{s.label}</ThemedText>
              </View>

              <View style={styles.valWrap}>
                <ThemedText style={[styles.specVal, isCopied && styles.specValCopied]}>
                  {s.value}
                </ThemedText>
                {isCopied && (
                  <ThemedText style={styles.copiedTag} type="small">SELECTED</ThemedText>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footerNote}>
        <Ionicons name="shield-checkmark-outline" size={14} color={Colors.light.textSecondary} />
        <ThemedText style={styles.footerText} type="small">
          Verified from mission archives and telemetry records.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    gap: 2,
    flex: 1,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f5f3ff",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  badgeText: {
    color: Colors.light.violet,
    fontFamily: "monospace",
    fontWeight: "700",
    fontSize: 10,
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginTop: -4,
  },
  specsGrid: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: "#ffffff",
  },
  specRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.line,
    gap: 10,
  },
  specRowAlt: {
    backgroundColor: "#fafafc",
  },
  specRowPressed: {
    backgroundColor: "#f5f3ff",
  },
  specRowCopied: {
    backgroundColor: "#ede9fe",
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f5f3ff",
    alignItems: "center",
    justifyContent: "center",
  },
  labelWrap: {
    flex: 1,
  },
  specLabel: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  valWrap: {
    alignItems: "flex-end",
    flexShrink: 1,
    maxWidth: "55%",
  },
  specVal: {
    fontWeight: "700",
    fontSize: 13,
    color: Colors.light.text,
    textAlign: "right",
  },
  specValCopied: {
    color: Colors.light.violet,
  },
  copiedTag: {
    fontSize: 9,
    color: Colors.light.violet,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 4,
  },
  footerText: {
    color: Colors.light.textSecondary,
    fontSize: 11,
  },
});
