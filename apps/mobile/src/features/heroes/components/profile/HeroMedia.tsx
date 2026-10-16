import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { VIDEOS, NEWS, EYES, eyesUrl, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroMedia({ hero }: Props) {
  const videos = VIDEOS[hero.slug] ?? [];
  const news = NEWS[hero.slug] ?? [];
  const eyesId = EYES[hero.slug];

  if (videos.length === 0 && news.length === 0 && !eyesId) return null;

  return (
    <View style={styles.card}>
      <ThemedText style={styles.eyebrow} type="small">WATCH &amp; READ</ThemedText>
      <ThemedText style={styles.title} type="subtitle">Mission Archives &amp; News</ThemedText>

      {/* Videos */}
      {videos.length > 0 && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader} type="small">OFFICIAL VIDEOS</ThemedText>
          <View style={styles.list}>
            {videos.map((v) => (
              <Pressable
                key={v.id}
                onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${v.id}`)}
                style={({ pressed }) => [styles.videoItem, pressed && styles.pressed]}
              >
                <View style={styles.videoIcon}>
                  <Ionicons name="play" size={18} color="#ffffff" />
                </View>
                <View style={styles.videoInfo}>
                  <ThemedText style={styles.videoTitle} numberOfLines={2}>{v.title}</ThemedText>
                  <ThemedText style={styles.videoChannel} type="small">{v.channel}</ThemedText>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* NASA News */}
      {news.length > 0 && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader} type="small">IN THE NEWS</ThemedText>
          <View style={styles.list}>
            {news.map((n) => (
              <Pressable
                key={n.url}
                onPress={() => Linking.openURL(n.url)}
                style={({ pressed }) => [styles.newsItem, pressed && styles.pressed]}
              >
                <View style={styles.newsContent}>
                  <ThemedText style={styles.newsTitle} numberOfLines={2}>{n.title}</ThemedText>
                  <ThemedText style={styles.newsSite} type="small">{n.site}</ThemedText>
                </View>
                <Ionicons name="open-outline" size={16} color={Colors.light.violet} />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* NASA Eyes */}
      {eyesId && (
        <Pressable
          onPress={() => Linking.openURL(eyesUrl(eyesId))}
          style={({ pressed }) => [styles.eyesBtn, pressed && styles.pressed]}
        >
          <Ionicons name="planet-outline" size={20} color="#ffffff" />
          <View style={styles.eyesInfo}>
            <ThemedText style={styles.eyesTitle}>Fly along in NASA Eyes</ThemedText>
            <ThemedText style={styles.eyesSubtitle} type="small">Experience the real 3D orbital trajectory</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#ffffff" />
        </Pressable>
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
    gap: 14,
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
  section: {
    gap: 8,
  },
  sectionHeader: {
    fontWeight: "800",
    color: Colors.light.textSecondary,
    letterSpacing: 1,
  },
  list: {
    gap: 8,
  },
  videoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    padding: 12,
    borderRadius: 14,
    gap: 12,
  },
  videoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ff0000",
    alignItems: "center",
    justifyContent: "center",
  },
  videoInfo: {
    flex: 1,
    gap: 2,
  },
  videoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.light.text,
  },
  videoChannel: {
    color: Colors.light.textSecondary,
  },
  newsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.backgroundElement,
    padding: 12,
    borderRadius: 14,
    gap: 10,
  },
  newsContent: {
    flex: 1,
    gap: 2,
  },
  newsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.text,
  },
  newsSite: {
    color: Colors.light.violet,
    fontWeight: "600",
  },
  eyesBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0c0a22",
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  eyesInfo: {
    flex: 1,
  },
  eyesTitle: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  eyesSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
