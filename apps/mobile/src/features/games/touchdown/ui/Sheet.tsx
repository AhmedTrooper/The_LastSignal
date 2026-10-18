import { StyleSheet, View, Text, Modal, Pressable } from "react-native";
import { type ReactNode } from "react";

interface SheetProps {
  visible: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

export function Sheet({ visible, title, onClose, children }: SheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.scrim} onPress={onClose} />
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              {typeof title === "string" ? (
                <Text style={styles.titleText}>{title}</Text>
              ) : (
                title
              )}
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          {/* Body Content */}
          <View style={styles.body}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  scrim: {
    flex: 1,
  },
  sheetContainer: {
    maxHeight: "88%",
    backgroundColor: "#0b0a1d",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  titleWrap: {
    flex: 1,
    paddingRight: 12,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
  },
  closeBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  body: {
    flexShrink: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
});
