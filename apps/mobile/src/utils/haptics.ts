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
  selection: () => {
    try {
      if (Platform.OS === "android") {
        Vibration.vibrate(8);
      } else {
        Vibration.vibrate();
      }
    } catch {
      // ignore
    }
  },
  medium: () => {
    try {
      if (Platform.OS === "android") {
        Vibration.vibrate(25);
      } else {
        Vibration.vibrate();
      }
    } catch {
      // ignore
    }
  },
  heavy: () => {
    try {
      if (Platform.OS === "android") {
        Vibration.vibrate(45);
      } else {
        Vibration.vibrate();
      }
    } catch {
      // ignore
    }
  },
};
