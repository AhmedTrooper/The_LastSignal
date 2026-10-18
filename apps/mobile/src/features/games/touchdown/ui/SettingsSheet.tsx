import { useState } from "react";
import { StyleSheet, View, Text, Switch, Pressable } from "react-native";
import { Sheet } from "./Sheet";

interface SettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsSheet({ visible, onClose }: SettingsSheetProps) {
  const [sfx, setSfx] = useState(true);
  const [pilot, setPilot] = useState(false);
  const [shake, setShake] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <Sheet visible={visible} onClose={onClose} title="Settings">
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.rowTitle}>Sound Effects & Haptics</Text>
          <Switch
            value={sfx}
            onValueChange={setSfx}
            trackColor={{ false: "#333333", true: "#5b2eff" }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.labelCol}>
            <Text style={styles.rowTitle}>Expert Pilot</Text>
            <Text style={styles.rowDesc}>
              Turns off the flight computer: no speed hold, no drift hold, no
              safety brake near the ground. Real gravity, all yours.
            </Text>
          </View>
          <Switch
            value={pilot}
            onValueChange={setPilot}
            trackColor={{ false: "#333333", true: "#5b2eff" }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowTitle}>Camera Shake</Text>
          <Switch
            value={shake}
            onValueChange={setShake}
            trackColor={{ false: "#333333", true: "#5b2eff" }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.labelCol}>
            <Text style={styles.rowTitle}>Progress</Text>
            <Text style={styles.rowDesc}>Saved on this device only.</Text>
          </View>
          {confirmReset ? (
            <Pressable
              onPress={() => setConfirmReset(false)}
              style={styles.dangerBtn}
            >
              <Text style={styles.dangerText}>Erase everything</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setConfirmReset(true)}
              style={styles.resetBtn}
            >
              <Text style={styles.resetText}>Reset…</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.controlsInfoBox}>
          <Text style={styles.controlsHeading}>CONTROLS</Text>
          <Text style={styles.controlsText}>
            Landing: hold Engine to counter gravity with thrusters. Left
            joystick steers lateral drift.
          </Text>
          <Text style={styles.controlsText}>
            Driving: left joystick moves and steers the rover. Hold Brake to
            halt.
          </Text>
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  labelCol: {
    flex: 1,
    paddingRight: 16,
  },
  rowTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  rowDesc: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  resetBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  resetText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  dangerBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  dangerText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  controlsInfoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 14,
    gap: 6,
    marginTop: 8,
  },
  controlsHeading: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1.5,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "700",
  },
  controlsText: {
    fontSize: 12,
    lineHeight: 18,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
