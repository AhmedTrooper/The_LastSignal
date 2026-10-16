import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { lifespan, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
  isLast: boolean;
}

export function TimelineItem({ hero, isLast }: Props) {
  const router = useRouter();
  const isMars = hero.body === "mars";
  const year = hero.launch.date.slice(0, 4);

  return (
    <Pressable
      onPress={() => router.push(`/heroes/${hero.slug}` as any)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.track}>
        <View style={[styles.dot, isMars ? styles.marsDot : styles.moonDot]} />
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={styles.card}>
        <View style={styles.header}>
          <ThemedText style={styles.year} type="small">{year}</ThemedText>
          <ThemedText style={styles.lifespan} type="small">{lifespan(hero)}</ThemedText>
        </View>

        <ThemedText style={styles.name} type="subtitle">{hero.name}</ThemedText>
        <ThemedText style={styles.kind} type="small">{hero.kind} · {hero.body === "mars" ? "Mars" : "Moon"}</ThemedText>
        <ThemedText style={styles.summary} numberOfLines={2} type="small">{hero.summary}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  pressed: {
    opacity: 0.88,
  },
  track: {
    alignItems: "center",
    width: 20,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 4,
  },
  marsDot: {
    backgroundColor: "#ff5a1f",
  },
  moonDot: {
    backgroundColor: Colors.light.violet,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.light.line,
    marginVertical: 4,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.line,
    padding: 12,
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  year: {
    fontWeight: "800",
    color: Colors.light.violet,
  },
  lifespan: {
    color: Colors.light.textSecondary,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
  },
  kind: {
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  summary: {
    color: Colors.light.text,
    lineHeight: 18,
    marginTop: 6,
  },
});
