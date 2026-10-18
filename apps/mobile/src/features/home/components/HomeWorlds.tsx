import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { HEROES, type Body, portrait, assetUrl } from "@thelastsignal/data";

import { haptic } from "@/utils/haptics";

interface WorldCardProps {
  body: Body;
  title: string;
  lede: string;
  bgColor: string;
  accentColor: string;
}

function WorldCard({ body, title, lede, bgColor, accentColor }: WorldCardProps) {
  const machines = HEROES.filter((h) => h.body === body);

  const handleHeroPress = (slug: string) => {
    haptic.light();
    router.push(`/heroes/${slug}` as any);
  };

  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeRow}>
          <View style={[styles.dot, { backgroundColor: accentColor }]} />
          <ThemedText style={[styles.bodyTag, { color: accentColor }]} type="small">
            {body.toUpperCase()} · {machines.length} MACHINES
          </ThemedText>
        </View>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
        <ThemedText style={styles.cardLede} type="small">{lede}</ThemedText>
      </View>

      <View style={styles.avatarGrid}>
        {machines.map((h) => {
          const imageUrl = assetUrl(`images/${portrait(h)}.jpg`);
          return (
            <Pressable
              key={h.slug}
              onPress={() => handleHeroPress(h.slug)}
              style={({ pressed }) => [styles.avatarItem, pressed && styles.avatarPressed]}
            >
              <View style={styles.avatarBorder}>
                <Image source={{ uri: imageUrl }} style={styles.avatar} contentFit="cover" />
              </View>
              <ThemedText style={styles.avatarName} numberOfLines={1} type="small">
                {h.nickname ?? h.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function HomeWorlds() {
  return (
    <View style={styles.container}>
      <WorldCard
        body="mars"
        title="The Martian family"
        lede="Landers, rovers and a helicopter, from Viking 1 in 1976 to Ingenuity in 2024."
        bgColor="#fff1e8"
        accentColor={Colors.light.mars}
      />
      <WorldCard
        body="moon"
        title="The Lunar family"
        lede="Probes that struck it on purpose, landers, and the first car driven on another world."
        bgColor="#eef2f7"
        accentColor={Colors.light.violet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    backgroundColor: "#ffffff",
  },
  card: {
    borderRadius: 24,
    padding: 20,
  },
  cardHeader: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bodyTag: {
    fontWeight: "800",
    letterSpacing: 1,
    fontSize: 11,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  cardLede: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  avatarItem: {
    alignItems: "center",
    width: 64,
  },
  avatarPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  avatarBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarName: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.light.text,
    textAlign: "center",
    marginTop: 4,
  },
});
