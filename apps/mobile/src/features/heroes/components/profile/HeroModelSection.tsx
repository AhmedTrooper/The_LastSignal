import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { PARTS, DOWNLOADS, assetUrl, portrait, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroModelSection({ hero }: Props) {
  const parts = PARTS[hero.slug] ?? [];
  const downloads = DOWNLOADS[hero.slug] ?? [];
  const previewImg = hero.card ? assetUrl(`images/${hero.card}.webp`) : assetUrl(`images/${portrait(hero)}.jpg`);

  return (
    <View style={styles.card}>
      <ThemedText style={styles.eyebrow} type="small">3D ARCHITECTURE</ThemedText>
      <ThemedText style={styles.title} type="subtitle">Hardware &amp; Instruments</ThemedText>

      {hero.model && (
        <View style={styles.modelHeader}>
          <ThemedText style={styles.modelTitle}>{hero.model.title}</ThemedText>
          {hero.model.note && <ThemedText style={styles.modelNote} type="small">{hero.model.note}</ThemedText>}
        </View>
      )}

      <View style={styles.previewWrap}>
        <Image source={{ uri: previewImg }} style={styles.previewImg} contentFit="contain" />
      </View>

      {/* Parts List */}
      {parts.length > 0 && (
        <View style={styles.partsSection}>
          <ThemedText style={styles.partsHeader} type="small">ANNOTATED HARDWARE PARTS ({parts.length})</ThemedText>
          <View style={styles.partsList}>
            {parts.map((p) => (
              <View key={p.id} style={styles.partItem}>
                <View style={styles.partDot} />
                <View style={styles.partContent}>
                  <ThemedText style={styles.partLabel}>{p.label}</ThemedText>
                  {p.text && <ThemedText style={styles.partText} type="small">{p.text}</ThemedText>}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 3D Printable Downloads */}
      {downloads.length > 0 && (
        <View style={styles.downloadsSection}>
          <ThemedText style={styles.partsHeader} type="small">NASA 3D RESOURCES &amp; PRINT FILES</ThemedText>
          <View style={styles.downloadsList}>
            {downloads.map((d) => (
              <Pressable
                key={d.url}
                onPress={() => Linking.openURL(d.url)}
                style={styles.downloadItem}
              >
                <Ionicons name="download-outline" size={16} color={Colors.light.violet} />
                <ThemedText style={styles.downloadText} numberOfLines={1}>{d.label}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  modelHeader: {
    gap: 2,
  },
  modelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  modelNote: {
    color: Colors.light.textSecondary,
  },
  previewWrap: {
    width: "100%",
    height: 180,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  previewImg: {
    width: "100%",
    height: "100%",
  },
  partsSection: {
    marginTop: 6,
    gap: 8,
  },
  partsHeader: {
    fontWeight: "800",
    color: Colors.light.textSecondary,
    letterSpacing: 1,
  },
  partsList: {
    gap: 10,
  },
  partItem: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: Colors.light.backgroundElement,
    padding: 12,
    borderRadius: 12,
  },
  partDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.violet,
    marginTop: 6,
  },
  partContent: {
    flex: 1,
    gap: 2,
  },
  partLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.text,
  },
  partText: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  downloadsSection: {
    marginTop: 6,
    gap: 8,
  },
  downloadsList: {
    gap: 6,
  },
  downloadItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.light.backgroundElement,
    padding: 12,
    borderRadius: 12,
  },
  downloadText: {
    color: Colors.light.violet,
    fontWeight: "600",
    fontSize: 13,
    flex: 1,
  },
});
