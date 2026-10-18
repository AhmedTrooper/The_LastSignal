import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StarsProps {
  have: boolean[];
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function Stars({ have, size = "md" }: StarsProps) {
  const iconSize = size === "lg" ? 28 : size === "md" ? 18 : 13;
  const gap = size === "lg" ? 6 : size === "md" ? 4 : 2;

  return (
    <View style={[styles.container, { gap }]}>
      {have.map((h, i) => (
        <Ionicons
          key={i}
          name={h ? "star" : "star-outline"}
          size={iconSize}
          color={h ? "#fcd34d" : "rgba(255, 255, 255, 0.35)"}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
