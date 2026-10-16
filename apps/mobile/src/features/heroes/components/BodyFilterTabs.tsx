import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useHeroStore } from "@/stores/use-hero-store";
import type { Body } from "@thelastsignal/data";

const TABS: { label: string; value: Body | "all" }[] = [
  { label: "All Worlds", value: "all" },
  { label: "Mars", value: "mars" },
  { label: "Moon", value: "moon" },
];

export function BodyFilterTabs() {
  const selectedBody = useHeroStore((s) => s.selectedBody);
  const setSelectedBody = useHeroStore((s) => s.setSelectedBody);

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = selectedBody === tab.value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => setSelectedBody(tab.value)}
            style={[styles.tab, active && styles.activeTab]}
          >
            <ThemedText
              style={[styles.text, active && styles.activeText]}
              type="small"
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 999,
    backgroundColor: Colors.light.backgroundElement,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 999,
  },
  activeTab: {
    backgroundColor: Colors.light.violet,
  },
  text: {
    fontWeight: "600",
    color: Colors.light.textSecondary,
  },
  activeText: {
    color: "#ffffff",
  },
});
