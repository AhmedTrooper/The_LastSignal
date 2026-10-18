import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Sheet } from "./Sheet";
import { Stars } from "./Stars";
import { HEROES, photo, portrait, type Hero } from "@thelastsignal/data";
import { ORDER } from "../story";
import { useGameStore } from "@/stores/use-game-store";

interface JournalSheetProps {
  visible: boolean;
  onClose: () => void;
  onGoToSite: (hero: Hero) => void;
}

export function JournalSheet({
  visible,
  onClose,
  onGoToSite,
}: JournalSheetProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const { sites: savedSites } = useGameStore();

  const totalFound = Object.values(savedSites).filter((s) => s.found).length;
  const totalStars = Object.values(savedSites).reduce(
    (acc, s) =>
      acc +
      (s.soft ? 1 : 0) +
      (s.landed ? 1 : 0) +
      (s.echoes >= 3 ? 1 : 0),
    0
  );

  const heroMap = new Map(HEROES.map((h) => [h.slug, h]));
  const orderedHeroes = ORDER.map((s) => heroMap.get(s)).filter(
    (h): h is Hero => !!h
  );

  const selectedHero = openSlug ? heroMap.get(openSlug) : null;
  const selectedProgress = openSlug ? savedSites[openSlug] : null;

  return (
    <Sheet
      visible={visible}
      onClose={() => {
        setOpenSlug(null);
        onClose();
      }}
      title={
        <View>
          <Text style={styles.sheetSub}>JOURNAL</Text>
          <View style={styles.sheetTitleRow}>
            <Text style={styles.sheetTitle}>
              {totalFound} of {HEROES.length} signals heard
            </Text>
            <Text style={styles.starsTotal}>
              ★ {totalStars}/{HEROES.length * 3}
            </Text>
          </View>
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedHero ? (
          /* ---------- Site Detail Drilldown View ---------- */
          <View style={styles.detailWrap}>
            <Pressable
              onPress={() => setOpenSlug(null)}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← All sites</Text>
            </Pressable>

            {/* Photo Card */}
            <View style={styles.detailPhotoWrap}>
              <Image
                source={{ uri: photo(portrait(selectedHero), selectedHero.name).src }}
                style={styles.detailPhoto}
                contentFit="cover"
              />
            </View>

            {/* Meta */}
            <Text style={styles.detailPlace}>{selectedHero.restingPlace}</Text>
            <Text style={styles.detailName}>{selectedHero.name}</Text>

            <View style={styles.starsInfoRow}>
              <Stars
                have={[
                  !!selectedProgress?.soft,
                  !!selectedProgress?.landed,
                  (selectedProgress?.echoes ?? 0) >= 3,
                ]}
                size="md"
              />
              <Text style={styles.starsLegend}>
                Gentle landing · In the ring · All echoes
              </Text>
            </View>

            {/* Story Card */}
            <View style={styles.storyCard}>
              <Text style={styles.storyHeader}>
                {selectedHero.end.label} · {selectedHero.end.date}
              </Text>
              <Text style={styles.storyText}>{selectedHero.end.story}</Text>
            </View>

            {/* Echoes List */}
            <Text style={styles.echoesHeader}>ECHOES FROM THE RECORD</Text>
            <View style={styles.echoesList}>
              {[0, 1, 2].map((idx) => {
                const isPicked = (selectedProgress?.echoes ?? 0) > idx;
                return (
                  <View key={idx} style={styles.echoItem}>
                    {isPicked ? (
                      <>
                        <Text style={styles.echoDate}>Echo {idx + 1} verified</Text>
                        <Text style={styles.echoBody}>
                          Telemetry archive transmission packet recovered from resting site.
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.echoUnpicked}>
                        Echo {idx + 1}: not picked up yet
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
              <Pressable
                onPress={() => {
                  setOpenSlug(null);
                  onClose();
                  onGoToSite(selectedHero);
                }}
                style={styles.goBtn}
              >
                <Text style={styles.goBtnText}>
                  {selectedProgress?.found ? "Visit again" : "Go there"}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        ) : (
          /* ---------- All Sites Grid View ---------- */
          <View style={styles.listWrap}>
            {(["moon", "mars"] as const).map((b) => {
              const bodyHeroes = orderedHeroes.filter((h) => h.body === b);
              return (
                <View key={b} style={styles.bodySection}>
                  <Text style={styles.bodyHeader}>
                    {b === "moon" ? "THE MOON" : "MARS"}
                  </Text>
                  <View style={styles.grid}>
                    {bodyHeroes.map((hero) => {
                      const prog = savedSites[hero.slug];
                      const isFound = !!prog?.found;
                      const isLit = !!prog?.light;

                      return (
                        <Pressable
                          key={hero.slug}
                          onPress={() => setOpenSlug(hero.slug)}
                          style={styles.siteCard}
                        >
                          <View style={styles.thumbWrap}>
                            <Image
                              source={{
                                uri: photo(portrait(hero), hero.name).src,
                              }}
                              style={[
                                styles.thumbImage,
                                !isFound && styles.thumbUnvisited,
                              ]}
                              contentFit="cover"
                            />
                            {isLit && <View style={styles.lightIndicator} />}
                          </View>
                          <View style={styles.cardInfo}>
                            <Text style={styles.cardName} numberOfLines={1}>
                              {hero.name}
                            </Text>
                            <View style={styles.cardMetaRow}>
                              <Stars
                                have={[
                                  !!prog?.soft,
                                  !!prog?.landed,
                                  (prog?.echoes ?? 0) >= 3,
                                ]}
                                size="sm"
                              />
                              <Text style={styles.cardEchoes}>
                                {isFound
                                  ? `${prog?.echoes ?? 0}/3 echoes`
                                  : "unvisited"}
                              </Text>
                            </View>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  sheetSub: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1.5,
    color: "rgba(255, 255, 255, 0.55)",
    textTransform: "uppercase",
  },
  sheetTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 2,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  starsTotal: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#fcd34d",
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  listWrap: {
    gap: 20,
  },
  bodySection: {
    gap: 10,
  },
  bodyHeader: {
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: 1.6,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  siteCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  thumbWrap: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#000000",
    position: "relative",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  thumbUnvisited: {
    opacity: 0.25,
  },
  lightIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fcd34d",
    shadowColor: "#fcd34d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 4,
  },
  cardInfo: {
    padding: 8,
  },
  cardName: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  cardMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  cardEchoes: {
    fontFamily: "monospace",
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.5)",
  },
  detailWrap: {
    gap: 12,
  },
  backButton: {
    marginBottom: 4,
  },
  backButtonText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  detailPhotoWrap: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  detailPhoto: {
    width: "100%",
    height: "100%",
  },
  detailPlace: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.55)",
    marginTop: 4,
  },
  detailName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 2,
  },
  starsInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  starsLegend: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.55)",
  },
  storyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 14,
    marginTop: 6,
  },
  storyHeader: {
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: 1.4,
    color: "#fecdd3",
    textTransform: "uppercase",
  },
  storyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 6,
  },
  echoesHeader: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1.4,
    color: "rgba(255, 255, 255, 0.55)",
    marginTop: 10,
    textTransform: "uppercase",
  },
  echoesList: {
    gap: 8,
    marginTop: 6,
  },
  echoItem: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
  },
  echoDate: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "#67e8f9",
    fontWeight: "600",
  },
  echoBody: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 2,
  },
  echoUnpicked: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.35)",
  },
  actionRow: {
    marginTop: 12,
  },
  goBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#5b2eff",
    borderRadius: 24,
    paddingVertical: 14,
  },
  goBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
