import { Platform, Vibration } from "react-native";

export const haptic = {
  light: () => {
    try {
      if (Platform.OS === "android") {
        Vibration.vibrate(12);
      } else {
        Vibration.vibrate();
      }
    } catch {
      // ignore
    }
  },
  success: () => {
    try {
      if (Platform.OS === "android") {
        Vibration.vibrate([0, 15, 50, 15]);
      } else {
        Vibration.vibrate();
      }
    } catch {
      // ignore
    }
  },
};
