import { useState } from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import { haptic } from "@/utils/haptics";

interface HoldButtonProps {
  label: string;
  size?: number;
  sublabel?: string;
  onChange: (isDown: boolean) => void;
}

export function HoldButton({
  label,
  size = 96,
  sublabel,
  onChange,
}: HoldButtonProps) {
  const [down, setDown] = useState(false);

  return (
    <Pressable
      onPressIn={() => {
        setDown(true);
        onChange(true);
        haptic.medium();
      }}
      onPressOut={() => {
        setDown(false);
        onChange(false);
      }}
      style={[
        styles.btn,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        down ? styles.btnDown : styles.btnIdle,
      ]}
    >
      <Text style={[styles.label, down ? styles.labelDown : styles.labelIdle]}>
        {label}
      </Text>
      {sublabel ? (
        <Text
          style={[
            styles.sublabel,
            down ? styles.sublabelDown : styles.sublabelIdle,
          ]}
        >
          {sublabel}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  btnIdle: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  btnDown: {
    backgroundColor: "#f59e0b",
    borderColor: "#fbbf24",
    transform: [{ scale: 0.94 }],
  },
  label: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  labelIdle: {
    color: "#ffffff",
  },
  labelDown: {
    color: "#000000",
  },
  sublabel: {
    fontFamily: "monospace",
    fontSize: 8,
    marginTop: 2,
    fontWeight: "600",
  },
  sublabelIdle: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  sublabelDown: {
    color: "rgba(0, 0, 0, 0.7)",
  },
});
