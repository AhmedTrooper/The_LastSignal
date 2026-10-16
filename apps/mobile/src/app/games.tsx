import { useState, useEffect, useRef } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { HEROES, assetUrl, photo } from "@thelastsignal/data";

type GameType = "touchdown" | "delay" | "quiz" | null;

export default function GamesScreen() {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow} type="small">THE LAST SIGNAL</ThemedText>
        <ThemedText style={styles.title} type="title">Interactive Games</ThemedText>
        <ThemedText style={styles.subtitle} type="small">
          Play and experience the physics, signal latency, and historical archives of planetary exploration.
        </ThemedText>
        <Waveform seed="games" bars={36} fade={0.2} height={20} style={{ marginTop: 12 }} />
      </View>

      <View style={styles.gamesList}>
        {/* 1. Touchdown */}
        <Pressable
          onPress={() => setActiveGame("touchdown")}
          style={({ pressed }) => [styles.gameCard, pressed && styles.cardPressed]}
        >
          <View style={styles.cardTop}>
            <Image
              source={{ uri: assetUrl("images/icon-touchdown.webp") }}
              style={styles.gameIcon}
              contentFit="cover"
            />
            <View style={styles.cardMeta}>
              <ThemedText style={styles.cardTag} type="small">DESCENT SIMULATOR</ThemedText>
              <ThemedText style={styles.gameCardTitle}>Touchdown</ThemedText>
              <ThemedText style={styles.gameCardSubtitle} type="small">
                Control descent thrusters to gently land on the surface of Mars or the Moon without crashing.
              </ThemedText>
            </View>
          </View>
          <View style={styles.playRow}>
            <ThemedText style={styles.playText}>Play Simulator</ThemedText>
            <Ionicons name="play" size={16} color={Colors.light.violet} />
          </View>
        </Pressable>

        {/* 2. Drive with a Delay */}
        <Pressable
          onPress={() => setActiveGame("delay")}
          style={({ pressed }) => [styles.gameCard, pressed && styles.cardPressed]}
        >
          <View style={styles.cardTop}>
            <View style={[styles.gameIcon, styles.delayIcon]}>
              <Ionicons name="timer-outline" size={36} color="#ffffff" />
            </View>
            <View style={styles.cardMeta}>
              <ThemedText style={styles.cardTag} type="small">MISSION OPERATIONS</ThemedText>
              <ThemedText style={styles.gameCardTitle}>Drive with a delay</ThemedText>
              <ThemedText style={styles.gameCardSubtitle} type="small">
                Queue driving commands and experience the real-world radio latency across astronomical distances.
              </ThemedText>
            </View>
          </View>
          <View style={styles.playRow}>
            <ThemedText style={styles.playText}>Try Transmission Delay</ThemedText>
            <Ionicons name="play" size={16} color={Colors.light.violet} />
          </View>
        </Pressable>

        {/* 3. Whose last view? */}
        <Pressable
          onPress={() => setActiveGame("quiz")}
          style={({ pressed }) => [styles.gameCard, pressed && styles.cardPressed]}
        >
          <View style={styles.cardTop}>
            <View style={[styles.gameIcon, styles.quizIcon]}>
              <Ionicons name="camera-outline" size={36} color="#ffffff" />
            </View>
            <View style={styles.cardMeta}>
              <ThemedText style={styles.cardTag} type="small">ARCHIVE QUIZ</ThemedText>
              <ThemedText style={styles.gameCardTitle}>Whose last view?</ThemedText>
              <ThemedText style={styles.gameCardSubtitle} type="small">
                Test your knowledge of the archive: guess which machine took the credited NASA photo.
              </ThemedText>
            </View>
          </View>
          <View style={styles.playRow}>
            <ThemedText style={styles.playText}>Start Photo Quiz</ThemedText>
            <Ionicons name="play" size={16} color={Colors.light.violet} />
          </View>
        </Pressable>
      </View>

      {/* Modals for Games */}
      {activeGame === "touchdown" && (
        <TouchdownModal onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "delay" && (
        <DelayModal onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "quiz" && (
        <QuizModal onClose={() => setActiveGame(null)} />
      )}
    </ScrollView>
  );
}

/* ─────────────────────────────────────────────────────────
   1. TOUCHDOWN SIMULATOR MODAL
   ───────────────────────────────────────────────────────── */
