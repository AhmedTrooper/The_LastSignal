import { useState, useEffect, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  PanResponder,
  type PanResponderGestureState,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { HEROES, type Body, type Hero } from "@thelastsignal/data";
import { useGameStore } from "@/stores/use-game-store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GLOBE_RADIUS = Math.min(SCREEN_WIDTH * 0.42, 160);

interface GlobeViewProps {
  body: Body;
  selectedHero: Hero;
  onSelectHero: (hero: Hero) => void;
  onInitiateDescent: (hero: Hero) => void;
  onOpenJournal: () => void;
}

export function GlobeView({
  body,
  selectedHero,
  onSelectHero,
  onInitiateDescent,
  onOpenJournal,
}: GlobeViewProps) {
  const { sites } = useGameStore();

  // Globe orientation angles (in degrees)
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(15);
  // Auto-focus the globe towards the selected hero's coordinates
  const focusHero = useCallback((hero: Hero) => {
    const targetRotY = -hero.coords.lon;
    const targetRotX = Math.max(-45, Math.min(45, -hero.coords.lat * 0.8));
    return requestAnimationFrame(() => {
      setRotY(targetRotY);
      setRotX(targetRotX);
    });
  }, []);

  // Filter heroes on the current planetary body
  const bodyHeroes = useMemo(
    () => HEROES.filter((h) => h.body === body),
    [body]
  );

  // Touch PanResponder for 360 degree globe spinning with inertia
  const [panResponder] = useState(() => {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let velocityY = 0;
    let velocityX = 0;
    let animFrame: number | null = null;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4,
      onPanResponderGrant: () => {
        isDragging = true;
        velocityY = 0;
        velocityX = 0;
        if (animFrame) cancelAnimationFrame(animFrame);
      },
      onPanResponderMove: (_, gesture: PanResponderGestureState) => {
        const deltaX = gesture.dx - lastX;
        const deltaY = gesture.dy - lastY;
        lastX = gesture.dx;
        lastY = gesture.dy;

        setRotY((y) => (y + deltaX * 0.45) % 360);
        setRotX((x) => Math.max(-55, Math.min(55, x - deltaY * 0.35)));

        velocityY = deltaX * 0.3;
        velocityX = -deltaY * 0.2;
      },
      onPanResponderRelease: () => {
        isDragging = false;
        lastX = 0;
        lastY = 0;

        const decay = () => {
          if (isDragging) return;
          velocityY *= 0.92;
          velocityX *= 0.92;

          if (Math.abs(velocityY) > 0.05 || Math.abs(velocityX) > 0.05) {
            setRotY((y) => (y + velocityY) % 360);
            setRotX((x) => Math.max(-55, Math.min(55, x + velocityX)));
            animFrame = requestAnimationFrame(decay);
          }
        };
        decay();
      },
    });
  });

  useEffect(() => {
    const frameId = focusHero(selectedHero);
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [selectedHero, focusHero]);

  // Compute 3D spherical positions for all site beacons
  const projectedSites = useMemo(() => {
    const radX = (rotX * Math.PI) / 180;
    const R = GLOBE_RADIUS;

    return bodyHeroes.map((hero) => {
      const latRad = (hero.coords.lat * Math.PI) / 180;
      const lonRad = ((hero.coords.lon + rotY) * Math.PI) / 180;

      // Unrotated position on unit sphere:
      const uX = Math.cos(latRad) * Math.sin(lonRad);
      const uY = -Math.sin(latRad);
      const uZ = Math.cos(latRad) * Math.cos(lonRad);

      // Rotate around X axis (rotX tilt):
      const rotYPos = uY * Math.cos(radX) - uZ * Math.sin(radX);
      const rotZPos = uY * Math.sin(radX) + uZ * Math.cos(radX);

      // Final screen coordinates relative to globe center:
      const screenX = uX * R;
      const screenY = rotYPos * R;
      const isVisible = rotZPos > 0.05; // Visible if facing the camera
      const depthScale = Math.max(0.65, Math.min(1.15, 0.85 + rotZPos * 0.3));

      const siteState = sites[hero.slug];
      const isLanded = !!siteState?.landed;
      const isFound = !!siteState?.found;
      const isLit = !!siteState?.light;

      return {
        hero,
        screenX,
        screenY,
        rotZ: rotZPos,
        isVisible,
        depthScale,
        isLanded,
        isFound,
        isLit,
        isSelected: hero.slug === selectedHero.slug,
      };
    });
  }, [bodyHeroes, rotY, rotX, sites, selectedHero.slug]);

  const isMars = body === "mars";
  const primaryPlanetColor = isMars ? "#c2410c" : "#64748b";
  const darkLimbColor = isMars ? "#431407" : "#1e293b";
  const atmosGlow = isMars ? "rgba(234, 88, 12, 0.35)" : "rgba(148, 163, 184, 0.35)";

  const selectedSiteState = sites[selectedHero.slug];
  const isSelectedLit = !!selectedSiteState?.light;
  const isSelectedLanded = !!selectedSiteState?.landed;

  return (
    <View style={styles.container}>
      {/* 1. Header Telemetry Bar */}
      <View style={styles.topHud}>
        <View style={styles.planetPill}>
          <View style={[styles.planetDot, { backgroundColor: primaryPlanetColor }]} />
          <Text style={styles.planetPillText}>
            {body.toUpperCase()} ORBITAL TRACKER
          </Text>
        </View>

        <Pressable
          onPress={() => {
            haptic.light();
            onOpenJournal();
          }}
          style={styles.journalBtn}
        >
          <Ionicons name="book-outline" size={15} color="#ffffff" />
          <Text style={styles.journalBtnText}>FLIGHT LOG</Text>
        </Pressable>
      </View>

      {/* 2. Interactive Planetary Viewport */}
      <View style={styles.globeViewport} {...panResponder.panHandlers}>
        {/* Atmospheric Halo */}
        <View
          style={[
            styles.atmosphereRing,
            {
              width: GLOBE_RADIUS * 2 + 36,
              height: GLOBE_RADIUS * 2 + 36,
              borderRadius: (GLOBE_RADIUS * 2 + 36) / 2,
              borderColor: atmosGlow,
            },
          ]}
        />

        {/* Planet Sphere Surface */}
        <View
          style={[
            styles.globeSphere,
            {
              width: GLOBE_RADIUS * 2,
              height: GLOBE_RADIUS * 2,
              borderRadius: GLOBE_RADIUS,
              backgroundColor: darkLimbColor,
            },
          ]}
        >
          {/* Internal Shading & Curvature Gradient Layer */}
          <View
            style={[
              styles.globeShading,
              {
                borderRadius: GLOBE_RADIUS,
                backgroundColor: primaryPlanetColor,
              },
            ]}
          />

          {/* Planetary Surface Terrain Feature Markings */}
          <View style={styles.featuresLayer}>
            <View
              style={[
                styles.craterPatch,
                {
                  top: "28%",
                  left: "30%",
                  width: 50,
                  height: 30,
                  backgroundColor: isMars ? "#7c2d12" : "#334155",
                },
              ]}
            />
            <View
              style={[
                styles.craterPatch,
                {
                  top: "54%",
                  left: "52%",
                  width: 70,
                  height: 44,
                  backgroundColor: isMars ? "#7c2d12" : "#334155",
                },
              ]}
            />
            <View
              style={[
                styles.craterPatch,
                {
                  top: "42%",
                  left: "18%",
                  width: 36,
                  height: 24,
                  backgroundColor: isMars ? "#9a3412" : "#475569",
                },
              ]}
            />
          </View>

          {/* Terminator shadow (day/night divide) */}
          <View
            style={[
              styles.terminatorShadow,
              {
                borderRadius: GLOBE_RADIUS,
              },
            ]}
          />
        </View>

        {/* 3. Surface Beacon Pins projected over the Globe */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {projectedSites.map((item) => {
            if (!item.isVisible) return null;

            return (
              <Pressable
                key={item.hero.slug}
                onPress={() => {
                  haptic.light();
                  onSelectHero(item.hero);
                }}
                style={[
                  styles.beaconPin,
                  {
                    transform: [
                      { translateX: GLOBE_RADIUS + item.screenX - 16 },
                      { translateY: GLOBE_RADIUS + item.screenY - 16 },
                      { scale: item.depthScale * (item.isSelected ? 1.25 : 1) },
                    ],
                    zIndex: Math.round(item.rotZ * 100) + (item.isSelected ? 200 : 50),
                  },
                ]}
              >
                {/* Lit Beacon Sky Beam */}
                {item.isLit && (
                  <View style={styles.beaconVerticalBeam} />
                )}

                {/* Animated Pulsing Ring */}
                {item.isSelected && (
                  <View style={styles.beaconSelectedRing} />
                )}

                {/* Pin Core */}
                <View
                  style={[
                    styles.pinCore,
                    item.isLit && styles.pinCoreLit,
                    item.isSelected && styles.pinCoreSelected,
                  ]}
                >
                  <Ionicons
                    name={
                      item.isLit
                        ? "sparkles"
                        : item.isLanded
                        ? "checkmark"
                        : "radio-outline"
                    }
                    size={item.isSelected ? 13 : 11}
                    color={
                      item.isLit
                        ? "#f59e0b"
                        : item.isSelected
                        ? "#ffffff"
                        : "#38bdf8"
                    }
                  />
                </View>

                {/* Name Label */}
                {(item.isSelected || item.rotZ > 0.6) && (
                  <View
                    style={[
                      styles.pinLabelWrap,
                      item.isSelected && styles.pinLabelWrapSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pinLabelText,
                        item.isSelected && styles.pinLabelTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {item.hero.nickname ?? item.hero.name}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={styles.dragPrompt} numberOfLines={1}>
        SWIPE TO ROTATE {body.toUpperCase()} • TAP BEACON TO TARGET
      </Text>

      {/* 4. Selected Mission Telemetry Briefing Card */}
      <View style={styles.missionCard}>
        <View style={styles.missionHeader}>
          <View style={styles.missionTitleCol}>
            <View style={styles.missionBadgeRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isSelectedLit
                      ? "#f59e0b"
                      : isSelectedLanded
                      ? "#10b981"
                      : "#38bdf8",
                  },
                ]}
              />
              <Text style={styles.missionDesignation}>
                {selectedHero.designation} • {body.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.missionName}>{selectedHero.name}</Text>
          </View>

          {isSelectedLit && (
            <View style={styles.litBadge}>
              <Ionicons name="flame" size={12} color="#f59e0b" />
              <Text style={styles.litBadgeText}>BEACON LIT</Text>
            </View>
          )}
        </View>

        <Text style={styles.restingPlaceText} numberOfLines={1}>
          Resting at: {selectedHero.restingPlace}
        </Text>

        <Text style={styles.missionStoryText} numberOfLines={2}>
          &ldquo;{selectedHero.end.story}&rdquo;
        </Text>

        {/* Coordinates Telemetry HUD */}
        <View style={styles.coordsRow}>
          <View style={styles.coordBox}>
            <Text style={styles.coordLabel}>LATITUDE</Text>
            <Text style={styles.coordVal}>
              {selectedHero.coords.lat.toFixed(2)}°
            </Text>
          </View>
          <View style={styles.coordBox}>
            <Text style={styles.coordLabel}>LONGITUDE</Text>
            <Text style={styles.coordVal}>
              {selectedHero.coords.lon.toFixed(2)}°
            </Text>
          </View>
          <View style={styles.coordBox}>
            <Text style={styles.coordLabel}>TARGET DIST</Text>
            <Text style={styles.coordVal}>
              {isSelectedLanded ? "0 m" : "480 m"}
            </Text>
          </View>
        </View>

        {/* Initiate Descent CTA Button */}
        <Pressable
          onPress={() => {
            haptic.heavy();
            onInitiateDescent(selectedHero);
          }}
          style={({ pressed }) => [
            styles.descentBtn,
            pressed && styles.descentBtnPressed,
          ]}
        >
          <Ionicons name="airplane-sharp" size={18} color="#ffffff" />
          <Text style={styles.descentBtnText}>
            INITIATE ATMOSPHERIC DESCENT
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  topHud: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  planetPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  planetDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  planetPillText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  journalBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    borderColor: "rgba(99, 102, 241, 0.4)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  journalBtnText: {
    color: "#a5b4fc",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  globeViewport: {
    width: GLOBE_RADIUS * 2 + 40,
    height: GLOBE_RADIUS * 2 + 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 10,
  },
  atmosphereRing: {
    position: "absolute",
    borderWidth: 2,
    opacity: 0.65,
  },
  globeSphere: {
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 12,
  },
  globeShading: {
    ...StyleSheet.absoluteFill,
    opacity: 0.85,
  },
  featuresLayer: {
    ...StyleSheet.absoluteFill,
  },
  craterPatch: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.6,
  },
  terminatorShadow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(3, 4, 10, 0.48)",
    transform: [{ translateX: GLOBE_RADIUS * 0.35 }],
  },
  beaconPin: {
    position: "absolute",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  beaconVerticalBeam: {
    position: "absolute",
    bottom: 16,
    width: 2,
    height: 38,
    backgroundColor: "#f59e0b",
    opacity: 0.9,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  beaconSelectedRing: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#38bdf8",
    opacity: 0.8,
  },
  pinCore: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(14, 15, 36, 0.9)",
    borderColor: "#38bdf8",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#38bdf8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  pinCoreLit: {
    borderColor: "#f59e0b",
    shadowColor: "#f59e0b",
  },
  pinCoreSelected: {
    backgroundColor: Colors.light.violet,
    borderColor: "#ffffff",
    transform: [{ scale: 1.1 }],
  },
  pinLabelWrap: {
    position: "absolute",
    top: 24,
    backgroundColor: "rgba(10, 11, 26, 0.88)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
  },
  pinLabelWrapSelected: {
    backgroundColor: "rgba(99, 102, 241, 0.9)",
    borderColor: "#ffffff",
  },
  pinLabelText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 9,
    fontWeight: "700",
  },
  pinLabelTextSelected: {
    color: "#ffffff",
    fontWeight: "800",
  },
  dragPrompt: {
    color: "rgba(255, 255, 255, 0.45)",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 6,
    marginBottom: 14,
  },
  missionCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  missionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  missionTitleCol: {
    flex: 1,
    gap: 2,
  },
  missionBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  missionDesignation: {
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  missionName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  litBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderColor: "rgba(245, 158, 11, 0.4)",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  litBadgeText: {
    color: "#f59e0b",
    fontSize: 9,
    fontWeight: "800",
  },
  restingPlaceText: {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: "700",
  },
  missionStoryText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    lineHeight: 16,
    fontStyle: "italic",
  },
  coordsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  coordBox: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  coordLabel: {
    color: "rgba(255, 255, 255, 0.45)",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  coordVal: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2,
  },
  descentBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.violet,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  descentBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  descentBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
