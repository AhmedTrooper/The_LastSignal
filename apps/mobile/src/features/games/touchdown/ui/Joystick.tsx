import { useState, useState as useStateHook } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  type GestureResponderEvent,
  type PanResponderGestureState,
  Text,
} from "react-native";

interface JoystickProps {
  label: string;
  onChange: (x: number, y: number) => void;
}

const BASE_RADIUS = 56;
const MAX_DRAG = 36;

export function Joystick({ label, onChange }: JoystickProps) {
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const [panResponder] = useStateHook(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (
        _: GestureResponderEvent,
        gesture: PanResponderGestureState
      ) => {
        const dist = Math.hypot(gesture.dx, gesture.dy);
        const clamped = Math.min(dist, MAX_DRAG);
        const angle = Math.atan2(gesture.dy, gesture.dx);

        const x = Math.cos(angle) * clamped;
        const y = Math.sin(angle) * clamped;

        setKnob({ x, y });
        // Forward y is inverted (-1 = up, 1 = down)
        onChange(x / MAX_DRAG, -y / MAX_DRAG);
      },
      onPanResponderRelease: () => {
        setKnob({ x: 0, y: 0 });
        onChange(0, 0);
      },
      onPanResponderTerminate: () => {
        setKnob({ x: 0, y: 0 });
        onChange(0, 0);
      },
    })
  );

  return (
    <View style={styles.container}>
      <View style={styles.base} {...panResponder.panHandlers}>
        <View
          style={[
            styles.knob,
            {
              transform: [{ translateX: knob.x }, { translateY: knob.y }],
            },
          ]}
        />
      </View>
      <Text style={styles.labelText}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 6,
  },
  base: {
    width: BASE_RADIUS * 2,
    height: BASE_RADIUS * 2,
    borderRadius: BASE_RADIUS,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  knob: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  labelText: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1.5,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "700",
  },
});
