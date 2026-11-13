import { useState, useRef, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  HEROES,
  portrait,
  photo,
  assetUrl,
  type Body,
  type Hero,
} from "@thelastsignal/data";
import { useGameStore } from "@/stores/use-game-store";
import { haptic } from "@/utils/haptics";

// UI Components matching web 1:1
import { Stars } from "./ui/Stars";
import { Radio, type RadioHandle } from "./ui/Radio";
import { Joystick } from "./ui/Joystick";
import { HoldButton } from "./ui/HoldButton";
import { DescentHud, type DescentTelemetry } from "./ui/DescentHud";
import { Compass, type CompassTarget } from "./ui/Compass";
import { JournalSheet } from "./ui/JournalSheet";
import { SettingsSheet } from "./ui/SettingsSheet";
import { PauseSheet } from "./ui/PauseSheet";

// 3D Render Components
import { GlobeSurface } from "./render/GlobeSurface";
import { DescentFlight, type LandingResult } from "./render/DescentFlight";
import { SurfaceRover } from "./render/SurfaceRover";

import {
  PROLOGUE,
  BRIEF,
  RADIO,
  ORDER,
} from "./story";

const ZONE = 40;

type Screen = "title" | "prologue" | "orbit" | "brief" | "dive" | "play";
type Phase = "descent" | "drive";
type Panel = null | "landed" | "crashed" | "found";
type Overlay = null | "journal" | "settings" | "pause";

interface TouchdownGameProps {
  onExit?: () => void;
}