function TouchdownModal({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [world, setWorld] = useState<"mars" | "moon">("mars");
  const [altitude, setAltitude] = useState(100);
  const [velocity, setVelocity] = useState(5.0);
  const [fuel, setFuel] = useState(100);
  const [status, setStatus] = useState<"flying" | "landed" | "crashed">("flying");
  const [isThrusting, setIsThrusting] = useState(false);
  const isThrustingRef = useRef(false);

  // Gravity: Mars = 3.7 m/s², Moon = 1.6 m/s²
  const gravity = world === "mars" ? 0.35 : 0.18;
  const thrustPower = 0.85;

  useEffect(() => {
    if (status !== "flying") return;

    const interval = setInterval(() => {
      setFuel((currFuel) => {
        const hasFuel = currFuel > 0;
        const thrusting = isThrustingRef.current && hasFuel;
        const newFuel = thrusting ? Math.max(0, currFuel - 1.2) : currFuel;

        setVelocity((prevVel) => {
          const accel = gravity - (thrusting ? thrustPower : 0);
          return Math.min(25, prevVel + accel);
        });

        setAltitude((prevAlt) => {
          setVelocity((currentVel) => {
            const nextAlt = prevAlt - currentVel * 0.4;
            if (nextAlt <= 0) {
              if (currentVel <= 4.0) {
                setStatus("landed");
              } else {
                setStatus("crashed");
              }
              return 0;
            }
            return nextAlt;
          });
          return Math.max(0, prevAlt - velocity * 0.4);
        });

        return newFuel;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [status, gravity, velocity]);

  const handleReset = () => {
    setAltitude(100);
    setVelocity(5.0);
    setFuel(100);
    setStatus("flying");
    setIsThrusting(false);
    isThrustingRef.current = false;
  };

  const landerYPercent = Math.min(85, Math.max(10, 85 - (altitude / 100) * 75));

  return (
    <Modal visible animationType="slide">
      <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top, 16) }]}>
        {/* Top Header */}
        <View style={styles.modalHeader}>
          <View>
            <ThemedText style={styles.modalTitle}>Touchdown Simulator</ThemedText>
            <ThemedText style={styles.modalSub} type="small">
              {world === "mars" ? "Mars (3.7 m/s² gravity)" : "Moon (1.6 m/s² gravity)"}
            </ThemedText>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </Pressable>
        </View>

        {/* World Switcher */}
        <View style={styles.worldToggleRow}>
          <Pressable
            onPress={() => { setWorld("mars"); handleReset(); }}
            style={[styles.worldPill, world === "mars" && styles.worldPillActive]}
          >
            <ThemedText style={[styles.worldPillText, world === "mars" && styles.worldPillTextActive]}>
              Mars
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => { setWorld("moon"); handleReset(); }}
            style={[styles.worldPill, world === "moon" && styles.worldPillActive]}
          >
            <ThemedText style={[styles.worldPillText, world === "moon" && styles.worldPillTextActive]}>
              Moon
            </ThemedText>
          </Pressable>
        </View>

        {/* Telemetry Dashboard */}
        <View style={styles.telemetryRow}>
          <View style={styles.telemetryBox}>
            <ThemedText style={styles.telemetryLabel} type="small">ALTITUDE</ThemedText>
            <ThemedText style={styles.telemetryValue}>{Math.round(altitude)} m</ThemedText>
          </View>
          <View style={styles.telemetryBox}>
            <ThemedText style={styles.telemetryLabel} type="small">DESCENT SPEED</ThemedText>
            <ThemedText
              style={[
                styles.telemetryValue,
                velocity > 4.0 ? styles.speedWarning : styles.speedSafe,
              ]}
            >
              {velocity.toFixed(1)} m/s
            </ThemedText>
          </View>
          <View style={styles.telemetryBox}>
            <ThemedText style={styles.telemetryLabel} type="small">FUEL</ThemedText>
            <ThemedText style={styles.telemetryValue}>{Math.round(fuel)}%</ThemedText>
          </View>
        </View>

        {/* Flight Stage Display */}
        <View style={styles.flightStage}>
          {/* Surface */}
          <View style={[styles.groundSurface, world === "mars" ? styles.marsGround : styles.moonGround]}>
            <ThemedText style={styles.groundLabel} type="small">
              Touchdown Zone · Target Velocity &lt; 4.0 m/s
            </ThemedText>
          </View>

          {/* Lander */}
          <View style={[styles.lander, { top: `${landerYPercent}%` }]}>
            <Ionicons name="rocket" size={38} color="#ffffff" />
            {isThrusting && fuel > 0 && status === "flying" && (
              <View style={styles.exhaustFlame}>
                <Ionicons name="flame" size={24} color="#f59e0b" />
              </View>
            )}
          </View>

          {/* Status Overlay */}
          {status !== "flying" && (
            <View style={styles.resultOverlay}>
              <ThemedText style={status === "landed" ? styles.successTitle : styles.crashTitle} type="title">
                {status === "landed" ? "🎉 TOUCHDOWN SUCCESSFUL!" : "💥 HARD IMPACT / CRASH"}
              </ThemedText>
              <ThemedText style={styles.resultDesc} type="small">
                {status === "landed"
                  ? `Safe landing on ${world === "mars" ? "Mars" : "the Moon"}! You have joined the memorial fleet.`
                  : "Touchdown speed was too high for landing legs to survive."}
              </ThemedText>
              <Pressable onPress={handleReset} style={styles.restartBtn}>
                <ThemedText style={styles.restartBtnText}>Try Again</ThemedText>
              </Pressable>
            </View>
          )}
        </View>

        {/* Flight Controls */}
        <View style={[styles.controlsArea, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <Pressable
            onPressIn={() => {
              isThrustingRef.current = true;
              setIsThrusting(true);
            }}
            onPressOut={() => {
              isThrustingRef.current = false;
              setIsThrusting(false);
            }}
            disabled={status !== "flying" || fuel <= 0}
            style={({ pressed }) => [
              styles.thrustBtn,
              pressed && styles.thrustBtnPressed,
              (status !== "flying" || fuel <= 0) && styles.thrustBtnDisabled,
            ]}
          >
            <Ionicons name="flash" size={24} color="#ffffff" />
            <ThemedText style={styles.thrustBtnText}>HOLD FOR THRUST</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────────────
   2. DRIVE WITH A DELAY MODAL
   ───────────────────────────────────────────────────────── */
function DelayModal({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [delaySec, setDelaySec] = useState(3);
  const [queue, setQueue] = useState<{ id: number; action: string; remaining: number }[]>([]);
  const [history, setHistory] = useState<string[]>(["Rover booted in Jezero Crater."]);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setQueue((prevQueue) => {
        if (prevQueue.length === 0) return prevQueue;
        const nextQueue = prevQueue.map((item) => ({ ...item, remaining: item.remaining - 0.2 }));
        const finished = nextQueue.filter((item) => item.remaining <= 0);

        finished.forEach((item) => {
          setHistory((h) => [`[+${delaySec}s latency] Executed: ${item.action}`, ...h.slice(0, 8)]);
          if (item.action.includes("Forward")) setPos((p) => ({ ...p, y: p.y - 10 }));
          if (item.action.includes("Left")) setPos((p) => ({ ...p, x: p.x - 10 }));
          if (item.action.includes("Right")) setPos((p) => ({ ...p, x: p.x + 10 }));
        });

        return nextQueue.filter((item) => item.remaining > 0);
      });
    }, 200);

    return () => clearInterval(timer);
  }, [delaySec]);

  const sendCommand = (cmd: string) => {
    setQueue((q) => [...q, { id: Date.now() + Math.random(), action: cmd, remaining: delaySec }]);
  };

  return (
    <Modal visible animationType="slide">
      <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.modalHeader}>
          <View>
            <ThemedText style={styles.modalTitle}>Signal Delay Simulator</ThemedText>
            <ThemedText style={styles.modalSub} type="small">Planetary radio latency in action</ThemedText>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </Pressable>
        </View>

        {/* Latency Presets */}
        <View style={styles.worldToggleRow}>
          {[2, 4, 8].map((sec) => (
            <Pressable
              key={sec}
              onPress={() => setDelaySec(sec)}
              style={[styles.worldPill, delaySec === sec && styles.worldPillActive]}
            >
              <ThemedText style={[styles.worldPillText, delaySec === sec && styles.worldPillTextActive]}>
                {sec}s delay
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Rover Grid */}
        <View style={styles.roverGrid}>
          <View style={[styles.roverPin, { transform: [{ translateX: pos.x }, { translateY: pos.y }] }]}>
            <Ionicons name="navigate" size={28} color="#f59e0b" />
            <ThemedText style={styles.roverLabel} type="small">Rover</ThemedText>
          </View>
        </View>

        {/* In-Transit Signals Queue */}
        <View style={styles.queueContainer}>
          <ThemedText style={styles.queueHeader} type="small">RADIO PACKETS IN TRANSIT ({queue.length})</ThemedText>
          {queue.length === 0 ? (
            <ThemedText style={styles.emptyQueue} type="small">All commands received by machine.</ThemedText>
          ) : (
            queue.map((item) => (
              <View key={item.id} style={styles.queueItem}>
                <Ionicons name="radio" size={16} color={Colors.light.violet} />
                <ThemedText style={styles.queueText}>{item.action}</ThemedText>
                <ThemedText style={styles.queueCountdown} type="small">
                  {Math.max(0, item.remaining).toFixed(1)}s
                </ThemedText>
              </View>
            ))
          )}
        </View>

        {/* Command Buttons */}
        <View style={styles.commandButtonsGrid}>
          <Pressable onPress={() => sendCommand("Drive Forward (1m)")} style={styles.cmdBtn}>
            <Ionicons name="arrow-up" size={18} color="#ffffff" />
            <ThemedText style={styles.cmdBtnText}>Forward</ThemedText>
          </Pressable>
          <Pressable onPress={() => sendCommand("Turn Left (15°)")} style={styles.cmdBtn}>
            <Ionicons name="arrow-back" size={18} color="#ffffff" />
            <ThemedText style={styles.cmdBtnText}>Left</ThemedText>
          </Pressable>
          <Pressable onPress={() => sendCommand("Turn Right (15°)")} style={styles.cmdBtn}>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            <ThemedText style={styles.cmdBtnText}>Right</ThemedText>
          </Pressable>
          <Pressable onPress={() => sendCommand("Sample Soil (IDD Arm)")} style={styles.cmdBtn}>
            <Ionicons name="color-filter-outline" size={18} color="#ffffff" />
            <ThemedText style={styles.cmdBtnText}>Sample</ThemedText>
          </Pressable>
        </View>

        {/* Execution Log */}
        <ScrollView style={styles.historyBox}>
          {history.map((line, idx) => (
            <ThemedText key={idx} style={styles.historyLine} type="small">
              {line}
            </ThemedText>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

function createQuizQuestion() {
  const eligible = HEROES.filter((h) => h.gallery && h.gallery.length > 0);
  const target = eligible[Math.floor(Math.random() * eligible.length)];
  const photoName = target.gallery[Math.floor(Math.random() * target.gallery.length)];

  const others = HEROES.filter((h) => h.slug !== target.slug);
  const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
  const options = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());

  return { target, options, photoName };
}

/* ─────────────────────────────────────────────────────────
   3. WHOSE LAST VIEW QUIZ MODAL
   ───────────────────────────────────────────────────────── */
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
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedSlug(null);
    setRound((r) => r + 1);
    setQuestion(createQuizQuestion());
  };

  const photoDetail = photo(question.photoName, question.target.name);
  const imgUrl = assetUrl(`images/${question.photoName}.jpg`);

  return (
    <Modal visible animationType="slide">
      <ScrollView style={[styles.modalContainer, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.modalHeader}>
          <View>
            <ThemedText style={styles.modalTitle}>Whose last view?</ThemedText>
            <ThemedText style={styles.modalSub} type="small">
              Score: {score} · Round: {round}
            </ThemedText>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </Pressable>
        </View>

        {/* Photo Container */}
        <View style={styles.quizPhotoWrap}>
          <Image source={{ uri: imgUrl }} style={styles.quizPhoto} contentFit="cover" />
          <View style={styles.quizPhotoCaption}>
            <ThemedText style={styles.quizCredit} type="small" numberOfLines={1}>
              {photoDetail.credit}
            </ThemedText>
          </View>
        </View>

        {/* Prompt */}
        <ThemedText style={styles.quizPrompt}>
          Which machine captured this photograph?
        </ThemedText>

        {/* 4 Choices */}
        <View style={styles.choicesList}>
          {question.options.map((opt) => {
            const isChosen = selectedSlug === opt.slug;
            const isCorrect = opt.slug === question.target.slug;

            return (
              <Pressable
                key={opt.slug}
                onPress={() => handleSelect(opt.slug)}
                disabled={Boolean(selectedSlug)}
                style={[
                  styles.choiceBtn,
                  Boolean(selectedSlug && isCorrect) && styles.choiceCorrect,
                  Boolean(selectedSlug && isChosen && !isCorrect) && styles.choiceWrong,
                ]}
              >
                <ThemedText style={styles.choiceText}>{opt.name}</ThemedText>
                <ThemedText style={styles.choiceSub} type="small">{opt.designation}</ThemedText>
              </Pressable>
            );
          })}
        </View>

        {selectedSlug && (
          <View style={styles.quizNextWrap}>
            <ThemedText style={styles.quizFeedback} type="small">
              {selectedSlug === question.target.slug ? "✨ Correct!" : `❌ Incorrect! It was ${question.target.name}.`}
            </ThemedText>
            <Pressable onPress={handleNext} style={styles.nextQuestionBtn}>
              <ThemedText style={styles.nextQuestionText}>Next Photo</ThemedText>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
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
    marginBottom: 8,
    gap: 4,
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
  gamesList: {
    gap: 16,
  },
  gameCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
    padding: 16,
    gap: 14,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardTop: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  gameIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#0c0a22",
    alignItems: "center",
    justifyContent: "center",
  },
  delayIcon: {
    backgroundColor: "#f59e0b",
  },
  quizIcon: {
    backgroundColor: "#3b82f6",
  },
  cardMeta: {
    flex: 1,
    gap: 2,
  },
  cardTag: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1,
  },
  gameCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.light.text,
  },
  gameCardSubtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
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
    fontWeight: "700",
  },

  /* Modals */
  modalContainer: {
    flex: 1,
    backgroundColor: "#0c0a22",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
  },
  modalSub: {
    color: "rgba(255,255,255,0.6)",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  worldToggleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  worldPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  worldPillActive: {
    backgroundColor: Colors.light.violet,
  },
  worldPillText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  worldPillTextActive: {
    fontWeight: "700",
  },
  telemetryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  telemetryBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  telemetryLabel: {
    color: "rgba(255,255,255,0.5)",
    fontWeight: "700",
    letterSpacing: 1,
  },
  telemetryValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
    marginTop: 2,
  },
  speedSafe: {
    color: "#10b981",
  },
  speedWarning: {
    color: "#ef4444",
  },
  flightStage: {
    flex: 1,
    backgroundColor: "#050410",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  groundSurface: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  marsGround: {
    backgroundColor: "#b91c1c",
  },
  moonGround: {
    backgroundColor: "#4b5563",
  },
  groundLabel: {
    color: "#ffffff",
    fontWeight: "700",
  },
  lander: {
    position: "absolute",
    left: "45%",
    alignItems: "center",
  },
  exhaustFlame: {
    position: "absolute",
    top: 32,
  },
  resultOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  successTitle: {
    color: "#10b981",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  crashTitle: {
    color: "#ef4444",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  resultDesc: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 18,
  },
  restartBtn: {
    marginTop: 8,
    backgroundColor: Colors.light.violet,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  restartBtnText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  controlsArea: {
    paddingTop: 14,
  },
  thrustBtn: {
    backgroundColor: "#8b5cf6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 24,
    gap: 8,
  },
  thrustBtnPressed: {
    backgroundColor: "#7c3aed",
    transform: [{ scale: 0.98 }],
  },
  thrustBtnDisabled: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  thrustBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    letterSpacing: 1,
  },

  /* Drive Delay */
  roverGrid: {
    height: 180,
    backgroundColor: "#7f1d1d",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 12,
  },
  roverPin: {
    alignItems: "center",
  },
  roverLabel: {
    color: "#ffffff",
    fontWeight: "700",
  },
  queueContainer: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  queueHeader: {
    color: "rgba(255,255,255,0.6)",
    fontWeight: "700",
  },
  emptyQueue: {
    color: "rgba(255,255,255,0.4)",
    fontStyle: "italic",
  },
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 8,
    borderRadius: 8,
  },
  queueText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    marginLeft: 8,
  },
  queueCountdown: {
    color: "#f59e0b",
    fontWeight: "700",
  },
  commandButtonsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  cmdBtn: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  cmdBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  historyBox: {
    maxHeight: 120,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    padding: 10,
  },
  historyLine: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    marginBottom: 4,
  },

  /* Quiz */
  quizPhotoWrap: {
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
    position: "relative",
  },
  quizPhoto: {
    width: "100%",
    height: "100%",
  },
  quizPhotoCaption: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
  },
  quizCredit: {
    color: "#ffffff",
  },
  quizPrompt: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    textAlign: "center",
  },
  choicesList: {
    gap: 10,
    marginBottom: 16,
  },
  choiceBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  choiceCorrect: {
    backgroundColor: "rgba(16,185,129,0.25)",
    borderColor: "#10b981",
  },
  choiceWrong: {
    backgroundColor: "rgba(239,68,68,0.25)",
    borderColor: "#ef4444",
  },
  choiceText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  choiceSub: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  quizNextWrap: {
    alignItems: "center",
    gap: 12,
    marginBottom: 30,
  },
  quizFeedback: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  nextQuestionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.violet,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  nextQuestionText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
