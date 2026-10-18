import { useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import {
  HEROES,
  photo,
  assetUrl,
  type Body,
  type Hero,
} from "@thelastsignal/data";
import { useGameStore } from "@/stores/use-game-store";
import { GlobeView } from "@/features/games/touchdown/components/GlobeView";
import { DescentSimulator } from "@/features/games/touchdown/components/DescentSimulator";
import { SurfaceSimulator } from "@/features/games/touchdown/components/SurfaceSimulator";
import { DiscoveryModal } from "@/features/games/touchdown/components/DiscoveryModal";
import { JournalModal } from "@/features/games/touchdown/components/JournalModal";

type ActiveGame = "touchdown" | "delay" | "quiz" | null;

export default function GamesScreen() {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [showJournal, setShowJournal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { sites, landings } = useGameStore();

  const foundCount = Object.values(sites).filter((s) => s.found).length;
  const litCount = Object.values(sites).filter((s) => s.light).length;

  const handleRefresh = () => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      haptic.success();
    }, 500);
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.eyebrowRow}>
          <View style={styles.beaconDot} />
          <ThemedText style={styles.eyebrow} type="small">
            SIMULATION &amp; TELEMETRY
          </ThemedText>
        </View>
        <ThemedText style={styles.title} type="title">
          Exploration Simulators
        </ThemedText>
        <ThemedText style={styles.subtitle} type="small">
          Interactive flight simulators, deep space radio latency, and historical photo archives from real planetary missions.
        </ThemedText>
        <Waveform seed="games-telemetry" bars={36} fade={0.25} height={18} color={Colors.light.violet} style={{ marginTop: 8 }} />
      </View>

      {/* Pilot Journal Stats Card */}
      <Pressable
        onPress={() => {
          haptic.light();
          setShowJournal(true);
        }}
        style={({ pressed }) => [styles.journalBento, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel="Open Pilot Mission Log and Journal"
      >
        <View style={styles.journalHeader}>
          <View style={styles.journalTitleRow}>
            <Ionicons name="book" size={16} color={Colors.light.violet} />
            <ThemedText style={styles.journalTitle}>Pilot Flight Log &amp; Journal</ThemedText>
          </View>
          <ThemedText style={styles.journalLink} type="small">Inspect Log →</ThemedText>
        </View>

        <View style={styles.journalStatsRow}>
          <View style={styles.journalStat}>
            <ThemedText style={styles.journalStatVal}>{foundCount}/{HEROES.length}</ThemedText>
            <ThemedText style={styles.journalStatLbl} type="small">Explorers Visited</ThemedText>
          </View>
          <View style={styles.journalStatDivider} />
          <View style={styles.journalStat}>
            <ThemedText style={styles.journalStatVal}>{litCount}</ThemedText>
            <ThemedText style={styles.journalStatLbl} type="small">Beacons Lit</ThemedText>
          </View>
          <View style={styles.journalStatDivider} />
          <View style={styles.journalStat}>
            <ThemedText style={styles.journalStatVal}>{landings}</ThemedText>
            <ThemedText style={styles.journalStatLbl} type="small">Successful Landings</ThemedText>
          </View>
        </View>
      </Pressable>

      {/* Game Selection Cards */}
      <View style={styles.gamesList}>
        {/* 1. Touchdown Simulator */}
        <Pressable
          onPress={() => {
            haptic.light();
            setActiveGame("touchdown");
          }}
          style={({ pressed }) => [styles.gameCard, pressed && styles.cardPressed]}
          accessibilityRole="button"
          accessibilityLabel="Launch Touchdown Descent Simulator"
        >
          <View style={styles.cardTop}>
            <Image
              source={{ uri: assetUrl("images/icon-touchdown.webp") }}
              style={styles.gameIcon}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.cardMeta}>
              <View style={styles.gameTagRow}>
                <ThemedText style={styles.cardTag} type="small">FLAGSHIP PILGRIMAGE</ThemedText>
                <View style={styles.liveBadge}>
                  <ThemedText style={styles.liveBadgeText} type="small">ACTIVE</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.gameCardTitle}>Touchdown: Planetary Landing</ThemedText>
              <ThemedText style={styles.gameCardSubtitle} type="small">
                Fly manual retro-propulsion landings on Mars and the Moon, then drive a rover to real resting places to light eternal memorial beacons.
              </ThemedText>
            </View>
          </View>

          <View style={styles.playRow}>
            <ThemedText style={styles.playText}>Launch Landing Mission</ThemedText>
            <Ionicons name="arrow-forward" size={15} color={Colors.light.violet} />
          </View>
        </Pressable>

        {/* 2. Drive with a Delay */}
        <Pressable
          onPress={() => {
            haptic.light();
            setActiveGame("delay");
          }}
          style={({ pressed }) => [styles.gameCard, pressed && styles.cardPressed]}
          accessibilityRole="button"
          accessibilityLabel="Launch Drive with a Delay"
        >
          <View style={styles.cardTop}>
            <View style={[styles.gameIcon, styles.delayIcon]}>
              <Ionicons name="timer-outline" size={32} color="#ffffff" />
            </View>
            <View style={styles.cardMeta}>
              <ThemedText style={styles.cardTag} type="small">RADIO PROPAGATION</ThemedText>
              <ThemedText style={styles.gameCardTitle}>Drive With a Delay</ThemedText>
              <ThemedText style={styles.gameCardSubtitle} type="small">
                Experience real planetary signal latency. Queue drive commands and wait as radio waves traverse millions of kilometers across space.
              </ThemedText>
            </View>
          </View>

          <View style={styles.playRow}>
            <ThemedText style={styles.playText}>Experience Latency</ThemedText>
            <Ionicons name="arrow-forward" size={15} color={Colors.light.violet} />
          </View>
        </Pressable>

        {/* 3. Whose last view? */}
        <Pressable
          onPress={() => {
            haptic.light();
            setActiveGame("quiz");
          }}
          style={({ pressed }) => [styles.gameCard, pressed && styles.cardPressed]}
          accessibilityRole="button"
          accessibilityLabel="Launch Whose Last View Photo Quiz"
        >
          <View style={styles.cardTop}>
            <View style={[styles.gameIcon, styles.quizIcon]}>
              <Ionicons name="camera-outline" size={32} color="#ffffff" />
            </View>
            <View style={styles.cardMeta}>
              <ThemedText style={styles.cardTag} type="small">NASA ARCHIVE QUIZ</ThemedText>
              <ThemedText style={styles.gameCardTitle}>Whose Last View?</ThemedText>
              <ThemedText style={styles.gameCardSubtitle} type="small">
                Identify which robotic explorer captured real historical surface photographs from NASA&apos;s public domain Planetary Data System.
              </ThemedText>
            </View>
          </View>

          <View style={styles.playRow}>
            <ThemedText style={styles.playText}>Start Image Quiz</ThemedText>
            <Ionicons name="arrow-forward" size={15} color={Colors.light.violet} />
          </View>
        </Pressable>
      </View>

      {/* Modals for Games */}
      {activeGame === "touchdown" && (
        <TouchdownGameModal onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "delay" && (
        <DelayModal onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "quiz" && (
        <QuizModal onClose={() => setActiveGame(null)} />
      )}
      {showJournal && (
        <JournalModal
          visible={showJournal}
          onClose={() => setShowJournal(false)}
          onSelectSite={() => {
            setActiveGame("touchdown");
          }}
        />
      )}
    </ScrollView>
  );
}

