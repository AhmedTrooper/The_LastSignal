import { StyleSheet, View, Text, Modal, Pressable } from "react-native";

interface PauseSheetProps {
  visible: boolean;
  onResume: () => void;
  onRestartLanding?: () => void;
  onOpenSettings: () => void;
  onBackToOrbit: () => void;
  onTitleScreen: () => void;
}

export function PauseSheet({
  visible,
  onResume,
  onRestartLanding,
  onOpenSettings,
  onBackToOrbit,
  onTitleScreen,
}: PauseSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Paused</Text>

          <Pressable onPress={onResume} style={[styles.btn, styles.primaryBtn]}>
            <Text style={styles.primaryBtnText}>Resume</Text>
          </Pressable>

          {onRestartLanding ? (
            <Pressable onPress={onRestartLanding} style={styles.btn}>
              <Text style={styles.btnText}>Restart landing</Text>
            </Pressable>
          ) : null}

          <Pressable onPress={onOpenSettings} style={styles.btn}>
            <Text style={styles.btnText}>Settings</Text>
          </Pressable>

          <Pressable onPress={onBackToOrbit} style={styles.btn}>
            <Text style={styles.btnText}>Back to orbit</Text>
          </Pressable>

          <Pressable onPress={onTitleScreen} style={styles.btn}>
            <Text style={styles.btnText}>Title screen</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#0b0a1d",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 28,
    padding: 24,
    gap: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  btn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  btnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  primaryBtn: {
    backgroundColor: "#5b2eff",
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
