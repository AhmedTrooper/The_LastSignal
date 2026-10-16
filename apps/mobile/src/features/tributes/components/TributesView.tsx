import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { HEROES, fmtDots, portrait, assetUrl } from "@thelastsignal/data";
import { useTributesStore } from "@/stores/use-tributes-store";

export function TributesView() {
  const [selectedSlug, setSelectedSlug] = useState("opportunity");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  const hero = HEROES.find((h) => h.slug === selectedSlug) ?? HEROES[0];
  const { addTribute, tributes } = useTributesStore();
  const heroTributes = tributes.filter((t) => t.heroSlug === hero.slug);

  const handleSubmit = () => {
    if (!message.trim()) return;
    haptic.success();
    addTribute(hero.slug, author, message);
    setMessage("");
    setAuthor("");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow} type="small">TRIBUTES</ThemedText>
        <ThemedText style={styles.title} type="title">In their memory.</ThemedText>
        <ThemedText style={styles.subtitle} type="small">
          Leave a message for the machines that went where we couldn&apos;t.
        </ThemedText>
      </View>

      {/* Hero Selector Carousel */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
        {HEROES.map((h) => {
          const isSelected = h.slug === hero.slug;
          const imageUrl = assetUrl(`images/${portrait(h)}.jpg`);
          return (
            <Pressable
              key={h.slug}
              onPress={() => setSelectedSlug(h.slug)}
              style={[styles.pill, isSelected && styles.pillActive]}
            >
              <Image source={{ uri: imageUrl }} style={styles.pillAvatar} contentFit="cover" />
              <ThemedText style={[styles.pillText, isSelected && styles.pillTextActive]} type="small">
                {h.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Hero Signal Card */}
      <View style={styles.signalCard}>
        <ThemedText style={styles.signalEndLabel} type="small">
          {hero.end.label.toUpperCase()} · {fmtDots(hero.end.date)}
        </ThemedText>
        <ThemedText style={styles.signalName}>{hero.name}</ThemedText>
        <ThemedText style={styles.signalStory}>{hero.end.story}</ThemedText>
        <Waveform seed={`${hero.slug}-last`} bars={36} fade={0.3} color="#a78bfa" height={22} style={{ marginTop: 12 }} />
      </View>

      {/* Compose Tribute Form */}
      <View style={styles.formCard}>
        <ThemedText style={styles.formTitle} type="subtitle">Leave a Tribute for {hero.name}</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Your name or callsign (optional)"
          placeholderTextColor={Colors.light.textSecondary}
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write your message..."
          placeholderTextColor={Colors.light.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={3}
        />
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitBtn,
            (!message.trim() || pressed) && styles.submitBtnDisabled,
          ]}
          disabled={!message.trim()}
        >
          <ThemedText style={styles.submitBtnText}>Post Tribute</ThemedText>
        </Pressable>
      </View>

      {/* Tribute Wall List */}
      <View style={styles.wallSection}>
        <ThemedText style={styles.wallTitle} type="subtitle">
          Tributes ({heroTributes.length})
        </ThemedText>
        {heroTributes.length === 0 ? (
          <View style={styles.emptyWall}>
            <ThemedText style={styles.emptyText} type="small">
              No tributes left for {hero.name} yet. Be the first to leave one.
            </ThemedText>
          </View>
        ) : (
          heroTributes.map((item) => (
            <View key={item.id} style={styles.tributeCard}>
              <View style={styles.tributeHeader}>
                <ThemedText style={styles.tributeAuthor}>{item.name}</ThemedText>
                <ThemedText style={styles.tributeDate} type="small">{item.date}</ThemedText>
              </View>
              <ThemedText style={styles.tributeMessage}>{item.message}</ThemedText>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
    gap: 6,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginTop: 2,
  },
  carousel: {
    gap: 8,
    paddingBottom: 16,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 4,
    paddingRight: 14,
    paddingVertical: 4,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  pillActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  pillAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  pillText: {
    fontWeight: "600",
    color: Colors.light.text,
  },
  pillTextActive: {
    color: "#ffffff",
  },
  signalCard: {
    backgroundColor: "#0c0a22",
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
  },
  signalEndLabel: {
    color: "#a78bfa",
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  signalName: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 8,
  },
  signalStory: {
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 22,
    fontSize: 14,
  },
  formCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 20,
    padding: 18,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: Colors.light.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 10,
  },
  textArea: {
    minHeight: 74,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: Colors.light.violet,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  wallSection: {
    marginTop: 16,
    gap: 12,
  },
  wallTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyWall: {
    padding: 24,
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 16,
  },
  emptyText: {
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  tributeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 6,
  },
  tributeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tributeAuthor: {
    fontWeight: "700",
    fontSize: 14,
    color: Colors.light.violet,
  },
  tributeDate: {
    color: Colors.light.textSecondary,
    fontFamily: "monospace",
    fontSize: 11,
  },
  tributeMessage: {
    color: Colors.light.text,
    lineHeight: 20,
    fontSize: 14,
  },
});
