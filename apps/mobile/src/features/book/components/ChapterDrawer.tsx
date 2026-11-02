import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { haptic } from "@/utils/haptics";
import { TOC_ITEMS, type TocItem } from "@thelastsignal/data";

interface ChapterDrawerProps {
  visible: boolean;
  currentPage: number;
  onSelectPage: (pageNumber: number) => void;
  onClose: () => void;
}

export function ChapterDrawer({
  visible,
  currentPage,
  onSelectPage,
  onClose,
}: ChapterDrawerProps) {
  const handleSelect = (pageNumber: number) => {
    haptic.selection();
    onSelectPage(pageNumber);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissOverlay} onPress={onClose} />
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.dragIndicator} />
            <View style={styles.titleRow}>
              <View style={styles.titleWithIcon}>
                <Ionicons name="book" size={20} color="#f5a623" />
                <ThemedText style={styles.sheetTitle}>Table of Contents</ThemedText>
              </View>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
                accessibilityLabel="Close Table of Contents"
              >
                <Ionicons name="close" size={20} color="#9aa0a6" />
              </Pressable>
            </View>
            <ThemedText style={styles.sheetSubtitle}>
              29 Spreads · 58 Pages of Authentic NASA Hardware Telemetry
            </ThemedText>
          </View>

          {/* Chapters List */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {TOC_ITEMS.map((item: TocItem, idx: number) => {
              const nextPage = TOC_ITEMS[idx + 1]?.page ?? 59;
              const isSelected = currentPage >= item.page && currentPage < nextPage;
              return (
                <Pressable
                  key={`toc-${idx}-${item.page}`}
                  onPress={() => handleSelect(item.page)}
                  style={({ pressed }) => [
                    styles.itemRow,
                    isSelected && styles.itemRowSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.pageBadge}>
                    <ThemedText style={[styles.pageBadgeText, isSelected && styles.selectedGold]}>
                      P. {item.page}
                    </ThemedText>
                  </View>
                  <View style={styles.itemTextCol}>
                    <ThemedText style={[styles.itemMachine, isSelected && styles.selectedGold]}>
                      {item.machine}
                    </ThemedText>
                    <ThemedText style={styles.itemTitle} numberOfLines={2}>
                      {item.title}
                    </ThemedText>
                  </View>
                  <Ionicons
                    name={isSelected ? "checkmark-circle" : "chevron-forward"}
                    size={18}
                    color={isSelected ? "#f5a623" : "#5f6368"}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  dismissOverlay: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: "#0d0f22",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "82%",
    borderWidth: 1,
    borderColor: "rgba(245, 166, 35, 0.2)",
    paddingBottom: 24,
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f4ede0",
    fontFamily: "SpaceGrotesk-Bold",
  },
  sheetSubtitle: {
    fontSize: 12,
    color: "#9aa0a6",
    marginTop: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 12,
    gap: 6,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    gap: 12,
  },
  itemRowSelected: {
    backgroundColor: "rgba(245, 166, 35, 0.12)",
    borderColor: "rgba(245, 166, 35, 0.4)",
  },
  pressed: {
    opacity: 0.7,
  },
  pageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  pageBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9aa0a6",
  },
  itemTextCol: {
    flex: 1,
  },
  itemMachine: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4fc3f7",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemTitle: {
    fontSize: 13,
    color: "#f4ede0",
    marginTop: 2,
    lineHeight: 18,
  },
  selectedGold: {
    color: "#f5a623",
  },
});
