import { useState, useEffect, useRef } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
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
import { haptic } from "@/utils/haptics";
import {
  HEROES,
  fmtCoords,
  fmtLong,
  portrait,
  photo,
  assetUrl,
  type Hero,
} from "@thelastsignal/data";
import { useGameStore } from "@/stores/use-game-store";
import { BRIEF, RADIO } from "@/features/games/data/touchdown-story";

type ActiveGame = "touchdown" | "delay" | "quiz" | null;
type TouchdownPhase = "briefing" | "descent" | "surface" | "found" | "crashed";

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
        <JournalModal onClose={() => setShowJournal(false)} />
      )}
    </ScrollView>
  );
}

/* ─────────────────────────────────────────────────────────
   1. FULL TOUCHDOWN PILGRIMAGE GAME MODAL
   ───────────────────────────────────────────────────────── */
function TouchdownGameModal({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { recordLanding, recordCrash, recordFound, lightBeacon, getSiteProgress } = useGameStore();

  const [phase, setPhase] = useState<TouchdownPhase>("briefing");
  const [selectedHero, setSelectedHero] = useState<Hero>(HEROES[9]); // Opportunity default
  const isMars = selectedHero.body === "mars";

  // Descent physics state
  const [altitude, setAltitude] = useState(250);
  const [velocity, setVelocity] = useState(6.0);
  const [drift, setDrift] = useState(1.2);
  const [fuel, setFuel] = useState(100);
  const [radioMsg, setRadioMsg] = useState(RADIO.control);
  const [isThrusting, setIsThrusting] = useState(false);
  const thrustRef = useRef(false);

  // Surface pilgrimage state
  const [roverPos, setRoverPos] = useState({ x: 0, y: 0 });
  const [echoesFound, setEchoesFound] = useState<number[]>([]);
  const targetDistance = Math.max(0, Math.round(180 - Math.hypot(roverPos.x, roverPos.y) * 4));

  const progress = getSiteProgress(selectedHero.slug);
  const briefingLines = BRIEF[selectedHero.slug] ?? [selectedHero.summary];

  // Gravity: Mars = 3.7 m/s² -> scaled; Moon = 1.6 m/s² -> scaled
  const gravity = isMars ? 0.42 : 0.22;
  const mainThrust = 0.95;

  // Descent loop
  useEffect(() => {
    if (phase !== "descent") return;

    const interval = setInterval(() => {
      setFuel((currFuel) => {
        const hasFuel = currFuel > 0;
        const firing = thrustRef.current && hasFuel;
        const nextFuel = firing ? Math.max(0, currFuel - 1.1) : currFuel;

        if (nextFuel <= 20 && currFuel > 20) setRadioMsg(RADIO.fuel);
        if (nextFuel <= 0 && currFuel > 0) setRadioMsg(RADIO.fuelOut);

        setVelocity((prevVel) => {
          const accel = gravity - (firing ? mainThrust : 0);
          const nextVel = Math.min(28, prevVel + accel);
          if (nextVel > 8 && prevVel <= 8) setRadioMsg(RADIO.fast);
          return nextVel;
        });

        setDrift((prevDrift) => {
          return prevDrift * 0.98 + (Math.random() - 0.5) * 0.15;
        });

        setAltitude((prevAlt) => {
          setVelocity((v) => {
            const nextAlt = prevAlt - v * 0.5;
            if (nextAlt <= 0) {
              if (v <= 3.8 && Math.abs(drift) <= 2.5) {
                haptic.success();
                recordLanding(selectedHero.slug, true);
                setRadioMsg(v <= 2.2 ? RADIO.landed : RADIO.landedHard);
                setPhase("surface");
              } else {
                haptic.light();
                recordCrash(selectedHero.slug);
                setRadioMsg(RADIO.crashed);
                setPhase("crashed");
              }
              return 0;
            }
            return nextAlt;
          });
          return Math.max(0, prevAlt - velocity * 0.5);
        });

        return nextFuel;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [phase, gravity, velocity, drift, isMars, selectedHero, recordLanding, recordCrash]);

  const startDescent = () => {
    haptic.selection();
    setAltitude(250);
    setVelocity(6.0);
    setDrift(0.8);
    setFuel(100);
    setRadioMsg(RADIO.chute);
    setIsThrusting(false);
    thrustRef.current = false;
    setRoverPos({ x: 0, y: 0 });
    setEchoesFound([]);
    setPhase("descent");
  };

  const handleDrive = (dx: number, dy: number) => {
    haptic.light();
    setRoverPos((prev) => {
      const nextX = prev.x + dx;
      const nextY = prev.y + dy;

      // Echo pickups
      const dist = Math.hypot(nextX, nextY);
      if (dist >= 15 && !echoesFound.includes(1)) {
        setEchoesFound((e) => [...e, 1]);
        setRadioMsg(RADIO.echo);
      }
      if (dist >= 30 && !echoesFound.includes(2)) {
        setEchoesFound((e) => [...e, 2]);
        setRadioMsg(RADIO.echo);
      }
      if (dist >= 42 && !echoesFound.includes(3)) {
        setEchoesFound((e) => [...e, 3]);
        setRadioMsg(RADIO.echo);
      }

      // Check arrival at machine (within target range)
      if (180 - dist * 4 <= 15) {
        haptic.success();
        recordFound(selectedHero.slug, echoesFound.length);
        setRadioMsg(RADIO.arriveMachine);
        setPhase("found");
      }

      return { x: nextX, y: nextY };
    });
  };

  const handleLightBeacon = () => {
    haptic.success();
    lightBeacon(selectedHero.slug);
    setRadioMsg(RADIO.beaconLit);
  };

  const landerYPct = Math.min(85, Math.max(8, 85 - (altitude / 250) * 77));

  return (
    <Modal visible animationType="slide">
      <View style={[styles.modalRoot, { paddingTop: Math.max(insets.top + 6, 16) }]}>
        {/* Top Header */}
        <View style={styles.modalTopBar}>
          <View style={styles.topBarLeft}>
            <View style={styles.beaconDot} />
            <ThemedText style={styles.modalBadgeText} type="small">
              TOUCHDOWN MISSION · {selectedHero.name.toUpperCase()}
            </ThemedText>
          </View>
          <Pressable onPress={onClose} style={styles.modalCloseBtn}>
            <Ionicons name="close" size={20} color="#ffffff" />
          </Pressable>
        </View>

        {/* 1. BRIEFING PHASE */}
        {phase === "briefing" && (
          <ScrollView contentContainerStyle={styles.briefingContent} showsVerticalScrollIndicator={false}>
            <ThemedText style={styles.briefingEyebrow} type="small">
              MISSION BRIEFING FROM GROUND
            </ThemedText>
            <ThemedText style={styles.briefingTitle}>
              Pilgrimage to {selectedHero.name}
            </ThemedText>
            <ThemedText style={styles.briefingCoords} type="small">
              📍 {selectedHero.restingPlace} ({fmtCoords(selectedHero.coords)})
            </ThemedText>

            {/* Ground Audio Terminal */}
            <View style={styles.briefingBox}>
              <View style={styles.groundBadge}>
                <Ionicons name="radio" size={13} color={Colors.light.violet} />
                <ThemedText style={styles.groundBadgeText} type="small">GROUND CONTROL TRANSMISSION</ThemedText>
              </View>
              {briefingLines.map((line, idx) => (
                <ThemedText key={idx} style={styles.briefingLine}>
                  &ldquo;{line}&rdquo;
                </ThemedText>
              ))}
            </View>

            {/* Target Machine Selection Row */}
            <ThemedText style={styles.selectorHeader} type="small">
              CHOOSE DESTINATION MACHINE ({HEROES.length})
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.heroSelectorRow}>
              {HEROES.map((h) => {
                const isTarget = h.slug === selectedHero.slug;
                const p = getSiteProgress(h.slug);
                return (
                  <Pressable
                    key={h.slug}
                    onPress={() => {
                      haptic.light();
                      setSelectedHero(h);
                    }}
                    style={[styles.heroSelectPill, isTarget && styles.heroSelectPillActive]}
                  >
                    <Image
                      source={{ uri: assetUrl(`images/${portrait(h)}.jpg`) }}
                      style={styles.heroSelectAvatar}
                    />
                    <ThemedText style={[styles.heroSelectText, isTarget && styles.heroSelectTextActive]} type="small">
                      {h.name}
                    </ThemedText>
                    {p.light && <Ionicons name="sparkles" size={12} color="#f59e0b" />}
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              onPress={startDescent}
              style={styles.launchMissionBtn}
            >
              <Ionicons name="rocket-outline" size={18} color="#ffffff" />
              <ThemedText style={styles.launchMissionBtnText}>
                Initiate Descent Sequence
              </ThemedText>
            </Pressable>
          </ScrollView>
        )}

        {/* 2. DESCENT FLIGHT SIMULATION PHASE */}
        {phase === "descent" && (
          <View style={styles.descentContainer}>
            {/* Real-time Telemetry HUD */}
            <View style={styles.telemetryHUD}>
              <View style={styles.hudCol}>
                <ThemedText style={styles.hudLabel} type="small">ALTITUDE</ThemedText>
                <ThemedText style={styles.hudValue}>{Math.round(altitude)} m</ThemedText>
              </View>
              <View style={styles.hudCol}>
                <ThemedText style={styles.hudLabel} type="small">DESCENT SPEED</ThemedText>
                <ThemedText
                  style={[
                    styles.hudValue,
                    velocity <= 3.8 ? styles.speedSafe : velocity <= 7.0 ? styles.speedCaution : styles.speedDanger,
                  ]}
                >
                  {velocity.toFixed(1)} m/s
                </ThemedText>
              </View>
              <View style={styles.hudCol}>
                <ThemedText style={styles.hudLabel} type="small">DRIFT</ThemedText>
                <ThemedText style={styles.hudValue}>{drift.toFixed(1)} m/s</ThemedText>
              </View>
              <View style={styles.hudCol}>
                <ThemedText style={styles.hudLabel} type="small">FUEL</ThemedText>
                <ThemedText style={[styles.hudValue, fuel <= 25 && styles.speedDanger]}>
                  {Math.round(fuel)}%
                </ThemedText>
              </View>
            </View>

            {/* Radio Chatter Banner */}
            <View style={styles.radioBar}>
              <Ionicons name="radio" size={14} color="#a78bfa" />
              <ThemedText style={styles.radioText} numberOfLines={1} type="small">
                Ground: &ldquo;{radioMsg}&rdquo;
              </ThemedText>
            </View>

            {/* Descent Sky Stage */}
            <View style={styles.skyStage}>
              {/* Planetary Surface */}
              <View style={[styles.surfaceGround, isMars ? styles.marsSurface : styles.moonSurface]}>
                <ThemedText style={styles.targetZoneText} type="small">
                  TARGET TOUCHDOWN ZONE · {selectedHero.name.toUpperCase()} RECOVERY
                </ThemedText>
              </View>

              {/* Descending Lander */}
              <View style={[styles.landerCraft, { top: `${landerYPct}%` }]}>
                <Ionicons name="rocket" size={36} color="#ffffff" />
                {isThrusting && fuel > 0 && (
                  <View style={styles.flameExhaust}>
                    <Ionicons name="flame" size={24} color="#f59e0b" />
                  </View>
                )}
              </View>
            </View>

            {/* Retro Thruster Controls */}
            <View style={[styles.thrusterControlArea, { paddingBottom: Math.max(insets.bottom + 12, 20) }]}>
              <Pressable
                onPressIn={() => {
                  thrustRef.current = true;
                  setIsThrusting(true);
                  haptic.light();
                }}
                onPressOut={() => {
                  thrustRef.current = false;
                  setIsThrusting(false);
                }}
                disabled={fuel <= 0}
                style={({ pressed }) => [
                  styles.thrustHoldBtn,
                  pressed && styles.thrustHoldBtnActive,
                  fuel <= 0 && styles.thrustDisabled,
                ]}
              >
                <Ionicons name="flame" size={26} color="#ffffff" />
                <ThemedText style={styles.thrustHoldText}>
                  HOLD MAIN RETRO-THRUSTER
                </ThemedText>
              </Pressable>
            </View>
          </View>
        )}

        {/* 3. SURFACE ROVER PILGRIMAGE PHASE */}
        {phase === "surface" && (
          <View style={styles.surfaceContainer}>
            {/* Top Compass & Distance Radar */}
            <View style={styles.compassRadarCard}>
              <View style={styles.compassHeader}>
                <Ionicons name="navigate-circle" size={20} color={Colors.light.violet} />
                <ThemedText style={styles.compassTitle}>SURFACE BEACON COMPASS</ThemedText>
                <ThemedText style={styles.compassDistance}>{targetDistance} m to {selectedHero.name}</ThemedText>
              </View>
              <ThemedText style={styles.echoesCountText} type="small">
                Telemetry Echoes Recovered: {echoesFound.length}/3
              </ThemedText>
            </View>

            {/* Radio Transmission */}
            <View style={styles.radioBar}>
              <Ionicons name="radio" size={14} color="#a78bfa" />
              <ThemedText style={styles.radioText} numberOfLines={1} type="small">
                Ground: &ldquo;{radioMsg}&rdquo;
              </ThemedText>
            </View>

            {/* Surface Traversal Map */}
            <View style={styles.surfaceGridStage}>
              <View style={styles.targetSitePin}>
                <View style={styles.beaconRing} />
                <Ionicons name="location" size={24} color="#f59e0b" />
                <ThemedText style={styles.pinLabel} type="small">{selectedHero.name}</ThemedText>
              </View>

              {/* Player Rover Pin */}
              <View style={[styles.playerRover, { transform: [{ translateX: roverPos.x * 3 }, { translateY: roverPos.y * 3 }] }]}>
                <Ionicons name="navigate" size={24} color="#ffffff" />
                <ThemedText style={styles.roverTag} type="small">Lander Rover</ThemedText>
              </View>
            </View>

            {/* D-Pad Driving Controls */}
            <View style={[styles.dpadControls, { paddingBottom: Math.max(insets.bottom + 10, 20) }]}>
              <View style={styles.dpadRow}>
                <Pressable onPress={() => handleDrive(0, -3)} style={styles.dpadBtn}>
                  <Ionicons name="chevron-up" size={26} color="#ffffff" />
                </Pressable>
              </View>
              <View style={styles.dpadRowMiddle}>
                <Pressable onPress={() => handleDrive(-3, 0)} style={styles.dpadBtn}>
                  <Ionicons name="chevron-back" size={26} color="#ffffff" />
                </Pressable>
                <View style={styles.dpadCenter}>
                  <ThemedText style={styles.dpadCenterText} type="small">DRIVE</ThemedText>
                </View>
                <Pressable onPress={() => handleDrive(3, 0)} style={styles.dpadBtn}>
                  <Ionicons name="chevron-forward" size={26} color="#ffffff" />
                </Pressable>
              </View>
              <View style={styles.dpadRow}>
                <Pressable onPress={() => handleDrive(0, 3)} style={styles.dpadBtn}>
                  <Ionicons name="chevron-down" size={26} color="#ffffff" />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* 4. DISCOVERY & MEMORIAL BEACON PHASE */}
        {phase === "found" && (
          <ScrollView contentContainerStyle={styles.foundContent} showsVerticalScrollIndicator={false}>
            <View style={styles.foundBadge}>
              <Ionicons name="sparkles" size={16} color="#f59e0b" />
              <ThemedText style={styles.foundBadgeText} type="small">
                RESTING SITE DISCOVERED
              </ThemedText>
            </View>

            <Image
              source={{ uri: assetUrl(`images/${portrait(selectedHero)}.jpg`) }}
              style={styles.foundImage}
              contentFit="cover"
            />

            <ThemedText style={styles.foundHeroName}>{selectedHero.name}</ThemedText>
            <ThemedText style={styles.foundCoords} type="small">
              📍 {selectedHero.restingPlace} ({fmtCoords(selectedHero.coords)})
            </ThemedText>

            <View style={styles.finalWordsCard}>
              <ThemedText style={styles.finalWordsLabel} type="small">FINAL LOSS OF SIGNAL RECORD</ThemedText>
              <ThemedText style={styles.finalWordsStory}>
                &ldquo;{selectedHero.end.story}&rdquo;
              </ThemedText>
              <ThemedText style={styles.finalWordsDate} type="small">
                {selectedHero.end.label}: {fmtLong(selectedHero.end.date)}
              </ThemedText>
            </View>

            {!progress.light ? (
              <Pressable
                onPress={handleLightBeacon}
                style={styles.lightBeaconBtn}
              >
                <Ionicons name="flame" size={20} color="#070814" />
                <ThemedText style={styles.lightBeaconBtnText}>
                  Ignite Eternal Memorial Beacon
                </ThemedText>
              </Pressable>
            ) : (
              <View style={styles.beaconLitCard}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <ThemedText style={styles.beaconLitText}>
                  Memorial Beacon Is Shining Across Space
                </ThemedText>
              </View>
            )}

            <Pressable
              onPress={() => setPhase("briefing")}
              style={styles.nextMissionBtn}
            >
              <ThemedText style={styles.nextMissionBtnText}>
                Select Next Explorer Mission
              </ThemedText>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </Pressable>
          </ScrollView>
        )}

        {/* 5. HARD IMPACT / CRASH OVERLAY */}
        {phase === "crashed" && (
          <View style={styles.crashOverlay}>
            <Ionicons name="warning" size={48} color="#ef4444" />
            <ThemedText style={styles.crashTitle}>Hard Impact Detected</ThemedText>
            <ThemedText style={styles.crashText}>
              Descent velocity exceeded landing strut tolerance (&gt; 3.8 m/s). Maintain retro-thrust closer to touchdown.
            </ThemedText>
            <Pressable onPress={startDescent} style={styles.retryBtn}>
              <ThemedText style={styles.retryBtnText}>Retry Descent</ThemedText>
            </Pressable>
            <Pressable onPress={() => setPhase("briefing")} style={styles.abortBtn}>
              <ThemedText style={styles.abortBtnText}>Return to Briefing</ThemedText>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────────────
   2. PILOT LOG & JOURNAL MODAL
   ───────────────────────────────────────────────────────── */
function JournalModal({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { sites, landings } = useGameStore();

  return (
    <Modal visible animationType="slide">
      <View style={[styles.modalRoot, { paddingTop: Math.max(insets.top + 6, 16) }]}>
        <View style={styles.modalTopBar}>
          <ThemedText style={styles.modalBadgeText} type="small">PILOT FLIGHT LOG &amp; JOURNAL</ThemedText>
          <Pressable onPress={onClose} style={styles.modalCloseBtn}>
            <Ionicons name="close" size={20} color="#ffffff" />
          </Pressable>
        </View>

        <FlatList
          data={HEROES}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={styles.journalList}
          renderItem={({ item }) => {
            const p = sites[item.slug];
            const isLanded = p?.landed;
            const isFound = p?.found;
            const isLit = p?.light;

            return (
              <View style={styles.journalItemCard}>
                <Image
                  source={{ uri: assetUrl(`images/${portrait(item)}.jpg`) }}
                  style={styles.journalAvatar}
                />
                <View style={styles.journalItemInfo}>
                  <ThemedText style={styles.journalItemName}>{item.name}</ThemedText>
                  <ThemedText style={styles.journalItemPlace} type="small">{item.restingPlace}</ThemedText>
                </View>
                <View style={styles.journalBadgesCol}>
                  <View style={[styles.jBadge, isLanded && styles.jBadgeActive]}>
                    <ThemedText style={styles.jBadgeText} type="small">
                      {isLanded ? "TOUCHDOWN" : "UNEXPLORED"}
                    </ThemedText>
                  </View>
                  {isFound && (
                    <View style={styles.beaconLitBadge}>
                      <Ionicons name="hardware-chip-outline" size={11} color="#60a5fa" />
                      <ThemedText style={[styles.beaconLitBadgeText, { color: "#60a5fa" }]} type="small">LOCATED</ThemedText>
                    </View>
                  )}
                  {isLit && (
                    <View style={styles.beaconLitBadge}>
                      <Ionicons name="sparkles" size={11} color="#f59e0b" />
                      <ThemedText style={styles.beaconLitBadgeText} type="small">LIT</ThemedText>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
          ListHeaderComponent={
            <View style={styles.journalHeaderSection}>
              <ThemedText style={styles.journalHeadline}>
                Planetary Landing Records
              </ThemedText>
              <ThemedText style={styles.journalSub} type="small">
                Historical pilgrimage log of robotic explorers on Mars and the Moon • {landings} touchdowns logged.
              </ThemedText>
            </View>
          }
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

  /* Touchdown Briefing Phase */
  briefingContent: {
    paddingBottom: 40,
    gap: 12,
  },
  briefingEyebrow: {
    color: "#a78bfa",
    fontFamily: "monospace",
    fontWeight: "800",
    letterSpacing: 1,
  },
  briefingTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
  },
  briefingCoords: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: "monospace",
  },
  briefingBox: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 10,
    marginTop: 6,
  },
  groundBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  groundBadgeText: {
    color: Colors.light.violet,
    fontWeight: "800",
    letterSpacing: 0.5,
    fontSize: 10,
  },
  briefingLine: {
    color: "#ffffff",
    fontSize: 13,
    lineHeight: 20,
    fontStyle: "italic",
  },
  selectorHeader: {
    color: "rgba(255,255,255,0.6)",
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 10,
  },
  heroSelectorRow: {
    gap: 8,
    paddingVertical: 4,
  },
  heroSelectPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  heroSelectPillActive: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  heroSelectAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  heroSelectText: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  heroSelectTextActive: {
    color: "#ffffff",
    fontWeight: "800",
  },
  launchMissionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.violet,
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 14,
  },
  launchMissionBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },

  /* Touchdown Descent Phase */
  descentContainer: {
    flex: 1,
    gap: 10,
  },
  telemetryHUD: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  hudCol: {
    flex: 1,
    alignItems: "center",
  },
  hudLabel: {
    color: "rgba(255,255,255,0.6)",
    fontWeight: "800",
    fontSize: 9,
    letterSpacing: 0.5,
  },
  hudValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#ffffff",
    fontFamily: "monospace",
    marginTop: 2,
  },
  speedSafe: {
    color: "#10b981",
  },
  speedCaution: {
    color: "#f59e0b",
  },
  speedDanger: {
    color: "#ef4444",
  },
  radioBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.3)",
  },
  radioText: {
    color: "#ffffff",
    fontSize: 11,
    flex: 1,
  },
  skyStage: {
    flex: 1,
    backgroundColor: "#03040c",
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  surfaceGround: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  marsSurface: {
    backgroundColor: "#991b1b",
  },
  moonSurface: {
    backgroundColor: "#374151",
  },
  targetZoneText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  landerCraft: {
    position: "absolute",
    left: "45%",
    alignItems: "center",
  },
  flameExhaust: {
    position: "absolute",
    top: 30,
  },
  thrusterControlArea: {
    paddingTop: 8,
  },
  thrustHoldBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#8b5cf6",
    paddingVertical: 18,
    borderRadius: 24,
  },
  thrustHoldBtnActive: {
    backgroundColor: "#7c3aed",
    transform: [{ scale: 0.98 }],
  },
  thrustDisabled: {
    opacity: 0.4,
  },
  thrustHoldText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 0.5,
  },

  /* Touchdown Surface Phase */
  surfaceContainer: {
    flex: 1,
    gap: 10,
  },
  compassRadarCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 4,
  },
  compassHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  compassTitle: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  compassDistance: {
    color: "#f59e0b",
    fontFamily: "monospace",
    fontWeight: "800",
    fontSize: 13,
  },
  echoesCountText: {
    color: "#a78bfa",
    fontFamily: "monospace",
    fontSize: 11,
  },
  surfaceGridStage: {
    flex: 1,
    backgroundColor: "#03040c",
    borderRadius: 20,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  targetSitePin: {
    position: "absolute",
    right: 40,
    top: 60,
    alignItems: "center",
  },
  beaconRing: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.4)",
  },
  pinLabel: {
    color: "#f59e0b",
    fontWeight: "800",
    fontSize: 10,
    marginTop: 2,
  },
  playerRover: {
    position: "absolute",
    alignItems: "center",
  },
  roverTag: {
    color: "#ffffff",
    fontSize: 9,
    fontFamily: "monospace",
  },
  dpadControls: {
    alignItems: "center",
    gap: 6,
  },
  dpadRow: {
    flexDirection: "row",
  },
  dpadRowMiddle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dpadBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  dpadCenter: {
    width: 50,
    alignItems: "center",
  },
  dpadCenterText: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: "monospace",
    fontSize: 10,
  },

  /* Touchdown Found Phase */
  foundContent: {
    paddingBottom: 40,
    gap: 12,
    alignItems: "center",
  },
  foundBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
  foundBadgeText: {
    color: "#f59e0b",
    fontWeight: "800",
    letterSpacing: 1,
  },
  foundImage: {
    width: "100%",
    height: 190,
    borderRadius: 20,
    marginVertical: 4,
  },
  foundHeroName: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
  },
  foundCoords: {
    color: "#a78bfa",
    fontFamily: "monospace",
  },
  finalWordsCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 8,
    width: "100%",
  },
  finalWordsLabel: {
    color: "#a78bfa",
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  finalWordsStory: {
    color: "#ffffff",
    lineHeight: 22,
    fontSize: 14,
    fontStyle: "italic",
  },
  finalWordsDate: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: "monospace",
  },
  lightBeaconBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#f59e0b",
    paddingVertical: 14,
    borderRadius: 18,
    width: "100%",
    marginTop: 4,
  },
  lightBeaconBtnText: {
    color: "#070814",
    fontWeight: "900",
    fontSize: 14,
  },
  beaconLitCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#10b981",
    width: "100%",
  },
  beaconLitText: {
    color: "#10b981",
    fontWeight: "800",
    fontSize: 13,
  },
  nextMissionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 13,
    borderRadius: 18,
    width: "100%",
    marginTop: 2,
  },
  nextMissionBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },

  /* Touchdown Crash Overlay */
  crashOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  crashTitle: {
    color: "#ef4444",
    fontSize: 22,
    fontWeight: "900",
  },
  crashText: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 20,
    fontSize: 13,
  },
  retryBtn: {
    backgroundColor: Colors.light.violet,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 8,
  },
  retryBtnText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  abortBtn: {
    paddingVertical: 8,
  },
  abortBtnText: {
    color: "rgba(255,255,255,0.6)",
  },

  /* Journal List Modal */
  journalList: {
    paddingBottom: 40,
    gap: 10,
  },
  journalHeaderSection: {
    marginBottom: 12,
    gap: 4,
  },
  journalHeadline: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
  },
  journalSub: {
    color: "rgba(255,255,255,0.6)",
  },
  journalItemCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  journalAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  journalItemInfo: {
    flex: 1,
    gap: 2,
  },
  journalItemName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  journalItemPlace: {
    color: "rgba(255,255,255,0.6)",
  },
  journalBadgesCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  jBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  jBadgeActive: {
    backgroundColor: "#10b981",
  },
  jBadgeText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 9,
  },
  beaconLitBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  beaconLitBadgeText: {
    color: "#f59e0b",
    fontWeight: "800",
    fontSize: 10,
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
