import { useState, useMemo, useCallback } from "react";
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
import { HEROES, type Body, type Hero } from "@thelastsignal/data";
import { useGameStore } from "@/stores/use-game-store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GLOBE_RADIUS = Math.min(SCREEN_WIDTH * 0.44, 160);

interface GlobeSurfaceProps {
  body: Body;
  selectedHero: Hero | null;
  onSelectHero: (hero: Hero) => void;
}

export function GlobeSurface({
  body,
  selectedHero,
  onSelectHero,
}: GlobeSurfaceProps) {
  const { sites } = useGameStore();
  const isMars = body === "mars";

  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(15);

  const focusHero = useCallback((hero: Hero) => {
    const targetRotY = -hero.coords.lon;
    const targetRotX = Math.max(-45, Math.min(45, -hero.coords.lat * 0.8));
    return requestAnimationFrame(() => {
      setRotY(targetRotY);
      setRotX(targetRotX);
    });
  }, []);

  const bodyHeroes = useMemo(
    () => HEROES.filter((h) => h.body === body),
    [body]
  );

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

  const projectedSites = useMemo(() => {
    const radX = (rotX * Math.PI) / 180;
    const R = GLOBE_RADIUS;

    return bodyHeroes.map((hero) => {
      const latRad = (hero.coords.lat * Math.PI) / 180;
      const lonRad = ((hero.coords.lon + rotY) * Math.PI) / 180;

      const uX = Math.cos(latRad) * Math.sin(lonRad);
      const uY = -Math.sin(latRad);
      const uZ = Math.cos(latRad) * Math.cos(lonRad);

      const pX = uX;
      const pY = uY * Math.cos(radX) - uZ * Math.sin(radX);
      const pZ = uY * Math.sin(radX) + uZ * Math.cos(radX);

      const isVisible = pZ > -0.15;
      const screenX = R + pX * R;
      const screenY = R + pY * R;

      const progress = sites[hero.slug];
      const isLit = !!progress?.light;
      const isFound = !!progress?.found;
      const isSelected = selectedHero?.slug === hero.slug;

      return {
        hero,
        screenX,
        screenY,
        pZ,
        isVisible,
        isLit,
        isFound,
        isSelected,
      };
    });
  }, [bodyHeroes, rotX, rotY, sites, selectedHero]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Planetary Sphere */}
      <View
        style={[
          styles.globeSphere,
          {
            width: GLOBE_RADIUS * 2,
            height: GLOBE_RADIUS * 2,
            borderRadius: GLOBE_RADIUS,
            backgroundColor: isMars ? "#8f3014" : "#282930",
            borderColor: isMars ? "#b43d1a" : "#4a4c58",
          },
        ]}
      >
        {/* Atmosphere Shadow Gradient */}
        <View
          style={[
            styles.atmosphereShadow,
            {
              borderRadius: GLOBE_RADIUS,
              backgroundColor: isMars
                ? "rgba(180, 61, 26, 0.15)"
                : "rgba(160, 165, 185, 0.12)",
            },
          ]}
        />

        {/* Decorative Equator & Meridian Rings */}
        <View
          style={[
            styles.equatorRing,
            {
              top: GLOBE_RADIUS - 1,
              transform: [{ rotateX: `${rotX}deg` }],
            },
          ]}
        />

        {/* Craters & Surface Topology */}
        <View
          style={[
            styles.craterCluster,
            {
              transform: [
                { rotateX: `${rotX * 0.4}deg` },
                { rotateY: `${rotY * 0.6}deg` },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.craterMajor,
              isMars ? styles.craterMars : styles.craterMoon,
              { top: "25%", left: "30%", width: 44, height: 28 },
            ]}
          />
          <View
            style={[
              styles.craterMajor,
              isMars ? styles.craterMars : styles.craterMoon,
              { top: "60%", left: "55%", width: 36, height: 22 },
            ]}
          />
          <View
            style={[
              styles.craterMajor,
              isMars ? styles.craterMars : styles.craterMoon,
              { top: "42%", left: "68%", width: 24, height: 16 },
            ]}
          />
        </View>

        {/* 3D Occlusion-Culled Site Beacon Pins */}
        {projectedSites.map((site) => {
          if (!site.isVisible) return null;

          return (
            <Pressable
              key={site.hero.slug}
              onPress={() => {
                onSelectHero(site.hero);
                focusHero(site.hero);
              }}
              hitSlop={12}
              style={[
                styles.pinAnchor,
                {
                  left: site.screenX,
                  top: site.screenY,
                  opacity: Math.max(0.4, Math.min(1, site.pZ + 0.3)),
                  zIndex: Math.round((site.pZ + 1) * 100),
                },
              ]}
            >
              {/* Skyward Light Beam if Memorial Lit */}
              {site.isLit && <View style={styles.lightBeam} />}

              {/* Ping Radar Ring for Selected Site */}
              {site.isSelected && <View style={styles.selectedPing} />}

              {/* Pin Head */}
              <View
                style={[
                  styles.pinHead,
                  site.isSelected && styles.pinHeadSelected,
                  site.isLit && styles.pinHeadLit,
                ]}
              >
                {site.isLit ? (
                  <Ionicons name="flame" size={10} color="#f59e0b" />
                ) : (
                  <View
                    style={[
                      styles.pinDot,
                      site.isFound ? styles.pinDotFound : styles.pinDotUnvisited,
                    ]}
                  />
                )}
              </View>

              {/* Badge Label */}
              <View
                style={[
                  styles.pinLabelWrap,
                  site.isSelected && styles.pinLabelWrapSelected,
                ]}
              >
                <Text
                  style={[
                    styles.pinLabelText,
                    site.isSelected && styles.pinLabelTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {site.hero.name}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  globeSphere: {
    borderWidth: 2,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 12,
  },
  atmosphereShadow: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  equatorRing: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  craterCluster: {
    ...StyleSheet.absoluteFill,
  },
  craterMajor: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
  },
  craterMars: {
    borderColor: "rgba(100, 30, 10, 0.4)",
    backgroundColor: "rgba(70, 20, 5, 0.25)",
  },
  craterMoon: {
    borderColor: "rgba(20, 22, 28, 0.6)",
    backgroundColor: "rgba(15, 16, 20, 0.4)",
  },
  pinAnchor: {
    position: "absolute",
    alignItems: "center",
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  lightBeam: {
    position: "absolute",
    bottom: 12,
    width: 2,
    height: 55,
    backgroundColor: "#f59e0b",
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  selectedPing: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#38bdf8",
    top: -4,
  },
  pinHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  pinHeadSelected: {
    borderColor: "#38bdf8",
    backgroundColor: "#0369a1",
    transform: [{ scale: 1.2 }],
  },
  pinHeadLit: {
    borderColor: "#f59e0b",
    backgroundColor: "rgba(245, 158, 11, 0.2)",
  },
  pinDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pinDotFound: {
    backgroundColor: "#10b981",
  },
  pinDotUnvisited: {
    backgroundColor: "#a855f7",
  },
  pinLabelWrap: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 3,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  pinLabelWrapSelected: {
    borderColor: "#38bdf8",
    backgroundColor: "rgba(3, 105, 161, 0.85)",
  },
  pinLabelText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "600",
  },
  pinLabelTextSelected: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
