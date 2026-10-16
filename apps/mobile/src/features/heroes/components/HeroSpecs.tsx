import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import type { Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroSpecs({ hero }: Props) {
  if (!hero.specs || hero.specs.length === 0) return null;

  return (
    <View style={styles.card}>
      <ThemedText style={styles.cardHeader} type="subtitle">Specifications</ThemedText>
      <View style={styles.specsList}>
        {hero.specs.map((s) => (
          <View key={s.label} style={styles.specRow}>
            <ThemedText style={styles.specLabel} type="small">{s.label}</ThemedText>
            <ThemedText style={styles.specVal} type="small">{s.value}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f7f7fb",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  cardHeader: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },
  specsList: {
    gap: 8,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
  },
  specLabel: {
    color: Colors.light.textSecondary,
  },
  specVal: {
    fontWeight: "600",
  },
});
