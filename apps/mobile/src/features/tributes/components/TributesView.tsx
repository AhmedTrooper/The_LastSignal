import { useState, useEffect } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { HEROES, catNo, fmtDots, portrait, assetUrl } from "@thelastsignal/data";
import { useTributesStore } from "@/stores/use-tributes-store";
import { useAuthStore } from "@/stores/use-auth-store";

const TRIBUTE_PROMPTS = [
  "Rest easy beneath the dust ✦",
  "Thank you for 45 km of wonder 🚀",
  "Humanity will come find you 🌌",
  "Fair winds across alien skies 🪐",
];

export function TributesView() {
  const [selectedSlug, setSelectedSlug] = useState("opportunity");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [likedTributes, setLikedTributes] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const hero = HEROES.find((h) => h.slug === selectedSlug) ?? HEROES[0];
  const { addTribute, tributes, fetchFirebaseTributes } = useTributesStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchFirebaseTributes();
  }, [fetchFirebaseTributes]);

  const heroTributes = tributes.filter(
    (t) => !t.heroSlug || t.heroSlug === "all" || t.heroSlug === hero.slug
  );
  const isMars = hero.body === "mars";

  const handleRefresh = async () => {
    haptic.light();
    setRefreshing(true);
    await fetchFirebaseTributes();
    setRefreshing(false);
    haptic.success();
  };

  const handleSelectHero = (slug: string) => {
    haptic.selection();
    setSelectedSlug(slug);
  };

  const handleSelectPrompt = (prompt: string) => {
    haptic.light();
    setMessage((prev) => (prev ? `${prev} ${prompt}` : prompt));
  };

  const handleToggleLike = (id: string) => {
    haptic.light();
    setLikedTributes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async () => {
    if (!message.trim() || isTransmitting) return;
    setIsTransmitting(true);
    haptic.light();

    const authorName = author.trim() || user?.name || "Anonymous Explorer";
    await addTribute(hero.slug, authorName, message, user?.photoUrl);
    haptic.success();
    setMessage("");
    setAuthor("");
    setIsTransmitting(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.light.violet}
          colors={[Colors.light.violet]}
        />
      }
    >
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow} type="small">
          MEMORIAL CARRIER
        </ThemedText>
        <ThemedText style={styles.title} type="title">
          Signals of Remembrance
        </ThemedText>
        <ThemedText style={styles.subtitle} type="small">
          Transmit a tribute to the robotic pioneers resting quietly across the solar system.
        </ThemedText>
      </View>

      {/* Hero Selector Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      >
        {HEROES.map((h) => {
          const isSelected = h.slug === hero.slug;
          const imageUrl = assetUrl(`images/${portrait(h)}.jpg`);
          return (
            <Pressable
              key={h.slug}
              onPress={() => handleSelectHero(h.slug)}
              style={({ pressed }) => [
                styles.pill,
                isSelected && styles.pillActive,
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Select ${h.name}`}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.pillAvatar}
                contentFit="cover"
              />
              <ThemedText
                style={[styles.pillText, isSelected && styles.pillTextActive]}
                type="small"
              >
                {h.name}
              </ThemedText>
              {isSelected && <View style={styles.activeDot} />}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Hero Last Signal Terminal Card */}
      <View style={styles.signalCard}>
        <View style={styles.signalTopRow}>
          <View style={styles.signalStatusWrap}>
            <View style={[styles.beaconDot, isMars ? styles.marsDot : styles.moonDot]} />
            <ThemedText style={styles.signalEndLabel} type="small">
              {hero.end.label.toUpperCase()} · {fmtDots(hero.end.date)}
            </ThemedText>
          </View>
          <ThemedText style={styles.specimenBadge} type="small">
            {catNo(hero.no)}
          </ThemedText>
        </View>

        <ThemedText style={styles.signalName}>{hero.name}</ThemedText>
        <ThemedText style={styles.signalStory}>{hero.end.story}</ThemedText>

        <View style={styles.waveformWrap}>
          <ThemedText style={styles.waveformLabel} type="small">
            CARRIER TELEMETRY FREQUENCY
          </ThemedText>
          <Waveform
            seed={`${hero.slug}-tributes-last`}
            bars={38}
            fade={0.3}
            color="#a78bfa"
            height={20}
          />
        </View>
      </View>

      {/* Compose Tribute Station */}
      <View style={styles.formCard}>
        <View style={styles.formHeaderRow}>
          <Ionicons name="radio" size={18} color={Colors.light.violet} />
          <ThemedText style={styles.formTitle} type="subtitle">
            Transmit Signal to {hero.name}
          </ThemedText>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Your name or callsign (e.g. Earth Observer)"
          placeholderTextColor={Colors.light.textSecondary}
          value={author}
          onChangeText={setAuthor}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder={`Write your message to ${hero.name}...`}
          placeholderTextColor={Colors.light.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={3}
        />

        {/* Quick Suggestion Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promptRow}
        >
          {TRIBUTE_PROMPTS.map((p) => (
            <Pressable
              key={p}
              onPress={() => handleSelectPrompt(p)}
              style={({ pressed }) => [
                styles.promptChip,
                pressed && styles.btnPressed,
              ]}
            >
              <ThemedText style={styles.promptText} type="small">
                {p}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable
          onPress={handleSubmit}
          disabled={!message.trim() || isTransmitting}
          style={({ pressed }) => [
            styles.submitBtn,
            (!message.trim() || isTransmitting) && styles.submitBtnDisabled,
            pressed && !isTransmitting && styles.btnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Transmit tribute message"
        >
          <Ionicons
            name={isTransmitting ? "hourglass-outline" : "paper-plane-outline"}
            size={16}
            color="#ffffff"
          />
          <ThemedText style={styles.submitBtnText}>
            {isTransmitting ? "Broadcasting to Space..." : "Broadcast Tribute Signal"}
          </ThemedText>
        </Pressable>
      </View>

      {/* Community Tribute Wall */}
      <View style={styles.wallSection}>
        <View style={styles.wallHeaderRow}>
          <ThemedText style={styles.wallTitle} type="subtitle">
            Transmissions Received ({heroTributes.length})
          </ThemedText>
          <ThemedText style={styles.wallHeroTag} type="small">
            For {hero.name}
          </ThemedText>
        </View>

        {heroTributes.length === 0 ? (
          <View style={styles.emptyWall}>
            <Ionicons name="chatbubbles-outline" size={32} color={Colors.light.violet} />
            <ThemedText style={styles.emptyTitle}>No signals recorded yet</ThemedText>
            <ThemedText style={styles.emptyText} type="small">
              Be the first to broadcast a tribute message across space to {hero.name}.
            </ThemedText>
          </View>
        ) : (
          heroTributes.map((item) => {
            const isLiked = likedTributes[item.id];
            return (
              <View key={item.id} style={styles.tributeCard}>
                <View style={styles.tributeHeader}>
                  <View style={styles.authorBadgeRow}>
                    {item.photoUrl ? (
                      <Image
                        source={{ uri: item.photoUrl }}
                        style={styles.authorAvatar}
                        contentFit="cover"
                      />
                    ) : (
                      <Ionicons
                        name="person-circle-outline"
                        size={18}
                        color={Colors.light.violet}
                      />
                    )}
                    <ThemedText style={styles.tributeAuthor}>{item.name}</ThemedText>
                  </View>
                  <ThemedText style={styles.tributeDate} type="small">
                    {item.date}
                  </ThemedText>
                </View>

                <ThemedText style={styles.tributeMessage}>
                  {`"${item.message}"`}
                </ThemedText>

                <View style={styles.tributeFooter}>
                  <ThemedText style={styles.carrierTag} type="small">
                    DEEP SPACE RELAY · VERIFIED
                  </ThemedText>

                  <Pressable
                    onPress={() => handleToggleLike(item.id)}
                    style={({ pressed }) => [
                      styles.likeBtn,
                      isLiked && styles.likeBtnActive,
                      pressed && styles.btnPressed,
                    ]}
                  >
                    <Ionicons
                      name={isLiked ? "heart" : "heart-outline"}
                      size={15}
                      color={isLiked ? "#ef4444" : Colors.light.textSecondary}
                    />
                    <ThemedText
                      style={[
                        styles.likeBtnText,
                        isLiked && styles.likeBtnTextActive,
                      ]}
                      type="small"
                    >
                      {isLiked ? "1" : "0"}
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            );
          })
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
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
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
    paddingVertical: 5,
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
    fontWeight: "700",
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ffffff",
  },
  signalCard: {
    backgroundColor: "#070814",
    borderRadius: 24,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.25)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    gap: 8,
  },
  signalTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signalStatusWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  beaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  marsDot: {
    backgroundColor: Colors.light.mars,
  },
  moonDot: {
    backgroundColor: "#a78bfa",
  },
  signalEndLabel: {
    color: "#a78bfa",
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  specimenBadge: {
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: "monospace",
    fontSize: 11,
  },
  signalName: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 2,
  },
  signalStory: {
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 22,
    fontSize: 14,
  },
  waveformWrap: {
    marginTop: 6,
    gap: 4,
  },
  waveformLabel: {
    color: "rgba(167, 139, 250, 0.8)",
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.line,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  formHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.light.text,
  },
  input: {
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: Colors.light.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  promptRow: {
    gap: 8,
    paddingVertical: 2,
  },
  promptChip: {
    backgroundColor: "#f5f3ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ede9fe",
  },
  promptText: {
    color: Colors.light.violet,
    fontSize: 11,
    fontWeight: "600",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.violet,
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 4,
  },
  submitBtnDisabled: {
    opacity: 0.55,
  },
  submitBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },
  wallSection: {
    marginTop: 12,
    gap: 12,
  },
  wallHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  wallTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  wallHeroTag: {
    color: Colors.light.violet,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  emptyWall: {
    padding: 30,
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 20,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 4,
  },
  emptyText: {
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  tributeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  tributeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  authorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  tributeAuthor: {
    fontWeight: "800",
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
    lineHeight: 21,
    fontSize: 14,
    fontStyle: "italic",
  },
  tributeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.line,
  },
  carrierTag: {
    fontFamily: "monospace",
    color: Colors.light.textSecondary,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: Colors.light.backgroundElement,
  },
  likeBtnActive: {
    backgroundColor: "#fef2f2",
  },
  likeBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.light.textSecondary,
  },
  likeBtnTextActive: {
    color: "#ef4444",
  },
});