/* ─────────────────────────────────────────────────────────
   1. FULL TOUCHDOWN PILGRIMAGE GAME MODAL
   ───────────────────────────────────────────────────────── */
function TouchdownGameModal({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { recordLanding, recordCrash } = useGameStore();

  const [body, setBody] = useState<Body>("mars");
  const [selectedHero, setSelectedHero] = useState<Hero>(
    () => HEROES.find((h) => h.body === "mars") ?? HEROES[0]
  );
  const [phase, setPhase] = useState<"orbit" | "descent" | "surface" | "discovery">("orbit");
  const [showJournal, setShowJournal] = useState(false);
  const [crashReason, setCrashReason] = useState<string | null>(null);

  const handleSelectHero = (hero: Hero) => {
    setSelectedHero(hero);
    if (hero.body !== body) setBody(hero.body);
  };

  const handleStartDescent = (hero: Hero) => {
    setSelectedHero(hero);
    setCrashReason(null);
    setPhase("descent");
  };

  const handleDescentSuccess = () => {
    recordLanding(selectedHero.slug, true);
    setPhase("surface");
  };

  const handleDescentCrash = (reason: string) => {
    recordCrash(selectedHero.slug);
    setCrashReason(reason);
  };

  const handleSurfaceReach = () => {
    setPhase("discovery");
  };

  const handleDiscoveryFinish = () => {
    setPhase("orbit");
  };

  return (
    <Modal visible animationType="slide">
      <View style={[styles.modalRoot, { paddingTop: Math.max(insets.top + 6, 16) }]}>
        {/* Top App Bar */}
        <View style={styles.modalTopBar}>
          <View style={styles.modalBrandRow}>
            <Ionicons name="planet" size={18} color="#38bdf8" />
            <ThemedText style={styles.modalBadgeText} type="small">
              TOUCHDOWN: {selectedHero.name.toUpperCase()}
            </ThemedText>
          </View>
          <Pressable onPress={onClose} style={styles.modalCloseBtn}>
            <Ionicons name="close" size={20} color="#ffffff" />
          </Pressable>
        </View>

        {/* Planet Switcher Tab Bar (Mars vs Moon) */}
        {phase === "orbit" && (
          <View style={styles.planetTabs}>
            <Pressable
              onPress={() => {
                haptic.selection();
                setBody("mars");
                const firstMars = HEROES.find((h) => h.body === "mars");
                if (firstMars) setSelectedHero(firstMars);
              }}
              style={[styles.planetTab, body === "mars" && styles.planetTabActiveMars]}
            >
              <Text style={[styles.planetTabText, body === "mars" && styles.planetTabTextActive]}>
                MARS (8 EXPLORERS)
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                haptic.selection();
                setBody("moon");
                const firstMoon = HEROES.find((h) => h.body === "moon");
                if (firstMoon) setSelectedHero(firstMoon);
              }}
              style={[styles.planetTab, body === "moon" && styles.planetTabActiveMoon]}
            >
              <Text style={[styles.planetTabText, body === "moon" && styles.planetTabTextActive]}>
                THE MOON (7 EXPLORERS)
              </Text>
            </Pressable>
          </View>
        )}

        {/* Phase 1: Interactive Orbit Globe */}
        {phase === "orbit" && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <GlobeView
              body={body}
              selectedHero={selectedHero}
              onSelectHero={handleSelectHero}
              onInitiateDescent={handleStartDescent}
              onOpenJournal={() => setShowJournal(true)}
            />
          </ScrollView>
        )}

        {/* Phase 2: 60 FPS Atmospheric Entry & Retro-Burn Simulator */}
        {phase === "descent" && (
          <DescentSimulator
            hero={selectedHero}
            onSuccess={handleDescentSuccess}
            onCrash={handleDescentCrash}
            onAbort={() => setPhase("orbit")}
          />
        )}

        {/* Crash Report Overlay */}
        {crashReason && (
          <View style={styles.crashOverlay}>
            <View style={styles.crashCard}>
              <View style={styles.crashIconWrap}>
                <Ionicons name="alert-circle" size={32} color="#ef4444" />
              </View>
              <Text style={styles.crashTitle}>IMPACT DETECTED • HULL BREACH</Text>
              <Text style={styles.crashReasonText}>{crashReason}</Text>
              <View style={styles.crashBtnRow}>
                <Pressable
                  onPress={() => {
                    haptic.medium();
                    setCrashReason(null);
                    setPhase("descent");
                  }}
                  style={styles.retryBtn}
                >
                  <Ionicons name="refresh" size={16} color="#ffffff" />
                  <Text style={styles.retryBtnText}>RETRY DESCENT</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    haptic.light();
                    setCrashReason(null);
                    setPhase("orbit");
                  }}
                  style={styles.orbitReturnBtn}
                >
                  <Text style={styles.orbitReturnText}>ORBIT</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Phase 3: 60 FPS Surface Traversal & Rover Driving Simulator */}
        {phase === "surface" && (
          <SurfaceSimulator
            hero={selectedHero}
            onReachMachine={handleSurfaceReach}
            onCollectEcho={() => {}}
            onAbort={() => setPhase("orbit")}
          />
        )}

        {/* Phase 4: Machine Discovery Ceremony & Memorial Beacon Ignition */}
        <DiscoveryModal
          hero={selectedHero}
          visible={phase === "discovery"}
          onFinish={handleDiscoveryFinish}
        />

        {/* Flight Log & Memorial Journal */}
        <JournalModal
          visible={showJournal}
          onClose={() => setShowJournal(false)}
          onSelectSite={(hero) => {
            setSelectedHero(hero);
            if (hero.body !== body) setBody(hero.body);
          }}
        />
      </View>
    </Modal>
  );
}


