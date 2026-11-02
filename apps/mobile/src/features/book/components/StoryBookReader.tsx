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
  TOC_ITEMS,
  type BookSpread,
  assetUrl,
} from "@thelastsignal/data";
import { ChapterDrawer } from "./ChapterDrawer";

export function StoryBookReader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  // 1 PAGE PER VIEW: exactly 58 pages (Page 1 to Page 58)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showToc, setShowToc] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [paperTheme, setPaperTheme] = useState<"parchment" | "dark">("parchment");

  // Dynamic interactive simulation state
  const [simulatedTau, setSimulatedTau] = useState(0.9);
  const [marsquakeSimulating, setMarsquakeSimulating] = useState(false);
  const [activeQuakeMagnitude, setActiveQuakeMagnitude] = useState<number | null>(null);

  const totalPages = SPREADS.length * 2; // 29 spreads * 2 = 58 pages
  const spreadIndex = Math.floor((currentPage - 1) / 2);
  const isLeftPage = currentPage % 2 !== 0; // Pages 1, 3, 5, 7 ... are left; 2, 4, 6, 8 ... are right
  const currentSpread: BookSpread = SPREADS[spreadIndex] ?? SPREADS[0];

  const isCover = currentPage === 1;
  const isToc = currentPage === 2;
  const isParchment = paperTheme === "parchment";

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      haptic.light();
      setCurrentPage((prev) => prev + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    } else {
      haptic.success();
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      haptic.light();
      setCurrentPage((prev) => prev - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [currentPage]);

  const handleJumpToPage = (pageNum: number) => {
    const clamped = Math.max(1, Math.min(totalPages, pageNum));
    setCurrentPage(clamped);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const togglePaperTheme = () => {
    haptic.selection();
    setPaperTheme((prev) => (prev === "parchment" ? "dark" : "parchment"));
  };

  const toggleFullscreen = () => {
    haptic.selection();
    setIsFullscreen((prev) => !prev);
  };

  const handleShare = async () => {
    try {
      haptic.light();
      await Share.share({
        title: "The Last Signal — Living Story Book",
        message: `Reading Page ${currentPage} of 58 (${currentSpread.spreadTitle}) in The Last Signal Story Book!`,
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

  // Dynamic styling variables based on parchment vs dark paper theme
  const paperBg = isParchment ? "#faf6ee" : "#0d1024";
  const paperBorder = isParchment ? "#e5dac9" : "rgba(245, 166, 35, 0.3)";
  const textColor = isParchment ? "#231f20" : "#f4ede0";
  const mutedTextColor = isParchment ? "#615c54" : "#9aa0a6";
  const headingColor = isParchment ? "#1a120b" : "#ffffff";
  const ruleColor = isParchment ? "rgba(180, 160, 130, 0.4)" : "rgba(255, 255, 255, 0.1)";

  return (
    <View style={styles.container}>
      <StatusBar hidden={isFullscreen} barStyle="light-content" backgroundColor="#070510" />

      {/* Reader Top Bar (Hidden in Fullscreen) */}
      {!isFullscreen && (
        <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            accessibilityLabel="Exit book reader"
          >
            <Ionicons name="arrow-back" size={20} color="#f4ede0" />
          </Pressable>

          {/* Chapter / Machine Pill */}
          <Pressable
            onPress={() => setShowToc(true)}
            style={({ pressed }) => [styles.chapterIndicatorPill, pressed && styles.pressed]}
          >
            <ThemedText style={styles.chapterBadgeText} numberOfLines={1}>
              {isCover
                ? "Front Cover"
                : isToc
                ? "Table of Contents"
                : `${currentSpread.machineName} · Page ${currentPage}/58`}
            </ThemedText>
            <Ionicons name="chevron-down" size={13} color="#f5a623" />
          </Pressable>

          {/* Top Right Tool Icons */}
          <View style={styles.topRightActions}>
            <Pressable
              onPress={togglePaperTheme}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityLabel="Toggle paper theme"
            >
              <Ionicons
                name={isParchment ? "moon-outline" : "sunny-outline"}
                size={17}
                color={isParchment ? "#f5a623" : "#4fc3f7"}
              />
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityLabel="Share page"
            >
              <Ionicons name="share-outline" size={17} color="#f4ede0" />
            </Pressable>
            <Pressable
              onPress={toggleFullscreen}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityLabel="Toggle fullscreen"
            >
              <Ionicons name="scan-outline" size={17} color="#f4ede0" />
            </Pressable>
          </View>
        </View>
      )}

      {/* Main Reading Stage */}
      <View style={styles.bookStage}>
        {/* PHYSICAL HARDCOVER BOOK FRAME */}
        <View style={styles.leatherHardcoverFrame}>
          {/* Silk Crimson Bookmark Ribbon draped from top center */}
          <View style={styles.silkBookmarkRibbon}>
            <View style={styles.silkBookmarkPoint} />
          </View>

          {/* SINGLE BOOK PAGE (EXACTLY 1 PAGE ON EACH VIEW) */}
          <View
            style={[
              styles.singlePagePaper,
              {
                backgroundColor: paperBg,
                borderColor: paperBorder,
              },
            ]}
          >
            {/* Gutter / Spine Shadow on the inner edge */}
            {isLeftPage ? (
              // Left Page: Spine crease shadow on the RIGHT edge
              <View style={styles.spineShadowRight} />
            ) : (
              // Right Page: Spine crease shadow on the LEFT edge
              <View style={styles.spineShadowLeft} />
            )}

            {/* Scrollable Page Body */}
            <ScrollView
              ref={scrollRef}
              style={styles.pageScrollView}
              contentContainerStyle={styles.pageScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {isCover ? (
                /* ==================== PAGE 1: FRONT COVER ==================== */
                <View style={styles.coverInner}>
                  <View style={styles.coverSealWrap}>
                    <Ionicons name="planet" size={16} color="#f5a623" />
                    <ThemedText style={styles.coverSealText}>
                      2026 NASA SPACE APPS MASTER DOSSIER
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.coverSuperTitle}>
                    ABANDONED BUT NOT FORGOTTEN
                  </ThemedText>

                  <ThemedText style={styles.coverBookTitle}>
                    The Living Story Book
                  </ThemedText>

                  <View style={styles.coverRuleGold} />

                  <ThemedText style={styles.coverSubtitle}>
                    Storytelling About NASA&apos;s Discarded Equipment on the Moon and Mars
                  </ThemedText>

                  {/* Hero Emblem Art */}
                  <View style={styles.coverImageWrap}>
                    <Image
                      source={{ uri: assetUrl("images/hero-family.webp") }}
                      style={styles.coverImage}
                      contentFit="contain"
                      priority="high"
                    />
                  </View>

                  <ThemedText style={styles.coverAudienceNote}>
                    Written for school-age space enthusiasts (ages 10–18) and casual explorers. Backed by 100% verified NASA NSSDCA, PDS, and HiRISE telemetry.
                  </ThemedText>

                  <Pressable
                    onPress={goToNextPage}
                    style={({ pressed }) => [styles.turnPageCoverBtn, pressed && styles.pressed]}
                  >
                    <ThemedText style={styles.turnPageCoverBtnText}>
                      Turn to Page 2 (Contents)
                    </ThemedText>
                    <Ionicons name="arrow-forward" size={16} color="#0d0f22" />
                  </Pressable>
                </View>
              ) : isToc ? (
                /* ==================== PAGE 2: TABLE OF CONTENTS ==================== */
                <View style={styles.tocInner}>
                  <ThemedText style={[styles.runningHeader, { color: mutedTextColor, borderBottomColor: ruleColor }]}>
                    TABLE OF CONTENTS · MASTER INDEX
                  </ThemedText>

                  <ThemedText style={[styles.tocMainTitle, { color: headingColor }]}>
                    Chronicle of Dormant Relics
                  </ThemedText>
                  <ThemedText style={[styles.tocSub, { color: mutedTextColor }]}>
                    Select any chapter or turn pages sequentially:
                  </ThemedText>

                  <View style={styles.tocGridMobile}>
                    {TOC_ITEMS.slice(1).map((item, idx) => (
                      <Pressable
                        key={`toc-grid-${idx}`}
                        onPress={() => handleJumpToPage(item.page)}
                        style={({ pressed }) => [
                          styles.tocMobileRow,
                          pressed && styles.pressed,
                        ]}
                      >
                        <ThemedText style={styles.tocMachineTag}>
                          {item.machine}
                        </ThemedText>
                        <ThemedText style={[styles.tocTitleText, { color: textColor }]} numberOfLines={1}>
                          {item.title.split(" — ")[0]}
                        </ThemedText>
                        <ThemedText style={styles.tocPageNum}>
                          p. {item.page}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>

                  <Pressable
                    onPress={goToNextPage}
                    style={({ pressed }) => [styles.turnPageCoverBtn, pressed && styles.pressed, { marginTop: 16 }]}
                  >
                    <ThemedText style={styles.turnPageCoverBtnText}>
                      Begin Prologue · Page 3
                    </ThemedText>
                    <Ionicons name="arrow-forward" size={16} color="#0d0f22" />
                  </Pressable>
                </View>
              ) : isLeftPage ? (
                /* ==================== PAGES 3, 5, 7, ... 57: LEFT PAGE (NARRATIVE) ==================== */
                <View style={styles.pageInner}>
                  {/* Running Header */}
                  <View style={[styles.runningHeaderRow, { borderBottomColor: ruleColor }]}>
                    <ThemedText style={[styles.runningHeaderLeft, { color: mutedTextColor }]}>
                      {currentSpread.chapterNumber !== null
                        ? `CHAPTER ${currentSpread.chapterNumber} · ${currentSpread.machineName}`
                        : currentSpread.machineName}
                    </ThemedText>
                    {currentSpread.cosparId && (
                      <ThemedText style={styles.runningHeaderRight}>
                        {currentSpread.cosparId}
                      </ThemedText>
                    )}
                  </View>

                  {/* Location badge */}
                  <View style={styles.pageLocationChip}>
                    <Ionicons name="location-sharp" size={12} color="#4fc3f7" />
                    <ThemedText style={styles.pageLocationChipText}>
                      {currentSpread.dateAndLocation}
                    </ThemedText>
                  </View>

                  {/* Chapter Titles */}
                  <ThemedText style={[styles.chapterTitleOnPage, { color: headingColor }]}>
                    {currentSpread.spreadTitle}
                  </ThemedText>
                  <ThemedText style={styles.chapterSubtitleOnPage}>
                    {currentSpread.spreadSubtitle}
                  </ThemedText>

                  {/* Left Page Heading & Subheading */}
                  {currentSpread.leftPage.heading && (
                    <ThemedText style={[styles.pageHeadingText, { color: headingColor }]}>
                      {currentSpread.leftPage.heading}
                    </ThemedText>
                  )}
                  {currentSpread.leftPage.subheading && (
                    <ThemedText style={styles.pageSubheadingText}>
                      {currentSpread.leftPage.subheading}
                    </ThemedText>
                  )}

                  {/* Left Page Narrative Paragraphs */}
                  {currentSpread.leftPage.paragraphs.map((p, idx) => (
                    <ThemedText key={`lp-${currentPage}-${idx}`} style={[styles.bookParagraph, { color: textColor }]}>
                      {p}
                    </ThemedText>
                  ))}

                  {/* Left Page Callout Box */}
                  {currentSpread.leftPage.calloutBox && (
                    <View style={styles.calloutParchment}>
                      <View style={styles.calloutHeaderRow}>
                        <Ionicons name="bookmark" size={14} color="#f5a623" />
                        <ThemedText style={styles.calloutHeading}>
                          {currentSpread.leftPage.calloutBox.title}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.calloutContent}>
                        {currentSpread.leftPage.calloutBox.text}
                      </ThemedText>
                    </View>
                  )}
                </View>
              ) : (
                /* ==================== PAGES 4, 6, 8, ... 58: RIGHT PAGE (SCIENCE & TELEMETRY) ==================== */
                <View style={styles.pageInner}>
                  {/* Running Header */}
                  <View style={[styles.runningHeaderRow, { borderBottomColor: ruleColor }]}>
                    <ThemedText style={[styles.runningHeaderLeft, { color: mutedTextColor }]}>
                      {currentSpread.machineName} · KEY SCIENCE
                    </ThemedText>
                    <ThemedText style={styles.runningHeaderRight}>
                      VERIFIED TELEMETRY
                    </ThemedText>
                  </View>

                  {/* Right Page Heading & Subheading */}
                  {currentSpread.rightPage.heading && (
                    <ThemedText style={[styles.pageHeadingText, { color: headingColor }]}>
                      {currentSpread.rightPage.heading}
                    </ThemedText>
                  )}
                  {currentSpread.rightPage.subheading && (
                    <ThemedText style={styles.pageSubheadingText}>
                      {currentSpread.rightPage.subheading}
                    </ThemedText>
                  )}

                  {/* Authentic NASA Photography Frame */}
                  {currentSpread.image && (
                    <View style={styles.nasaImageFrame}>
                      <Image
                        source={{ uri: assetUrl(currentSpread.image) }}
                        style={styles.nasaImageElement}
                        contentFit="cover"
                        transition={200}
                      />
                      {currentSpread.imageCaption && (
                        <View style={styles.nasaImageCaptionBar}>
                          <Ionicons name="camera-outline" size={12} color="#f5a623" />
                          <ThemedText style={styles.nasaImageCaptionText} numberOfLines={2}>
                            {currentSpread.imageCaption}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Telemetry Grid Summary */}
                  {currentSpread.telemetrySummary && (
                    <View style={styles.pageTelemetryGrid}>
                      {currentSpread.telemetrySummary.map((t, idx) => (
                        <View key={`tel-chip-${idx}`} style={styles.pageTelemetryChip}>
                          <ThemedText style={styles.pageTelemetryVal}>
                            {t.value}
                          </ThemedText>
                          <ThemedText style={styles.pageTelemetryLabel}>
                            {t.label}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Interactive Widgets on Right Page */}
                  {/* Dust Storm Tau Simulator (Spirit, Opportunity, InSight) */}
                  {(currentSpread.heroSlug === "spirit" ||
                    currentSpread.heroSlug === "opportunity" ||
                    currentSpread.heroSlug === "insight") && (
                    <View style={styles.pageInteractiveWidget}>
                      <View style={styles.widgetTitleRow}>
                        <Ionicons name="sunny" size={14} color="#f5a623" />
                        <ThemedText style={styles.widgetHeaderLabel}>
                          Martian Sky Dust Extinction ($\tau$)
                        </ThemedText>
                      </View>
                      <View style={styles.tauBtnRow}>
                        {[0.5, 1.5, 3.5, 7.0, 10.8].map((tVal) => (
                          <Pressable
                            key={`tau-btn-${tVal}`}
                            onPress={() => {
                              haptic.selection();
                              setSimulatedTau(tVal);
                            }}
                            style={[
                              styles.tauPill,
                              simulatedTau === tVal && styles.tauPillActive,
                            ]}
                          >
                            <ThemedText
                              style={[
                                styles.tauPillText,
                                simulatedTau === tVal && styles.tauPillTextActive,
                              ]}
                            >
                              $\tau$ {tVal}
                            </ThemedText>
                          </Pressable>
                        ))}
                      </View>
                      <View style={styles.tauPowerOutputRow}>
                        <ThemedText style={styles.tauPowerLabel}>
                          Estimated Power: <ThemedText style={styles.tauPowerBold}>{currentWh} Wh/sol</ThemedText> ({powerPct}% sun)
                        </ThemedText>
                      </View>
                    </View>
                  )}

                  {/* InSight Seismometer Vibration Laboratory */}
                  {currentSpread.heroSlug === "insight" && (
                    <View style={styles.pageInteractiveWidget}>
                      <View style={styles.widgetTitleRow}>
                        <Ionicons name="pulse" size={14} color="#4fc3f7" />
                        <ThemedText style={styles.widgetHeaderLabel}>
                          SEIS Marsquake Ground Sensor Trigger
                        </ThemedText>
                      </View>
                      <View style={styles.quakeBtnRow}>
                        <Pressable
                          onPress={() => triggerMarsquake(4.7)}
                          style={[styles.quakeOptionBtn, marsquakeSimulating && styles.quakeOptionBtnActive]}
                        >
                          <ThemedText style={styles.quakeOptionText}>
                            Sol 1222 ($M_W 4.7$)
                          </ThemedText>
                        </Pressable>
                        <Pressable
                          onPress={() => triggerMarsquake(2.3)}
                          style={[styles.quakeOptionBtn, marsquakeSimulating && styles.quakeOptionBtnActive]}
                        >
                          <ThemedText style={styles.quakeOptionText}>
                            Sol 128 Tremor
                          </ThemedText>
                        </Pressable>
                      </View>
                      {marsquakeSimulating && (
                        <View style={styles.quakeAlertBox}>
                          <ThemedText style={styles.quakeAlertText}>
                            ⚠️ SEIS RECORDING VIBRATIONS: Magnitude {activeQuakeMagnitude}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Right Page Narrative Paragraphs */}
                  {currentSpread.rightPage.paragraphs?.map((p, idx) => (
                    <ThemedText key={`rp-${currentPage}-${idx}`} style={[styles.bookParagraph, { color: textColor }]}>
                      {p}
                    </ThemedText>
                  ))}

                  {/* Verified Historical Quote */}
                  {currentSpread.rightPage.quote && (
                    <View style={styles.quoteParchment}>
                      <ThemedText style={styles.quoteBody}>
                        &ldquo;{currentSpread.rightPage.quote.text}&rdquo;
                      </ThemedText>
                      <ThemedText style={styles.quoteAuthor}>
                        — {currentSpread.rightPage.quote.author}
                      </ThemedText>
                    </View>
                  )}

                  {/* Historical Takeaway */}
                  {currentSpread.rightPage.takeaway && (
                    <View style={styles.takeawayParchment}>
                      <ThemedText style={styles.takeawayTag}>HISTORICAL TAKEAWAY</ThemedText>
                      <ThemedText style={styles.takeawayBody}>
                        {currentSpread.rightPage.takeaway}
                      </ThemedText>
                    </View>
                  )}
                </View>
              )}

              {/* Running Footer Page Number */}
              <View style={[styles.runningFooterRow, { borderTopColor: ruleColor }]}>
                <ThemedText style={[styles.runningFooterText, { color: mutedTextColor }]}>
                  — {currentPage} —
                </ThemedText>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Floating Bottom Navigation Controller */}
      <View style={[styles.bottomControllerBar, { paddingBottom: insets.bottom + 10 }]}>
        <Pressable
          onPress={goToPrevPage}
          disabled={currentPage === 1}
          style={({ pressed }) => [
            styles.navPageBtn,
            currentPage === 1 && styles.navBtnDisabled,
            pressed && styles.pressed,
          ]}
          accessibilityLabel="Previous page"
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={currentPage === 1 ? "#5f6368" : "#f4ede0"}
          />
          <ThemedText
            style={[
              styles.navPageBtnText,
              currentPage === 1 && styles.navTextDisabled,
            ]}
          >
            Prev
          </ThemedText>
        </Pressable>

        {/* Center Page Picker Pill */}
        <Pressable
          onPress={() => setShowToc(true)}
          style={({ pressed }) => [styles.pageSelectorPill, pressed && styles.pressed]}
          accessibilityLabel="Open table of contents"
        >
          <Ionicons name="book-outline" size={14} color="#f5a623" />
          <ThemedText style={styles.pageSelectorText}>
            Page {currentPage} of {totalPages}
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={goToNextPage}
          disabled={currentPage === totalPages}
          style={({ pressed }) => [
            styles.navPageBtn,
            currentPage === totalPages && styles.navBtnDisabled,
            pressed && styles.pressed,
          ]}
          accessibilityLabel="Next page"
        >
          <ThemedText
            style={[
              styles.navPageBtnText,
              currentPage === totalPages && styles.navTextDisabled,
            ]}
          >
            Next
          </ThemedText>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={currentPage === totalPages ? "#5f6368" : "#f4ede0"}
          />
        </Pressable>
      </View>

      {/* Table of Contents Chapter Drawer */}
      <ChapterDrawer
        visible={showToc}
        currentPage={currentPage}
        onSelectPage={handleJumpToPage}
        onClose={() => setShowToc(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070510",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
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
    maxWidth: "52%",
  },
  chapterBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#f5a623",
  },
  pressed: {
    opacity: 0.7,
  },

  /* Physical Book Stage */
  bookStage: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  leatherHardcoverFrame: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#170e28",
    borderRadius: 24,
    borderWidth: 4,
    borderColor: "#2b1f3d",
    padding: 6,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 12,
    position: "relative",
  },
  silkBookmarkRibbon: {
    position: "absolute",
    top: -6,
    alignSelf: "center",
    width: 20,
    height: 44,
    backgroundColor: "#b91c1c",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(245, 166, 35, 0.5)",
    zIndex: 40,
    alignItems: "center",
  },
  silkBookmarkPoint: {
    position: "absolute",
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#170e28",
  },
  singlePagePaper: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
  },
  spineShadowLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    zIndex: 10,
  },
  spineShadowRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    zIndex: 10,
  },
  pageScrollView: {
    flex: 1,
  },
  pageScrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  /* Page Running Header & Footer */
  runningHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  runningHeaderLeft: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  runningHeaderRight: {
    fontSize: 9,
    fontWeight: "800",
    color: "#f5a623",
    letterSpacing: 0.5,
  },
  runningFooterRow: {
    alignItems: "center",
    paddingTop: 12,
    marginTop: 16,
    borderTopWidth: 1,
  },
  runningFooterText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },

  /* Cover Inner Styles */
  coverInner: {
    alignItems: "center",
    paddingVertical: 12,
  },
  coverSealWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 166, 35, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    marginBottom: 14,
  },
  coverSealText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#f5a623",
    letterSpacing: 1,
  },
  coverSuperTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8a7e70",
    letterSpacing: 2,
    textAlign: "center",
  },
  coverBookTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1a120b",
    textAlign: "center",
    marginTop: 6,
    fontFamily: "SpaceGrotesk-Bold",
  },
  coverRuleGold: {
    width: 60,
    height: 3,
    backgroundColor: "#f5a623",
    borderRadius: 2,
    marginVertical: 12,
  },
  coverSubtitle: {
    fontSize: 13,
    color: "#4a4238",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 16,
  },
  coverImageWrap: {
    width: "100%",
    height: 190,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#05060e",
    marginBottom: 14,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverAudienceNote: {
    fontSize: 11,
    color: "#786f63",
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  turnPageCoverBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5a623",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 8,
    width: "100%",
  },
  turnPageCoverBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0d0f22",
  },

  /* TOC Inner Styles */
  tocInner: {
    paddingVertical: 6,
  },
  runningHeader: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingBottom: 6,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  tocMainTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
    fontFamily: "SpaceGrotesk-Bold",
  },
  tocSub: {
    fontSize: 12,
    marginBottom: 14,
  },
  tocGridMobile: {
    gap: 6,
  },
  tocMobileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    gap: 8,
  },
  tocMachineTag: {
    fontSize: 10,
    fontWeight: "800",
    color: "#c2410c",
    textTransform: "uppercase",
    width: 80,
  },
  tocTitleText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
  },
  tocPageNum: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8a7e70",
  },

  /* Standard Page Inner */
  pageInner: {
    paddingVertical: 4,
  },
  pageLocationChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  pageLocationChipText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0284c7",
  },
  chapterTitleOnPage: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
    fontFamily: "SpaceGrotesk-Bold",
    marginBottom: 2,
  },
  chapterSubtitleOnPage: {
    fontSize: 12,
    fontWeight: "700",
    color: "#c2410c",
    marginBottom: 14,
  },
  pageHeadingText: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  pageSubheadingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0284c7",
    marginBottom: 10,
  },
  bookParagraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  calloutParchment: {
    backgroundColor: "rgba(245, 166, 35, 0.1)",
    borderLeftWidth: 3,
    borderLeftColor: "#f5a623",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  calloutHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  calloutHeading: {
    fontSize: 12,
    fontWeight: "800",
    color: "#b45309",
  },
  calloutContent: {
    fontSize: 12,
    lineHeight: 18,
    color: "#443b31",
  },

  /* Right Page Photo Frame */
  nasaImageFrame: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    marginBottom: 14,
    backgroundColor: "#05060e",
  },
  nasaImageElement: {
    width: "100%",
    height: 180,
  },
  nasaImageCaptionBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 18, 38, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  nasaImageCaptionText: {
    fontSize: 10,
    color: "#f4ede0",
    flex: 1,
    lineHeight: 14,
  },

  /* Telemetry Grid */
  pageTelemetryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  pageTelemetryChip: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
  },
  pageTelemetryVal: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0369a1",
  },
  pageTelemetryLabel: {
    fontSize: 9,
    color: "#716b60",
    marginTop: 2,
    textTransform: "uppercase",
  },

  /* Interactive Simulation Widgets */
  pageInteractiveWidget: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(245, 166, 35, 0.3)",
    marginBottom: 12,
  },
  widgetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  widgetHeaderLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#b45309",
  },
  tauBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  tauPill: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
  tauPillActive: {
    backgroundColor: "#f5a623",
  },
  tauPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6b6459",
  },
  tauPillTextActive: {
    color: "#0d0f22",
  },
  tauPowerOutputRow: {
    paddingTop: 4,
  },
  tauPowerLabel: {
    fontSize: 11,
    color: "#443b31",
  },
  tauPowerBold: {
    fontWeight: "800",
    color: "#0284c7",
  },
  quakeBtnRow: {
    flexDirection: "row",
    gap: 8,
  },
  quakeOptionBtn: {
    flex: 1,
    backgroundColor: "rgba(2, 132, 199, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(2, 132, 199, 0.3)",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  quakeOptionBtnActive: {
    backgroundColor: "rgba(245, 166, 35, 0.25)",
    borderColor: "#f5a623",
  },
  quakeOptionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0369a1",
  },
  quakeAlertBox: {
    marginTop: 8,
    backgroundColor: "rgba(245, 166, 35, 0.2)",
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  quakeAlertText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#b45309",
  },

  /* Quote & Takeaway */
  quoteParchment: {
    backgroundColor: "rgba(245, 166, 35, 0.08)",
    borderLeftWidth: 3,
    borderLeftColor: "#f5a623",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  quoteBody: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#383127",
    lineHeight: 18,
  },
  quoteAuthor: {
    fontSize: 10,
    fontWeight: "800",
    color: "#b45309",
    marginTop: 4,
    textAlign: "right",
  },
  takeawayParchment: {
    backgroundColor: "rgba(2, 132, 199, 0.08)",
    borderLeftWidth: 3,
    borderLeftColor: "#0284c7",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  takeawayTag: {
    fontSize: 9,
    fontWeight: "800",
    color: "#0284c7",
    letterSpacing: 1,
    marginBottom: 2,
  },
  takeawayBody: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1e293b",
    lineHeight: 16,
  },

  /* Bottom Floating Controller Bar */
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  navBtnDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    opacity: 0.35,
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
    fontSize: 12,
    fontWeight: "800",
    color: "#f5a623",
  },
});