export function TouchdownGame({ onExit }: TouchdownGameProps) {
  const insets = useSafeAreaInsets();
  const { sites: savedSites, recordLanding, recordCrash, recordFound, lightBeacon } =
    useGameStore();

  const [screen, setScreen] = useState<Screen>("title");
  const [body, setBody] = useState<Body>("mars");
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [phase, setPhase] = useState<Phase>("descent");
  const [panel, setPanel] = useState<Panel>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [soundOn, setSoundOn] = useState(true);

  // Flight & Driving Controls
  const [thrust, setThrust] = useState(false);
  const [driftX, setDriftX] = useState(0);
  const [driftY, setDriftY] = useState(0);
  const [brake, setBrake] = useState(false);

  // Flight & Driving Telemetry
  const [telemetry, setTelemetry] = useState<DescentTelemetry>({
    alt: 420,
    vy: -16,
    vh: 6.5,
    dist: 60,
    targetVy: 12,
    fuel: 100,
    isBurning: false,
    px: 48,
    pz: -36,
  });

  const [compassTargets, setCompassTargets] = useState<CompassTarget[]>([]);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [landingResult, setLandingResult] = useState<LandingResult | null>(null);
  const [echoNotification, setEchoNotification] = useState<{
    index: number;
    text: string;
  } | null>(null);

  const radioRef = useRef<RadioHandle>(null);
  const bigRadioRef = useRef<RadioHandle>(null);

  // Hero lookup
  const heroMap = useMemo(() => new Map(HEROES.map((h) => [h.slug, h])), []);
  const worldSites = useMemo(
    () => HEROES.filter((h) => h.body === body),
    [body]
  );

  const totalFound = Object.values(savedSites).filter((s) => s.found).length;
  const totalStars = Object.values(savedSites).reduce(
    (acc, s) =>
      acc +
      (s.soft ? 1 : 0) +
      (s.landed ? 1 : 0) +
      (s.echoes >= 3 ? 1 : 0),
    0
  );

  const nextHeroSlug = ORDER.find((slug) => !savedSites[slug]?.found) ?? ORDER[0];
  const nextHero = heroMap.get(nextHeroSlug) ?? HEROES[0];

  const currentHero = selectedHero ?? nextHero;
  const currentSaved = savedSites[currentHero.slug];

  // Helper functions matching web
  const begin = () => {
    haptic.selection();
    setScreen("orbit");
    setSelectedHero(nextHero);
    setBody(nextHero.body);
  };

  const pickHero = (hero: Hero) => {
    haptic.selection();
    setSelectedHero(hero);
    setBody(hero.body);
    setScreen("brief");
    setTimeout(() => {
      const briefLines = BRIEF[hero.slug] ?? [
        "Carrier lock acquired. Descend into the target landing zone.",
      ];
      radioRef.current?.say(briefLines.map((t) => ({ who: "ground", text: t })), {
        clear: true,
      });
    }, 400);
  };

  const beginDescent = () => {
    haptic.medium();
    setScreen("dive");
    setTimeout(() => {
      setScreen("play");
      setPhase("descent");
      setPanel(null);
      setThrust(false);
      setDriftX(0);
      setDriftY(0);
      radioRef.current?.say(RADIO.chute, { clear: true });
    }, 1800);
  };

  const handleLandingFinish = useCallback((result: LandingResult) => {
    setLandingResult(result);
    if (result.ok) {
      recordLanding(currentHero.slug, result.grade === "feather" || result.grade === "smooth");
      setPanel("landed");
      radioRef.current?.say(
        result.grade === "hard" ? RADIO.landedHard : RADIO.landed,
        { clear: true }
      );
    } else {
      recordCrash(currentHero.slug);
      setPanel("crashed");
      radioRef.current?.say(RADIO.crashed, { clear: true });
    }
  }, [currentHero.slug, recordLanding, recordCrash]);

  const deployRover = () => {
    haptic.medium();
    setPhase("drive");
    setPanel(null);
    radioRef.current?.say(RADIO.deploy, { clear: true });
  };

  const retryLanding = () => {
    haptic.light();
    setPanel(null);
    setPhase("descent");
    setThrust(false);
    setDriftX(0);
    setDriftY(0);
    radioRef.current?.say(RADIO.chute, { clear: true });
  };

  const handleReachMachine = useCallback(() => {
    recordFound(currentHero.slug, 3);
    setPanel("found");
    radioRef.current?.say(RADIO.arriveMachine, { clear: true });
  }, [currentHero.slug, recordFound]);

  const handleCollectEcho = useCallback((index: number, text: string) => {
    setEchoNotification({ index, text });
    radioRef.current?.say(RADIO.echo);
    setTimeout(() => setEchoNotification(null), 5000);
  }, []);

  const handleLeaveLight = () => {
    haptic.success();
    lightBeacon(currentHero.slug);
  };

  const inOrbit = screen === "orbit" || screen === "brief";

  return (
    <View style={styles.container}>
      {/* ---------------- 1. TITLE SCREEN ---------------- */}
      {screen === "title" && (
        <View style={[styles.titleScreen, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
          {onExit && (
            <Pressable onPress={onExit} style={[styles.titleCloseBtn, { top: insets.top + 16 }]}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </Pressable>
          )}
          <View style={styles.titleContent}>
            {/* AI-Generated App Icon */}
            <View style={styles.iconGlow}>
              <Image
                source={{ uri: assetUrl("images/icon-touchdown.webp") }}
                style={styles.touchdownIcon}
                contentFit="cover"
              />
            </View>

            <Text style={styles.titleSuper}>ROVERVILLA · A GAME</Text>
            <Text style={styles.titleDisplay}>Touchdown</Text>
            <Text style={styles.titleParagraph}>
              A pilgrimage to the machines we left on Mars and the Moon. Fly each landing yourself, then drive to where they rest.
            </Text>

            <View style={styles.titleBtnRow}>
              <Pressable onPress={begin} style={styles.beginBtn}>
                <Text style={styles.beginBtnText}>
                  {totalFound > 0 ? `Continue · ${totalFound}/${HEROES.length}` : "Begin"}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" />
              </Pressable>

              <Pressable
                onPress={() => {
                  haptic.light();
                  setScreen("prologue");
                  setTimeout(() => {
                    bigRadioRef.current?.say(PROLOGUE, { hold: 1600 });
                  }, 400);
                }}
                style={styles.ghostBtn}
              >
                <Text style={styles.ghostBtnText}>Prologue</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  haptic.light();
                  setOverlay("journal");
                }}
                style={styles.ghostBtn}
              >
                <Text style={styles.ghostBtnText}>Journal</Text>
              </Pressable>
            </View>

            <Text style={styles.titleDisclaimer}>
              Best with headphones. The places, dates and machines are real; the story around them is fiction. Game icon: AI-generated illustration.
            </Text>
          </View>
        </View>
      )}

      {/* ---------------- 2. PROLOGUE SCREEN ---------------- */}
      {screen === "prologue" && (
        <View style={[styles.prologueScreen, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}>
          <Radio
            ref={bigRadioRef}
            big
            onIdle={() => {
              setTimeout(() => {
                setScreen("orbit");
                setSelectedHero(nextHero);
              }, 1800);
            }}
          />

          <Pressable
            onPress={() => {
              haptic.light();
              setScreen("orbit");
              setSelectedHero(nextHero);
            }}
            style={styles.skipBtn}
          >
            <Text style={styles.skipBtnText}>SKIP</Text>
          </Pressable>
        </View>
      )}

      {/* ---------------- 3. TOP NAVIGATION BAR ---------------- */}
      {screen !== "title" && screen !== "prologue" && (
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <View style={styles.topBarLeft}>
            <Text style={styles.topBarSuper}>
              TOUCHDOWN · {body.toUpperCase()}
            </Text>
            <Text style={styles.topBarTitle} numberOfLines={1}>
              {inOrbit || screen === "dive"
                ? screen === "brief" && selectedHero
                  ? selectedHero.name
                  : "Choose a signal"
                : phase === "descent"
                ? `Landing at ${currentHero.restingPlace.split(",")[0]}`
                : `Find ${currentHero.name}`}
            </Text>

            {inOrbit && (
              <View style={styles.orbitMetaRow}>
                <Text style={styles.scoreText}>
                  {totalFound}/{HEROES.length} heard
                </Text>
                <Text style={styles.starsScoreText}>
                  ★ {totalStars}/{HEROES.length * 3}
                </Text>
              </View>
            )}

            {inOrbit && (
              <View style={styles.planetPillTrack}>
                {(["mars", "moon"] as const).map((b) => (
                  <Pressable
                    key={b}
                    onPress={() => {
                      haptic.selection();
                      setBody(b);
                      setSelectedHero(null);
                      setScreen("orbit");
                    }}
                    style={[
                      styles.planetPill,
                      body === b && styles.planetPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.planetPillText,
                        body === b && styles.planetPillTextActive,
                      ]}
                    >
                      {b === "mars" ? "Mars" : "Moon"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Top Right Actions */}
          <View style={styles.topBarRight}>
            {inOrbit && (
              <Pressable
                onPress={() => {
                  haptic.light();
                  setOverlay("journal");
                }}
                style={styles.circleIconBtn}
              >
                <Ionicons name="book-outline" size={18} color="#ffffff" />
              </Pressable>
            )}

            <Pressable
              onPress={() => {
                haptic.light();
                setSoundOn(!soundOn);
              }}
              style={styles.circleIconBtn}
            >
              <Ionicons
                name={soundOn ? "volume-high-outline" : "volume-mute-outline"}
                size={18}
                color="#ffffff"
              />
            </Pressable>

            {screen === "play" ? (
              <Pressable
                onPress={() => {
                  haptic.light();
                  setOverlay("pause");
                }}
                style={styles.circleIconBtn}
              >
                <Ionicons name="pause" size={18} color="#ffffff" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  haptic.light();
                  setOverlay("settings");
                }}
                style={styles.circleIconBtn}
              >
                <Ionicons name="settings-outline" size={18} color="#ffffff" />
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* ---------------- 4. ORBIT SCREEN ---------------- */}
      {screen === "orbit" && (
        <View style={styles.stage}>
          <GlobeSurface
            body={body}
            selectedHero={selectedHero}
            onSelectHero={pickHero}
          />

          {/* Bottom Horizontal Carousel of Sites */}
          <View style={[styles.bottomCarousel, { paddingBottom: insets.bottom + 12 }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent}>
              {worldSites.map((h) => {
                const s = savedSites[h.slug];
                const isFound = !!s?.found;
                const isSelected = selectedHero?.slug === h.slug;

                return (
                  <Pressable
                    key={h.slug}
                    onPress={() => pickHero(h)}
                    style={[
                      styles.sitePill,
                      isSelected && styles.sitePillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sitePillName,
                        isSelected && styles.sitePillNameSelected,
                      ]}
                    >
                      {h.name}
                    </Text>
                    {isFound ? (
                      <Stars
                        have={[!!s?.soft, !!s?.landed, (s?.echoes ?? 0) >= 3]}
                        size="sm"
                      />
                    ) : (
                      <View style={styles.unvisitedDot} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {/* ---------------- 5. SITE BRIEF SCREEN ---------------- */}
      {screen === "brief" && selectedHero && (
        <View style={styles.stage}>
          <GlobeSurface
            body={body}
            selectedHero={selectedHero}
            onSelectHero={() => {}}
          />

          {/* Bottom Brief Card matching web */}
          <View style={[styles.briefCardWrap, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.briefCard}>
              <View style={styles.briefHeaderRow}>
                <View style={styles.briefThumbWrap}>
                  <Image
                    source={{ uri: photo(portrait(selectedHero), selectedHero.name).src }}
                    style={styles.briefThumb}
                    contentFit="cover"
                  />
                </View>
                <View style={styles.briefHeadInfo}>
                  <Text style={styles.briefPlace}>{selectedHero.restingPlace}</Text>
                  <Text style={styles.briefName} numberOfLines={1}>{selectedHero.name}</Text>
                  <Text style={styles.briefCoords}>
                    {selectedHero.coords.lat.toFixed(2)}°, {selectedHero.coords.lon.toFixed(2)}°
                  </Text>
                </View>
              </View>

              {/* 4 Bento Metric Boxes matching web */}
              <View style={styles.bentoGrid}>
                <View style={styles.bentoBox}>
                  <Text style={styles.bentoLabel}>
                    {selectedHero.landing ? "Landed" : "Launched"}
                  </Text>
                  <Text style={styles.bentoVal}>
                    {selectedHero.landing ? selectedHero.landing.date : selectedHero.launch.date}
                  </Text>
                </View>

                <View style={styles.bentoBox}>
                  <Text style={styles.bentoLabel}>{selectedHero.end.label}</Text>
                  <Text style={styles.bentoVal}>{selectedHero.end.date}</Text>
                </View>

                <View style={styles.bentoBox}>
                  <Text style={styles.bentoLabel}>Gravity</Text>
                  <Text style={styles.bentoVal}>
                    {selectedHero.body === "mars" ? "3.71 m/s²" : "1.62 m/s²"}
                  </Text>
                </View>

                <View style={styles.bentoBox}>
                  <Text style={styles.bentoLabel}>Conditions</Text>
                  <Text style={styles.bentoVal}>
                    {selectedHero.body === "mars" ? "Gusty wind" : "No air, no wind"}
                  </Text>
                </View>
              </View>

              {/* Stars & Visited Status */}
              <View style={styles.starsStatusRow}>
                <Stars
                  have={[
                    !!currentSaved?.soft,
                    !!currentSaved?.landed,
                    (currentSaved?.echoes ?? 0) >= 3,
                  ]}
                />
                <Text style={styles.visitedStatusText}>
                  {currentSaved?.found
                    ? `${currentSaved.echoes}/3 echoes · visited`
                    : "Not visited yet"}
                </Text>
              </View>

              <Text style={styles.briefInstruction}>
                Land in the blue ring, then drive the rover to it.
              </Text>

              {/* Action Buttons */}
              <View style={styles.briefBtnRow}>
                <Pressable onPress={beginDescent} style={styles.beginDescentBtn}>
                  <Text style={styles.beginDescentText}>Begin descent</Text>
                  <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                </Pressable>

                <Pressable
                  onPress={() => {
                    haptic.light();
                    radioRef.current?.clear();
                    setScreen("orbit");
                  }}
                  style={styles.backPillBtn}
                >
                  <Text style={styles.backPillText}>Back</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* ---------------- 6. DIVE TRANSITION SCREEN ---------------- */}
      {screen === "dive" && (
        <View style={styles.diveScreen}>
          <Text style={styles.diveHeading}>
            {`ENTERING ${body === "mars" ? "MARS" : "LUNAR"} ORBIT`}
          </Text>
          <Text style={styles.diveSub}>De-orbit burn complete · Systems nominal</Text>
        </View>
      )}

      {/* ---------------- 7. PLAY SCREEN: DESCENT ---------------- */}
      {screen === "play" && phase === "descent" && (
        <View style={styles.stage}>
          <DescentFlight
            hero={currentHero}
            thrust={thrust}
            driftX={driftX}
            driftY={driftY}
            onTelemetry={setTelemetry}
            onFinish={handleLandingFinish}
          />

          {/* Top Right Descent Instruments & Circular Radar */}
          <View style={[styles.descentHudWrap, { top: insets.top + 70 }]}>
            <DescentHud telemetry={telemetry} mars={currentHero.body === "mars"} />
          </View>

          {/* Warning Hint when descending too fast near ground */}
          {telemetry.alt < 120 && -telemetry.vy > 4.5 ? (
            <View style={styles.centerHint}>
              <Text style={styles.centerHintText}>BRAKE NOW</Text>
            </View>
          ) : null}

          {/* Touch Controls: Joystick Left, Engine HoldButton Right */}
          <View style={[styles.touchControlsRow, { bottom: insets.bottom + 16 }]}>
            <Joystick
              label="Drift"
              onChange={(x, y) => {
                setDriftX(x);
                setDriftY(y);
              }}
            />

            <HoldButton
              label="Engine"
              sublabel="+8.8 m/s²"
              onChange={(isDown) => setThrust(isDown)}
            />
          </View>
        </View>
      )}

      {/* ---------------- 8. PLAY SCREEN: DRIVE ---------------- */}
      {screen === "play" && phase === "drive" && (
        <View style={styles.stage}>
          <SurfaceRover
            hero={currentHero}
            joyX={driftX}
            joyY={driftY}
            brake={brake}
            onCompassUpdate={(targets, spd) => {
              setCompassTargets(targets);
              setSpeedKmh(spd);
            }}
            onCollectEcho={handleCollectEcho}
            onReachMachine={handleReachMachine}
          />

          {/* Top Center Compass Strip */}
          <View style={[styles.compassWrap, { top: insets.top + 64 }]}>
            <Compass
              name={currentHero.name}
              speedKmh={speedKmh}
              targets={compassTargets}
            />
          </View>

          {/* Floating Echo Card Notification */}
          {echoNotification ? (
            <View style={[styles.echoCardNotification, { top: insets.top + 130 }]}>
              <Text style={styles.echoCardSuper}>
                {`ECHO ${echoNotification.index} OF 3 · FROM THE MISSION RECORD`}
              </Text>
              <Text style={styles.echoCardBody}>{echoNotification.text}</Text>
            </View>
          ) : null}

          {/* Touch Controls: Joystick Left, Brake HoldButton Right */}
          <View style={[styles.touchControlsRow, { bottom: insets.bottom + 16 }]}>
            <Joystick
              label="Drive"
              onChange={(x, y) => {
                setDriftX(x);
                setDriftY(y);
              }}
            />

            <HoldButton
              label="Brake"
              size={80}
              onChange={(isDown) => setBrake(isDown)}
            />
          </View>
        </View>
      )}

      {/* ---------------- 9. LANDED / CRASHED PANEL ---------------- */}
      {screen === "play" && panel === "landed" && landingResult && (
        <View style={[styles.panelWrap, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.panelCard}>
            <View style={styles.panelHeaderRow}>
              <View>
                <Text style={styles.touchdownBadge}>
                  {landingResult.grade === "hard" ? "HARD LANDING" : "TOUCHDOWN"}
                </Text>
                <Text style={styles.touchdownTitle}>
                  {landingResult.grade === "feather"
                    ? "Feather-light."
                    : landingResult.grade === "smooth"
                    ? "Gentle landing."
                    : landingResult.grade === "firm"
                    ? "Down, a bit firm."
                    : "Down in one piece."}
                </Text>
              </View>
              <Stars
                have={[
                  landingResult.grade === "feather" || landingResult.grade === "smooth",
                  landingResult.offset <= ZONE,
                  false,
                ]}
                size="lg"
              />
            </View>

            <View style={styles.bentoStats3}>
              <View style={styles.bentoStatItem}>
                <Text style={styles.statK}>Down</Text>
                <Text style={styles.statV}>{landingResult.vy.toFixed(1)} m/s</Text>
              </View>
              <View style={styles.bentoStatItem}>
                <Text style={styles.statK}>From ring</Text>
                <Text style={[styles.statV, landingResult.offset <= ZONE && styles.statVGood]}>
                  {landingResult.offset.toFixed(0)} m
                </Text>
              </View>
              <View style={styles.bentoStatItem}>
                <Text style={styles.statK}>Fuel left</Text>
                <Text style={styles.statV}>{landingResult.fuel.toFixed(0)}%</Text>
              </View>
            </View>

            <Text style={styles.panelNoteText}>
              {landingResult.note}{" "}
              {landingResult.grade === "feather" || landingResult.grade === "smooth"
                ? "Star awarded for a gentle landing. "
                : "Under 2.8 m/s earns the gentle-landing star. "}
              The third star is for all three echoes.
            </Text>

            <View style={styles.panelActions}>
              <Pressable onPress={deployRover} style={styles.deployRoverBtn}>
                <Text style={styles.deployRoverText}>Deploy the rover</Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </Pressable>

              <Pressable onPress={retryLanding} style={styles.retryBtn}>
                <Text style={styles.retryText}>Land again</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {screen === "play" && panel === "crashed" && landingResult && (
        <View style={[styles.panelWrap, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.panelCard}>
            <Text style={styles.crashedBadge}>SIGNAL LOST</Text>
            <Text style={styles.touchdownTitle}>That one didn&apos;t make it.</Text>
            <Text style={styles.crashedReason}>{landingResult.reason}</Text>

            <View style={styles.panelActions}>
              <Pressable onPress={retryLanding} style={styles.deployRoverBtn}>
                <Text style={styles.deployRoverText}>Try again</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setPanel(null);
                  setScreen("orbit");
                }}
                style={styles.retryBtn}
              >
                <Text style={styles.retryText}>Back to orbit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* ---------------- 10. FOUND / DISCOVERY PANEL ---------------- */}
      {screen === "play" && panel === "found" && (
        <View style={[styles.panelWrap, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.foundCard}>
            <View style={styles.foundTopRow}>
              <View style={styles.foundThumbWrap}>
                <Image
                  source={{ uri: photo(portrait(currentHero), currentHero.name).src }}
                  style={styles.foundThumb}
                  contentFit="cover"
                />
              </View>
              <View style={styles.foundHeadCol}>
                <Text style={styles.foundBadge}>YOU FOUND IT · NEW</Text>
                <Text style={styles.foundName}>{currentHero.name}</Text>
                <Text style={styles.foundPlace}>{currentHero.restingPlace}</Text>
                <View style={styles.foundStarsWrap}>
                  <Stars have={[true, true, true]} size="md" />
                </View>
              </View>
            </View>

            <View style={styles.transmissionBox}>
              <Text style={styles.transHeader}>
                {currentHero.end.label} · {currentHero.end.date}
              </Text>
              <Text style={styles.transBody}>&ldquo;{currentHero.end.story}&rdquo;</Text>
            </View>

            <View style={styles.foundBtnRow}>
              <Pressable
                onPress={() => {
                  setPanel(null);
                  setScreen("orbit");
                }}
                style={styles.nextSignalBtn}
              >
                <Text style={styles.nextSignalText}>Back to orbit</Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </Pressable>

              {!currentSaved?.light ? (
                <Pressable onPress={handleLeaveLight} style={styles.lightBtn}>
                  <Text style={styles.lightBtnText}>Leave a light</Text>
                </Pressable>
              ) : null}

              <Pressable
                onPress={() => setPanel(null)}
                style={styles.lookAroundBtn}
              >
                <Text style={styles.lookAroundText}>Look around</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* ---------------- 11. GROUND RADIO FLOATING BOX ---------------- */}
      {screen !== "title" && screen !== "prologue" && (
        <View
          style={[
            styles.floatingRadio,
            { bottom: insets.bottom + (phase === "drive" ? 120 : 120) },
          ]}
        >
          <Radio ref={radioRef} />
        </View>
      )}

      {/* ---------------- 12. OVERLAYS ---------------- */}
      <JournalSheet
        visible={overlay === "journal"}
        onClose={() => setOverlay(null)}
        onGoToSite={(hero) => {
          setOverlay(null);
          pickHero(hero);
        }}
      />

      <SettingsSheet
        visible={overlay === "settings"}
        onClose={() => setOverlay(null)}
      />

      <PauseSheet
        visible={overlay === "pause"}
        onResume={() => setOverlay(null)}
        onRestartLanding={phase === "descent" ? retryLanding : undefined}
        onOpenSettings={() => setOverlay("settings")}
        onBackToOrbit={() => {
          setOverlay(null);
          setScreen("orbit");
        }}
        onTitleScreen={() => {
          setOverlay(null);
          setScreen("title");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04030c",
  },
  stage: {
    flex: 1,
    position: "relative",
  },

  /* Title Screen Styles */
  titleScreen: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  titleCloseBtn: {
    position: "absolute",
    right: 24,
    zIndex: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContent: {
    maxWidth: 480,
  },
  iconGlow: {
    width: 84,
    height: 84,
    borderRadius: 20,
    shadowColor: "#5b2eff",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
    marginBottom: 20,
  },
  touchdownIcon: {
    width: 84,
    height: 84,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  titleSuper: {
    fontFamily: "monospace",
    fontSize: 12,
    letterSpacing: 2.2,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
  },
  titleDisplay: {
    fontSize: 54,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -1,
    marginTop: 6,
    lineHeight: 60,
  },
  titleParagraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 14,
  },
  titleBtnRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 24,
  },
  beginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#5b2eff",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#5b2eff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  beginBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  ghostBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
  },
  ghostBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  titleDisclaimer: {
    fontFamily: "monospace",
    fontSize: 10,
    lineHeight: 16,
    color: "rgba(255, 255, 255, 0.45)",
    marginTop: 32,
  },

  /* Prologue Screen */
  prologueScreen: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "#04030c",
  },
  skipBtn: {
    position: "absolute",
    right: 24,
    bottom: 40,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skipBtnText: {
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: 1.5,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "700",
  },

  /* Top Bar */
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
  },
  topBarLeft: {
    flex: 1,
    paddingRight: 12,
  },
  topBarSuper: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1.6,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 2,
  },
  orbitMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 3,
  },
  scoreText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.65)",
  },
  starsScoreText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#fcd34d",
    fontWeight: "600",
  },
  planetPillTrack: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 20,
    padding: 3,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  planetPill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
  },
  planetPillActive: {
    backgroundColor: "#5b2eff",
  },
  planetPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  planetPillTextActive: {
    color: "#ffffff",
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  circleIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Orbit Carousel */
  bottomCarousel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  carouselContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sitePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sitePillSelected: {
    backgroundColor: "#5b2eff",
    borderColor: "#7c3aed",
  },
  sitePillName: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  sitePillNameSelected: {
    fontWeight: "700",
  },
  unvisitedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#8b5cf6",
  },

  /* Brief Card */
  briefCardWrap: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    zIndex: 20,
  },
  briefCard: {
    backgroundColor: "rgba(11, 10, 29, 0.92)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    padding: 16,
  },
  briefHeaderRow: {
    flexDirection: "row",
    gap: 12,
  },
  briefThumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  briefThumb: {
    width: "100%",
    height: "100%",
  },
  briefHeadInfo: {
    flex: 1,
    justifyContent: "center",
  },
  briefPlace: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.55)",
  },
  briefName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 1,
  },
  briefCoords: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 2,
  },
  bentoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  bentoBox: {
    width: "48.5%",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 10,
    padding: 8,
  },
  bentoLabel: {
    fontFamily: "monospace",
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.5)",
  },
  bentoVal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 2,
  },
  starsStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  visitedStatusText: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.55)",
  },
  briefInstruction: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.65)",
    lineHeight: 18,
    marginTop: 8,
  },
  briefBtnRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  beginDescentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#5b2eff",
    borderRadius: 22,
    paddingVertical: 12,
  },
  beginDescentText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  backPillBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 22,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  backPillText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Dive Screen */
  diveScreen: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  diveHeading: {
    fontFamily: "monospace",
    fontSize: 14,
    letterSpacing: 2.2,
    color: "#ffffff",
    fontWeight: "700",
  },
  diveSub: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.45)",
    marginTop: 8,
  },

  /* Descent HUD & Controls */
  descentHudWrap: {
    position: "absolute",
    right: 14,
    zIndex: 20,
  },
  centerHint: {
    position: "absolute",
    top: "38%",
    alignSelf: "center",
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderWidth: 1.5,
    borderColor: "#ef4444",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
  },
  centerHintText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fcd34d",
    letterSpacing: 2,
  },
  touchControlsRow: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
  },

  /* Drive HUD & Controls */
  compassWrap: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 20,
  },
  echoCardNotification: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "rgba(7, 28, 36, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(103, 232, 249, 0.3)",
    borderRadius: 16,
    padding: 14,
    zIndex: 25,
  },
  echoCardSuper: {
    fontFamily: "monospace",
    fontSize: 9,
    letterSpacing: 1.4,
    color: "#67e8f9",
    fontWeight: "700",
  },
  echoCardBody: {
    fontSize: 13,
    lineHeight: 18,
    color: "#ffffff",
    marginTop: 4,
  },

  /* Landed / Crashed Panel */
  panelWrap: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    zIndex: 30,
  },
  panelCard: {
    backgroundColor: "rgba(11, 10, 29, 0.94)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    padding: 20,
  },
  panelHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  touchdownBadge: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1.6,
    color: "#6ee7b7",
    fontWeight: "700",
  },
  touchdownTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 2,
  },
  crashedBadge: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1.6,
    color: "#f43f5e",
    fontWeight: "700",
  },
  crashedReason: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 6,
  },
  bentoStats3: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  bentoStatItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 8,
  },
  statK: {
    fontFamily: "monospace",
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.5)",
  },
  statV: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 2,
  },
  statVGood: {
    color: "#67e8f9",
  },
  panelNoteText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.65)",
    lineHeight: 18,
    marginTop: 10,
  },
  panelActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  deployRoverBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#5b2eff",
    borderRadius: 22,
    paddingVertical: 12,
  },
  deployRoverText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  retryBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 22,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  retryText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Found Panel */
  foundCard: {
    backgroundColor: "rgba(11, 10, 29, 0.94)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    padding: 18,
  },
  foundTopRow: {
    flexDirection: "row",
    gap: 12,
  },
  foundThumbWrap: {
    width: 68,
    height: 68,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  foundThumb: {
    width: "100%",
    height: "100%",
  },
  foundHeadCol: {
    flex: 1,
    justifyContent: "center",
  },
  foundBadge: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#6ee7b7",
    fontWeight: "700",
  },
  foundName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 1,
  },
  foundPlace: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.55)",
    marginTop: 1,
  },
  foundStarsWrap: {
    marginTop: 4,
  },
  transmissionBox: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },
  transHeader: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 1.4,
    color: "#fecdd3",
    fontWeight: "700",
  },
  transBody: {
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  foundBtnRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  nextSignalBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#5b2eff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  nextSignalText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  lightBtn: {
    backgroundColor: "#f59e0b",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  lightBtnText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "700",
  },
  lookAroundBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  lookAroundText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },

  /* Floating Radio */
  floatingRadio: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 25,
    pointerEvents: "box-none",
  },
});