/* ─────────────────────────────────────────────────────────
   3. DRIVE WITH A DELAY MODAL
   ───────────────────────────────────────────────────────── */
function DelayModal({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [delaySec, setDelaySec] = useState(3);
  const [queue, setQueue] = useState<{ id: number; action: string; remaining: number }[]>([]);
  const [history, setHistory] = useState<string[]>([
    "Rover booted in Jezero Crater.",
    "Radio downlink carrier established.",
  ]);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setQueue((prevQueue) => {
        if (prevQueue.length === 0) return prevQueue;
        const nextQueue = prevQueue.map((item) => ({ ...item, remaining: item.remaining - 0.2 }));
        const finished = nextQueue.filter((item) => item.remaining <= 0);

        finished.forEach((item) => {
          haptic.light();
          setHistory((h) => [`[+${delaySec}s radio latency] Executed: ${item.action}`, ...h.slice(0, 8)]);
          if (item.action.includes("Forward")) setPos((p) => ({ ...p, y: p.y - 12 }));
          if (item.action.includes("Left")) setPos((p) => ({ ...p, x: p.x - 12 }));
          if (item.action.includes("Right")) setPos((p) => ({ ...p, x: p.x + 12 }));
        });

        return nextQueue.filter((item) => item.remaining > 0);
      });
    }, 200);

    return () => clearInterval(timer);
  }, [delaySec]);

  const sendCommand = (cmd: string) => {
    haptic.selection();
    setQueue((q) => [...q, { id: Date.now() + Math.random(), action: cmd, remaining: delaySec }]);
  };

  return (
    <Modal visible animationType="slide">
      <View style={[styles.modalRoot, { paddingTop: Math.max(insets.top + 6, 16) }]}>
        <View style={styles.modalTopBar}>
          <ThemedText style={styles.modalBadgeText} type="small">RADIO PROPAGATION DELAY</ThemedText>
          <Pressable onPress={onClose} style={styles.modalCloseBtn}>
            <Ionicons name="close" size={20} color="#ffffff" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.delayContent} showsVerticalScrollIndicator={false}>
          <ThemedText style={styles.delayTitle}>Drive with a Delay</ThemedText>
          <ThemedText style={styles.delaySub} type="small">
            Planetary commands cannot be driven in real time. Radio packets travel at light speed, requiring pre-planned command queues.
          </ThemedText>

          {/* Latency Presets */}
          <View style={styles.delayPillsRow}>
            {[
              { sec: 1.3, label: "Moon (1.3s)" },
              { sec: 4, label: "Mars Near (4s)" },
              { sec: 8, label: "Mars Far (8s)" },
            ].map((p) => (
              <Pressable
                key={p.sec}
                onPress={() => {
                  haptic.light();
                  setDelaySec(p.sec);
                }}
                style={[styles.delayPill, delaySec === p.sec && styles.delayPillActive]}
              >
                <ThemedText style={[styles.delayPillText, delaySec === p.sec && styles.delayPillTextActive]} type="small">
                  {p.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          {/* Rover Surface Grid */}
          <View style={styles.roverGridStage}>
            <View style={[styles.roverPin, { transform: [{ translateX: pos.x }, { translateY: pos.y }] }]}>
              <Ionicons name="navigate" size={28} color="#f59e0b" />
              <ThemedText style={styles.roverPinLabel} type="small">Rover</ThemedText>
            </View>
          </View>

          {/* In-Transit Packets */}
          <View style={styles.queueCard}>
            <ThemedText style={styles.queueHeaderTitle} type="small">
              RADIO PACKETS IN TRANSIT ({queue.length})
            </ThemedText>
            {queue.length === 0 ? (
              <ThemedText style={styles.emptyQueueText} type="small">
                All uplink commands received by rover. Ready for next packet.
              </ThemedText>
            ) : (
              queue.map((item) => (
                <View key={item.id} style={styles.queueItemRow}>
                  <Ionicons name="radio" size={14} color={Colors.light.violet} />
                  <ThemedText style={styles.queueActionText}>{item.action}</ThemedText>
                  <ThemedText style={styles.queueRemainingText} type="small">
                    {Math.max(0, item.remaining).toFixed(1)}s
                  </ThemedText>
                </View>
              ))
            )}
          </View>

          {/* Command Buttons */}
          <View style={styles.commandGrid}>
            <Pressable onPress={() => sendCommand("Drive Forward (1m)")} style={styles.cmdButton}>
              <Ionicons name="arrow-up" size={18} color="#ffffff" />
              <ThemedText style={styles.cmdButtonText}>Forward</ThemedText>
            </Pressable>
            <Pressable onPress={() => sendCommand("Turn Left (15°)")} style={styles.cmdButton}>
              <Ionicons name="arrow-back" size={18} color="#ffffff" />
              <ThemedText style={styles.cmdButtonText}>Left</ThemedText>
            </Pressable>
            <Pressable onPress={() => sendCommand("Turn Right (15°)")} style={styles.cmdButton}>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
              <ThemedText style={styles.cmdButtonText}>Right</ThemedText>
            </Pressable>
            <Pressable onPress={() => sendCommand("Sample Soil (Arm)")} style={styles.cmdButton}>
              <Ionicons name="color-filter-outline" size={18} color="#ffffff" />
              <ThemedText style={styles.cmdButtonText}>Sample</ThemedText>
            </Pressable>
          </View>

          {/* Execution Log */}
          <View style={styles.logCard}>
            <ThemedText style={styles.logHeader} type="small">ROVER TELEMETRY LOG</ThemedText>
            {history.map((line, idx) => (
              <ThemedText key={idx} style={styles.logLine} type="small">{line}</ThemedText>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────────────
   4. WHOSE LAST VIEW? NASA PHOTO QUIZ MODAL
   ───────────────────────────────────────────────────────── */
function createQuizQuestion() {
  const eligible = HEROES.filter((h) => h.gallery && h.gallery.length > 0);
  const target = eligible[Math.floor(Math.random() * eligible.length)];
  const photoName = target.gallery[Math.floor(Math.random() * target.gallery.length)];

  const others = HEROES.filter((h) => h.slug !== target.slug);
  const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
  const options = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());

  return { target, options, photoName };
}

function QuizModal({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [question, setQuestion] = useState(createQuizQuestion);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const handleSelect = (slug: string) => {
    if (selectedSlug) return;
    setSelectedSlug(slug);
    if (slug === question.target.slug) {
      haptic.success();
      setScore((s) => s + 1);
    } else {
      haptic.light();
    }
  };

  const handleNext = () => {
    haptic.light();
    setSelectedSlug(null);
    setRound((r) => r + 1);
    setQuestion(createQuizQuestion());
  };

  const photoDetail = photo(question.photoName, question.target.name);
  const imgUrl = assetUrl(`images/${question.photoName}.jpg`);

  return (
    <Modal visible animationType="slide">
      <ScrollView style={[styles.modalRoot, { paddingTop: Math.max(insets.top + 6, 16) }]} contentContainerStyle={styles.quizContent}>
        <View style={styles.modalTopBar}>
          <ThemedText style={styles.modalBadgeText} type="small">
            ROUND {round} · SCORE: {score}
          </ThemedText>
          <Pressable onPress={onClose} style={styles.modalCloseBtn}>
            <Ionicons name="close" size={20} color="#ffffff" />
          </Pressable>
        </View>

        <ThemedText style={styles.quizTitle}>Whose Last View?</ThemedText>
        <ThemedText style={styles.quizSub} type="small">
          Inspect the NASA photograph below and identify which robotic explorer captured it.
        </ThemedText>

        <View style={styles.quizPhotoContainer}>
          <Image source={{ uri: imgUrl }} style={styles.quizPhoto} contentFit="cover" transition={300} />
          <View style={styles.quizPhotoOverlay}>
            <ThemedText style={styles.quizCreditText} type="small" numberOfLines={1}>
              📷 {photoDetail.credit}
            </ThemedText>
          </View>
        </View>

        <View style={styles.quizChoices}>
          {question.options.map((opt) => {
            const isChosen = selectedSlug === opt.slug;
            const isCorrect = opt.slug === question.target.slug;

            return (
              <Pressable
                key={opt.slug}
                onPress={() => handleSelect(opt.slug)}
                disabled={Boolean(selectedSlug)}
                style={[
                  styles.choiceButton,
                  Boolean(selectedSlug && isCorrect) && styles.choiceButtonCorrect,
                  Boolean(selectedSlug && isChosen && !isCorrect) && styles.choiceButtonWrong,
                ]}
              >
                <ThemedText style={styles.choiceNameText}>{opt.name}</ThemedText>
                <ThemedText style={styles.choiceDesigText} type="small">{opt.designation}</ThemedText>
              </Pressable>
            );
          })}
        </View>

        {selectedSlug && (
          <View style={styles.quizFeedbackCard}>
            <ThemedText style={styles.feedbackVerdict}>
              {selectedSlug === question.target.slug ? "✨ Correct Identification!" : `❌ Incorrect! It was ${question.target.name}.`}
            </ThemedText>
            <ThemedText style={styles.feedbackStory} type="small">{photoDetail.title}</ThemedText>
            <Pressable onPress={handleNext} style={styles.nextQuizBtn}>
              <ThemedText style={styles.nextQuizBtnText}>Next Planetary Photo</ThemedText>
              <Ionicons name="arrow-forward" size={15} color="#ffffff" />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </Modal>
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
    gap: 16,
  },
  header: {
    gap: 6,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  beaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.violet,
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
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  journalBento: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
  },
  journalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  journalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  journalTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  journalLink: {
    color: Colors.light.violet,
    fontWeight: "700",
  },
  journalStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  journalStat: {
    flex: 1,
    alignItems: "center",
  },
  journalStatVal: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.light.violet,
    fontFamily: "monospace",
  },
  journalStatLbl: {
    color: Colors.light.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  journalStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.light.line,
  },
  gamesList: {
    gap: 16,
  },
  gameCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.light.line,
    padding: 16,
    gap: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  gameIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#070814",
    alignItems: "center",
    justifyContent: "center",
  },
  delayIcon: {
    backgroundColor: "#ea580c",
  },
  quizIcon: {
    backgroundColor: "#3b82f6",
  },
  cardMeta: {
    flex: 1,
    gap: 3,
  },
  gameTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTag: {
    color: Colors.light.violet,
    fontWeight: "800",
    letterSpacing: 1,
    fontSize: 10,
  },
  liveBadge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveBadgeText: {
    color: "#059669",
    fontWeight: "800",
    fontSize: 9,
  },
  gameCardTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  gameCardSubtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
    fontSize: 12,
  },
  playRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: Colors.light.line,
    paddingTop: 12,
  },
  playText: {
    color: Colors.light.violet,
    fontWeight: "800",
    fontSize: 13,
  },

  /* Modals Base */
  modalRoot: {
    flex: 1,
    backgroundColor: "#070814",
    padding: 16,
  },
  modalTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modalBadgeText: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontWeight: "700",
    fontSize: 11,
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planetTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  planetTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  planetTabActiveMars: {
    backgroundColor: "rgba(194, 65, 12, 0.25)",
    borderColor: "#ea580c",
  },
  planetTabActiveMoon: {
    backgroundColor: "rgba(99, 102, 241, 0.25)",
    borderColor: "#a5b4fc",
  },
  planetTabText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  planetTabTextActive: {
    color: "#ffffff",
  },
  crashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.82)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    zIndex: 999,
  },
  crashCard: {
    width: "100%",
    backgroundColor: "#0d0f1a",
    borderRadius: 24,
    borderColor: "rgba(239, 68, 68, 0.4)",
    borderWidth: 1.5,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  crashIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  crashTitle: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },
  crashReasonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  crashBtnRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8,
  },
  retryBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 14,
  },
  retryBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  orbitReturnBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 14,
  },
  orbitReturnText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "800",
  },

  /* Signal Delay Game Modal */
  delayContent: {
    paddingBottom: 40,
    gap: 12,
  },
  delayTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },
  delaySub: {
    color: "rgba(255,255,255,0.7)",
    lineHeight: 18,
  },
  delayPillsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  delayPill: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  delayPillActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  delayPillText: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "700",
  },
  delayPillTextActive: {
    color: "#ffffff",
  },
  roverGridStage: {
    height: 180,
    backgroundColor: "#03040c",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  roverPin: {
    alignItems: "center",
  },
  roverPinLabel: {
    color: "#f59e0b",
    fontWeight: "800",
  },
  queueCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 6,
  },
  queueHeaderTitle: {
    color: "#a78bfa",
    fontFamily: "monospace",
    fontWeight: "800",
  },
  emptyQueueText: {
    color: "rgba(255,255,255,0.5)",
  },
  queueItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 3,
  },
  queueActionText: {
    color: "#ffffff",
    fontSize: 13,
    flex: 1,
  },
  queueRemainingText: {
    color: "#f59e0b",
    fontFamily: "monospace",
    fontWeight: "700",
  },
  commandGrid: {
    flexDirection: "row",
    gap: 8,
  },
  cmdButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    gap: 4,
  },
  cmdButtonText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  logCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 12,
    borderRadius: 14,
    gap: 4,
  },
  logHeader: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "700",
  },
  logLine: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: "monospace",
    fontSize: 11,
  },

  /* Quiz Modal */
  quizContent: {
    paddingBottom: 40,
    gap: 12,
  },
  quizTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },
  quizSub: {
    color: "rgba(255,255,255,0.7)",
  },
  quizPhotoContainer: {
    width: "100%",
    aspectRatio: 16 / 11,
    backgroundColor: "#03040c",
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  quizPhoto: {
    width: "100%",
    height: "100%",
  },
  quizPhotoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
  },
  quizCreditText: {
    color: "rgba(255,255,255,0.8)",
  },
  quizChoices: {
    gap: 8,
  },
  choiceButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 2,
  },
  choiceButtonCorrect: {
    backgroundColor: "rgba(16, 185, 129, 0.3)",
    borderColor: "#10b981",
  },
  choiceButtonWrong: {
    backgroundColor: "rgba(239, 68, 68, 0.3)",
    borderColor: "#ef4444",
  },
  choiceNameText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  choiceDesigText: {
    color: "rgba(255,255,255,0.6)",
  },
  quizFeedbackCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 16,
    borderRadius: 18,
    gap: 8,
    marginTop: 4,
  },
  feedbackVerdict: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  feedbackStory: {
    color: "rgba(255,255,255,0.7)",
  },
  nextQuizBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.light.violet,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  nextQuizBtnText: {
    color: "#ffffff",
    fontWeight: "800",
  },
});
