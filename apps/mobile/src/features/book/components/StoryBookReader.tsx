import { useState, useCallback, useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  Share,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { haptic } from "@/utils/haptics";
import {
  SPREADS,
  type BookSpread,
  assetUrl,
} from "@thelastsignal/data";
import { ChapterDrawer } from "./ChapterDrawer";

export function StoryBookReader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [simulatedTau, setSimulatedTau] = useState(0.9); // Dust optical depth for Mars solar
  const [marsquakeSimulating, setMarsquakeSimulating] = useState(false);
  const [activeQuakeMagnitude, setActiveQuakeMagnitude] = useState<number | null>(null);

  const currentSpread: BookSpread = SPREADS[currentSpreadIndex] ?? SPREADS[0];
  const totalSpreads = SPREADS.length;
  const isCover = currentSpreadIndex === 0;

  // Page Numbers: Spread 0 is Cover (Pages 1 & 2), Spread 1 is Pages 3 & 4, etc.
  const leftPageNum = currentSpreadIndex * 2 + 1;
  const rightPageNum = currentSpreadIndex * 2 + 2;

  const goToNextSpread = useCallback(() => {
    if (currentSpreadIndex < totalSpreads - 1) {
      haptic.light();
      setCurrentSpreadIndex((prev) => prev + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    } else {
      haptic.success();
    }
  }, [currentSpreadIndex, totalSpreads]);

  const goToPrevSpread = useCallback(() => {
    if (currentSpreadIndex > 0) {
      haptic.light();
      setCurrentSpreadIndex((prev) => prev - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [currentSpreadIndex]);

  const handleJumpToSpread = (index: number) => {
    setCurrentSpreadIndex(index);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const toggleFullscreen = () => {
    haptic.selection();
    setIsFullscreen((prev) => !prev);
  };

  const handleShare = async () => {
    try {
      haptic.light();
      await Share.share({
        title: "The Last Signal — Story Book",
        message: `Reading Chapter "${currentSpread.spreadTitle}" in The Last Signal: Storytelling about NASA's Discarded Equipment on the Moon and Mars!`,
      });
    } catch {
      // ignore
    }
  };

  const triggerMarsquake = (mag: number) => {
    haptic.medium();
    setMarsquakeSimulating(true);
    setActiveQuakeMagnitude(mag);
    setTimeout(() => {
      haptic.light();
    }, 200);
    setTimeout(() => {
      haptic.success();
      setMarsquakeSimulating(false);
    }, 1200);
  };

  // Solar battery power formula based on Tau: P = P_nominal * exp(-tau / 2.2)
  const nominalWh = currentSpread.heroSlug === "insight" ? 4400 : 620;
  const currentWh = Math.round(nominalWh * Math.exp(-simulatedTau / 2.2));
  const powerPct = Math.round((currentWh / nominalWh) * 100);

  return (
    <View style={styles.container}>
      <StatusBar hidden={isFullscreen} barStyle="light-content" backgroundColor="#080914" />

      {/* Reader Top Bar (Hidden in Fullscreen mode) */}
      {!isFullscreen && (
        <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color="#f4ede0" />
          </Pressable>

          {/* Chapter indicator */}
          <Pressable
            onPress={() => setShowToc(true)}
            style={({ pressed }) => [styles.chapterIndicatorPill, pressed && styles.pressed]}
          >
            <ThemedText style={styles.chapterBadgeText} numberOfLines={1}>
              {isCover
                ? "Cover & Contents"
                : `${currentSpread.machineName} · Spread ${currentSpreadIndex + 1}/${totalSpreads}`}
            </ThemedText>
            <Ionicons name="chevron-down" size={14} color="#f5a623" />
          </Pressable>

          {/* Action buttons */}
          <View style={styles.topRightActions}>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityLabel="Share page"
            >
              <Ionicons name="share-outline" size={18} color="#f4ede0" />
            </Pressable>
            <Pressable
              onPress={toggleFullscreen}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityLabel="Toggle Fullscreen"
            >
              <Ionicons name="scan-outline" size={18} color="#f4ede0" />
            </Pressable>
          </View>
        </View>
      )}

      {/* Main Book Scroll Area */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: isFullscreen ? 80 : 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isCover ? (
          /* ==================== COVER SPREAD ==================== */
          <View style={styles.coverContainer}>
            <View style={styles.coverGoldBorder}>
              {/* NASA Space Apps Header */}
              <View style={styles.coverHeaderBadge}>
                <Ionicons name="planet" size={14} color="#f5a623" />
                <ThemedText style={styles.coverHeaderBadgeText}>
                  2026 NASA SPACE APPS CHALLENGE
                </ThemedText>
              </View>

              <ThemedText style={styles.coverSuperTitle}>
                ABANDONED BUT NOT FORGOTTEN
              </ThemedText>

              <ThemedText style={styles.coverMainTitle}>
                The Living Story Book
              </ThemedText>

              <View style={styles.coverDividerGold} />

              <ThemedText style={styles.coverSubtitle}>
                Storytelling About NASA&apos;s Discarded Equipment on the Moon and Mars
              </ThemedText>

              {/* Cover Art / Hero Image */}
              <View style={styles.coverHeroCard}>
                <Image
                  source={{ uri: assetUrl("images/hero-family.webp") }}
                  style={styles.coverHeroImage}
                  contentFit="contain"
                  priority="high"
                />
              </View>

              {/* Book Metadata Chips */}
              <View style={styles.coverMetaRow}>
                <View style={styles.coverMetaChip}>
                  <ThemedText style={styles.coverMetaChipVal}>58</ThemedText>
                  <ThemedText style={styles.coverMetaChipLabel}>Pages</ThemedText>
                </View>
                <View style={styles.coverMetaChip}>
                  <ThemedText style={styles.coverMetaChipVal}>15</ThemedText>
                  <ThemedText style={styles.coverMetaChipLabel}>Machines</ThemedText>
                </View>
                <View style={styles.coverMetaChip}>
                  <ThemedText style={styles.coverMetaChipVal}>100%</ThemedText>
                  <ThemedText style={styles.coverMetaChipLabel}>NASA Telemetry</ThemedText>
                </View>
              </View>

              {/* Call to action */}
              <Pressable
                onPress={goToNextSpread}
                style={({ pressed }) => [styles.startReadingBtn, pressed && styles.pressed]}
              >
                <Ionicons name="book" size={20} color="#0d0f22" />
                <ThemedText style={styles.startReadingBtnText}>
                  Begin Reading · Turn to Page 3
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => setShowToc(true)}
                style={({ pressed }) => [styles.tocQuickBtn, pressed && styles.pressed]}
              >
                <ThemedText style={styles.tocQuickBtnText}>
                  Browse Table of Contents (29 Spreads)
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ) : (
          /* ==================== SPREAD CONTENT ==================== */
          <View style={styles.spreadPageCard}>
            {/* Top Chapter Metadata Ribbon */}
            <View style={styles.metaRibbon}>
              <View style={styles.metaRibbonLeft}>
                {currentSpread.chapterNumber !== null ? (
                  <View style={styles.chapterNumTag}>
                    <ThemedText style={styles.chapterNumTagText}>
                      CHAPTER {currentSpread.chapterNumber}
                    </ThemedText>
                  </View>
                ) : (
                  <View style={styles.prologueTag}>
                    <ThemedText style={styles.prologueTagText}>SPECIAL DOSSIER</ThemedText>
                  </View>
                )}
                <ThemedText style={styles.metaMachineName}>
                  {currentSpread.machineName}
                </ThemedText>
              </View>

              {currentSpread.cosparId && (
                <View style={styles.cosparTag}>
                  <ThemedText style={styles.cosparTagText}>
                    {currentSpread.cosparId}
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Location & Date Sub-header */}
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={13} color="#4fc3f7" />
              <ThemedText style={styles.locationText} numberOfLines={1}>
                {currentSpread.dateAndLocation}
              </ThemedText>
            </View>

            {/* Spread Titles */}
            <ThemedText style={styles.spreadTitleText}>
              {currentSpread.spreadTitle}
            </ThemedText>
            <ThemedText style={styles.spreadSubtitleText}>
              {currentSpread.spreadSubtitle}
            </ThemedText>

            {/* Visual Frame */}
            {currentSpread.image && (
              <View style={styles.visualFrameWrap}>
                <Image
                  source={{ uri: assetUrl(currentSpread.image) }}
                  style={styles.visualFrameImage}
                  contentFit="cover"
                  transition={250}
                />
                {currentSpread.imageCaption && (
                  <View style={styles.captionBar}>
                    <Ionicons name="camera-outline" size={13} color="#f5a623" />
                    <ThemedText style={styles.captionText} numberOfLines={2}>
                      {currentSpread.imageCaption}
                    </ThemedText>
                  </View>
                )}
              </View>
            )}

            {/* Left Page (Historical Narrative) */}
            <View style={styles.pageContentSection}>
              {currentSpread.leftPage.heading && (
                <ThemedText style={styles.sectionHeading}>
                  {currentSpread.leftPage.heading}
                </ThemedText>
              )}
              {currentSpread.leftPage.subheading && (
                <ThemedText style={styles.sectionSubheading}>
                  {currentSpread.leftPage.subheading}
                </ThemedText>
              )}

              {currentSpread.leftPage.paragraphs.map((p, idx) => (
                <ThemedText key={`lp-p-${idx}`} style={styles.paragraphText}>
                  {p}
                </ThemedText>
              ))}

              {/* Callout Box */}
              {currentSpread.leftPage.calloutBox && (
                <View style={styles.calloutCard}>
                  <View style={styles.calloutHeader}>
                    <Ionicons name="bulb-outline" size={16} color="#f5a623" />
                    <ThemedText style={styles.calloutTitle}>
                      {currentSpread.leftPage.calloutBox.title}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.calloutBody}>
                    {currentSpread.leftPage.calloutBox.text}
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Interactive Simulation Widgets (Tailored per machine) */}
            {/* Spirit, Opportunity, InSight: Dust Storm Tau Slider */}
            {(currentSpread.heroSlug === "spirit" ||
              currentSpread.heroSlug === "opportunity" ||
              currentSpread.heroSlug === "insight") && (
              <View style={styles.interactiveWidgetCard}>
                <View style={styles.widgetHeader}>
                  <Ionicons name="sunny-outline" size={16} color="#f5a623" />
                  <ThemedText style={styles.widgetTitle}>
                    Martian Dust Atmospheric Extinction (Tau Simulator)
                  </ThemedText>
                </View>
                <ThemedText style={styles.widgetDesc}>
                  Slide through optical dust depth ($\tau$) to simulate atmospheric blackout and solar output drop:
                </ThemedText>

                <View style={styles.tauSliderButtons}>
                  {[0.5, 1.5, 3.5, 7.0, 10.8].map((tVal) => (
                    <Pressable
                      key={`tau-${tVal}`}
                      onPress={() => {
                        haptic.selection();
                        setSimulatedTau(tVal);
                      }}
                      style={[
                        styles.tauBtn,
                        simulatedTau === tVal && styles.tauBtnActive,
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.tauBtnText,
                          simulatedTau === tVal && styles.tauBtnTextActive,
                        ]}
                      >
                        $\tau$ {tVal}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>

                {/* Telemetry output preview */}
                <View style={styles.tauResultBar}>
                  <View style={styles.tauStat}>
                    <ThemedText style={styles.tauStatLabel}>Solar Power</ThemedText>
                    <ThemedText style={styles.tauStatValue}>{currentWh} Wh/sol</ThemedText>
                  </View>
                  <View style={styles.tauStat}>
                    <ThemedText style={styles.tauStatLabel}>Relative Sun</ThemedText>
                    <ThemedText style={styles.tauStatValue}>{powerPct}%</ThemedText>
                  </View>
                  <View style={styles.tauStat}>
                    <ThemedText style={styles.tauStatLabel}>Sky Status</ThemedText>
                    <ThemedText style={styles.tauStatValue}>
                      {simulatedTau >= 7 ? "Global Storm" : simulatedTau >= 3 ? "Hazy" : "Clear Sky"}
                    </ThemedText>
                  </View>
                </View>
              </View>
            )}

            {/* InSight: Marsquake Seismometer Laboratory */}
            {currentSpread.heroSlug === "insight" && (
              <View style={styles.interactiveWidgetCard}>
                <View style={styles.widgetHeader}>
                  <Ionicons name="pulse-outline" size={16} color="#4fc3f7" />
                  <ThemedText style={styles.widgetTitle}>
                    SEIS Seismometer Ground Shaking Trigger
                  </ThemedText>
                </View>
                <ThemedText style={styles.widgetDesc}>
                  Trigger verified Sol 1222 ($M_W 4.7$) or Sol 128 event on InSight&apos;s sensors:
                </ThemedText>
                <View style={styles.quakeButtonRow}>
                  <Pressable
                    onPress={() => triggerMarsquake(4.7)}
                    style={[styles.quakeBtn, marsquakeSimulating && styles.quakeBtnActive]}
                  >
                    <ThemedText style={styles.quakeBtnText}>
                      Sol 1222 Quake ($M_W 4.7$)
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={() => triggerMarsquake(2.3)}
                    style={[styles.quakeBtn, marsquakeSimulating && styles.quakeBtnActive]}
                  >
                    <ThemedText style={styles.quakeBtnText}>
                      Sol 128 First Tremor
                    </ThemedText>
                  </Pressable>
                </View>
                {marsquakeSimulating && (
                  <View style={styles.quakeAlert}>
                    <ThemedText style={styles.quakeAlertText}>
                      ⚠️ SEIS SENSOR VIBRATION RECORDING: Magnitude {activeQuakeMagnitude}
                    </ThemedText>
                  </View>
                )}
              </View>
            )}

            {/* Right Page (Science, Telemetry & Discoveries) */}
            <View style={styles.pageContentSection}>
              {currentSpread.rightPage.heading && (
                <ThemedText style={styles.sectionHeading}>
                  {currentSpread.rightPage.heading}
                </ThemedText>
              )}
              {currentSpread.rightPage.subheading && (
                <ThemedText style={styles.sectionSubheading}>
                  {currentSpread.rightPage.subheading}
                </ThemedText>
              )}

              {currentSpread.rightPage.paragraphs?.map((p, idx) => (
                <ThemedText key={`rp-p-${idx}`} style={styles.paragraphText}>
                  {p}
                </ThemedText>
              ))}

              {/* Telemetry Summary Stats */}
              {currentSpread.telemetrySummary && (
                <View style={styles.telemetryGrid}>
                  {currentSpread.telemetrySummary.map((t, idx) => (
                    <View key={`tel-${idx}`} style={styles.telemetryCard}>
                      <ThemedText style={styles.telemetryCardVal}>
                        {t.value}
                      </ThemedText>
                      <ThemedText style={styles.telemetryCardLabel}>
                        {t.label}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              )}

              {/* Historical Quote Box */}
              {currentSpread.rightPage.quote && (
                <View style={styles.quoteCard}>
                  <Ionicons name="chatbubbles-outline" size={18} color="#f5a623" />
                  <ThemedText style={styles.quoteText}>
                    &ldquo;{currentSpread.rightPage.quote.text}&rdquo;
                  </ThemedText>
                  <ThemedText style={styles.quoteAuthor}>
                    — {currentSpread.rightPage.quote.author}
                  </ThemedText>
                </View>
              )}

              {/* Takeaway Card */}
              {currentSpread.rightPage.takeaway && (
                <View style={styles.takeawayCard}>
                  <ThemedText style={styles.takeawayLabel}>HISTORICAL TAKEAWAY</ThemedText>
                  <ThemedText style={styles.takeawayText}>
                    {currentSpread.rightPage.takeaway}
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Page Numbering Footer on Spread */}
            <View style={styles.spreadPageFooter}>
              <ThemedText style={styles.spreadPageNum}>Page {leftPageNum}</ThemedText>
              <ThemedText style={styles.spreadCenterLabel}>
                The Last Signal Archive
              </ThemedText>
              <ThemedText style={styles.spreadPageNum}>Page {rightPageNum}</ThemedText>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Navigation Controller */}
      <View style={[styles.bottomControllerBar, { paddingBottom: insets.bottom + 10 }]}>
        <Pressable
          onPress={goToPrevSpread}
          disabled={currentSpreadIndex === 0}
          style={({ pressed }) => [
            styles.navPageBtn,
            currentSpreadIndex === 0 && styles.navBtnDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={currentSpreadIndex === 0 ? "#5f6368" : "#f4ede0"}
          />
          <ThemedText
            style={[
              styles.navPageBtnText,
              currentSpreadIndex === 0 && styles.navTextDisabled,
            ]}
          >
            Previous
          </ThemedText>
        </Pressable>

        {/* Center Page Picker Pill */}
        <Pressable
          onPress={() => setShowToc(true)}
          style={({ pressed }) => [styles.pageSelectorPill, pressed && styles.pressed]}
        >
          <ThemedText style={styles.pageSelectorText}>
            {isCover
              ? "Cover · P. 1–2"
              : `P. ${leftPageNum}–${rightPageNum} · Spread ${currentSpreadIndex + 1}/${totalSpreads}`}
          </ThemedText>
          <Ionicons name="list" size={14} color="#f5a623" />
        </Pressable>

        <Pressable
          onPress={goToNextSpread}
          disabled={currentSpreadIndex === totalSpreads - 1}
          style={({ pressed }) => [
            styles.navPageBtn,
            currentSpreadIndex === totalSpreads - 1 && styles.navBtnDisabled,
            pressed && styles.pressed,
          ]}
        >
          <ThemedText
            style={[
              styles.navPageBtnText,
              currentSpreadIndex === totalSpreads - 1 && styles.navTextDisabled,
            ]}
          >
            Next
          </ThemedText>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={currentSpreadIndex === totalSpreads - 1 ? "#5f6368" : "#f4ede0"}
          />
        </Pressable>
      </View>

      {/* Chapter Drawer Modal */}
      <ChapterDrawer
        visible={showToc}
        currentSpread={currentSpreadIndex}
        onSelectSpread={handleJumpToSpread}
        onClose={() => setShowToc(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080914",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#0d0f22",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  topRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chapterIndicatorPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 166, 35, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(245, 166, 35, 0.3)",
    gap: 6,
    maxWidth: "55%",
  },
  chapterBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#f5a623",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
  },
  pressed: {
    opacity: 0.7,
  },

  /* Cover Styles */
  coverContainer: {
    paddingVertical: 10,
  },
  coverGoldBorder: {
    backgroundColor: "#0d0f22",
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: "rgba(245, 166, 35, 0.4)",
    alignItems: "center",
  },
  coverHeaderBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 166, 35, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
    marginBottom: 16,
  },
  coverHeaderBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#f5a623",
    letterSpacing: 1,
  },
  coverSuperTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9aa0a6",
    letterSpacing: 2,
    textAlign: "center",
  },
  coverMainTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f4ede0",
    textAlign: "center",
    marginTop: 6,
    fontFamily: "SpaceGrotesk-Bold",
  },
  coverDividerGold: {
    width: 60,
    height: 3,
    backgroundColor: "#f5a623",
    borderRadius: 2,
    marginVertical: 14,
  },
  coverSubtitle: {
    fontSize: 14,
    color: "#d0d4dc",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  coverHeroCard: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#05060e",
    marginBottom: 20,
  },
  coverHeroImage: {
    width: "100%",
    height: "100%",
  },
  coverMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    width: "100%",
  },
  coverMetaChip: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  coverMetaChipVal: {
    fontSize: 18,
    fontWeight: "800",
    color: "#f5a623",
  },
  coverMetaChipLabel: {
    fontSize: 10,
    color: "#9aa0a6",
    marginTop: 2,
    textTransform: "uppercase",
  },
  startReadingBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5a623",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  startReadingBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0d0f22",
  },
  tocQuickBtn: {
    marginTop: 14,
    paddingVertical: 8,
  },
  tocQuickBtnText: {
    fontSize: 13,
    color: "#4fc3f7",
    textDecorationLine: "underline",
  },

  /* Spread Card Styles */
  spreadPageCard: {
    backgroundColor: "#0f1228",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(245, 166, 35, 0.25)",
  },
  metaRibbon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metaRibbonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chapterNumTag: {
    backgroundColor: "rgba(245, 166, 35, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chapterNumTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#f5a623",
  },
  prologueTag: {
    backgroundColor: "rgba(79, 195, 247, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  prologueTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#4fc3f7",
  },
  metaMachineName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#f4ede0",
    textTransform: "uppercase",
  },
  cosparTag: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cosparTagText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9aa0a6",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 11,
    color: "#4fc3f7",
    fontWeight: "600",
  },
  spreadTitleText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f4ede0",
    lineHeight: 26,
    fontFamily: "SpaceGrotesk-Bold",
  },
  spreadSubtitleText: {
    fontSize: 13,
    color: "#f5a623",
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 16,
  },
  visualFrameWrap: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(245, 166, 35, 0.3)",
    marginBottom: 18,
    backgroundColor: "#05060e",
  },
  visualFrameImage: {
    width: "100%",
    height: 190,
  },
  captionBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(13, 15, 34, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  captionText: {
    fontSize: 11,
    color: "#d0d4dc",
    flex: 1,
    lineHeight: 15,
  },
  pageContentSection: {
    marginBottom: 18,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f4ede0",
    marginBottom: 4,
  },
  sectionSubheading: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4fc3f7",
    marginBottom: 10,
  },
  paragraphText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#d0d4dc",
    marginBottom: 10,
  },
  calloutCard: {
    backgroundColor: "rgba(245, 166, 35, 0.08)",
    borderLeftWidth: 3,
    borderLeftColor: "#f5a623",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  calloutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  calloutTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#f5a623",
  },
  calloutBody: {
    fontSize: 12,
    lineHeight: 18,
    color: "#f4ede0",
  },
  interactiveWidgetCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(79, 195, 247, 0.25)",
    marginBottom: 18,
  },
  widgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  widgetTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#f4ede0",
  },
  widgetDesc: {
    fontSize: 11,
    color: "#9aa0a6",
    marginBottom: 10,
  },
  tauSliderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tauBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  tauBtnActive: {
    backgroundColor: "#f5a623",
  },
  tauBtnText: {
    fontSize: 11,
    color: "#9aa0a6",
    fontWeight: "700",
  },
  tauBtnTextActive: {
    color: "#0d0f22",
  },
  tauResultBar: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-around",
  },
  tauStat: {
    alignItems: "center",
  },
  tauStatLabel: {
    fontSize: 10,
    color: "#9aa0a6",
  },
  tauStatValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4fc3f7",
    marginTop: 2,
  },
  quakeButtonRow: {
    flexDirection: "row",
    gap: 8,
  },
  quakeBtn: {
    flex: 1,
    backgroundColor: "rgba(79, 195, 247, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(79, 195, 247, 0.4)",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  quakeBtnActive: {
    backgroundColor: "rgba(245, 166, 35, 0.3)",
    borderColor: "#f5a623",
  },
  quakeBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#f4ede0",
  },
  quakeAlert: {
    marginTop: 10,
    backgroundColor: "rgba(245, 166, 35, 0.2)",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  quakeAlertText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#f5a623",
  },
  telemetryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 12,
  },
  telemetryCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  telemetryCardVal: {
    fontSize: 14,
    fontWeight: "800",
    color: "#4fc3f7",
  },
  telemetryCardLabel: {
    fontSize: 10,
    color: "#9aa0a6",
    marginTop: 2,
  },
  quoteCard: {
    backgroundColor: "rgba(245, 166, 35, 0.06)",
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(245, 166, 35, 0.2)",
  },
  quoteText: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#f4ede0",
    lineHeight: 19,
    marginTop: 4,
  },
  quoteAuthor: {
    fontSize: 11,
    fontWeight: "700",
    color: "#f5a623",
    marginTop: 6,
    textAlign: "right",
  },
  takeawayCard: {
    backgroundColor: "rgba(79, 195, 247, 0.08)",
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#4fc3f7",
  },
  takeawayLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#4fc3f7",
    letterSpacing: 1,
    marginBottom: 4,
  },
  takeawayText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#f4ede0",
    fontWeight: "600",
  },
  spreadPageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    marginTop: 10,
  },
  spreadPageNum: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9aa0a6",
  },
  spreadCenterLabel: {
    fontSize: 10,
    color: "#5f6368",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  /* Bottom Floating Controller */
  bottomControllerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0d0f22",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  navPageBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  navBtnDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    opacity: 0.4,
  },
  navPageBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#f4ede0",
  },
  navTextDisabled: {
    color: "#5f6368",
  },
  pageSelectorPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 166, 35, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(245, 166, 35, 0.35)",
    gap: 6,
  },
  pageSelectorText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#f5a623",
  },
});
