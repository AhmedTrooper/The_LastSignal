import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { Waveform } from "@/components/Waveform";
import { portrait, assetUrl, type Hero } from "@thelastsignal/data";
import { useGameStore } from "@/stores/use-game-store";

interface DiscoveryModalProps {
  hero: Hero;
  visible: boolean;
  onFinish: () => void;
}

export function DiscoveryModal({
  hero,
  visible,
  onFinish,
}: DiscoveryModalProps) {
  const { recordFound, lightBeacon, sites } = useGameStore();
  const siteState = sites[hero.slug];
  const [isBeaconLit, setIsBeaconLit] = useState(!!siteState?.light);

  const handleIgnite = () => {
    haptic.success();
    recordFound(hero.slug, 3);
    lightBeacon(hero.slug);
    setIsBeaconLit(true);
  };

  const handleReturn = () => {
    haptic.light();
    onFinish();
  };

  const photoUrl = assetUrl(`images/${portrait(hero)}.jpg`);

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.root}>
        {/* Skyward Light Beam when Beacon is Lit */}
        {isBeaconLit && (
          <View style={styles.beaconSkyBeam} pointerEvents="none" />
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Tag */}
          <View style={styles.headerBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.headerBadgeText}>
              EXPLORER DISCOVERY PROTOCOL
            </Text>
          </View>

          {/* Machine Name & Title */}
          <View style={styles.titleSection}>
            <Text style={styles.heroName}>{hero.name}</Text>
            <Text style={styles.heroDesignation}>
              {hero.designation} • {hero.restingPlace}
            </Text>
          </View>

          {/* Documentary Photo Card */}
          <View style={styles.photoCard}>
            <Image
              source={{ uri: photoUrl }}
              style={styles.photo}
              contentFit="cover"
            />
            <View style={styles.photoOverlay}>
              <View style={styles.photoTag}>
                <Ionicons name="camera-outline" size={12} color="#ffffff" />
                <Text style={styles.photoTagText}>ARCHIVAL PHOTOGRAPHY</Text>
              </View>
            </View>
          </View>

          {/* Final Mission Radio Transmission */}
          <View style={styles.storyCard}>
            <View style={styles.storyHeader}>
              <Ionicons name="radio" size={16} color="#38bdf8" />
              <Text style={styles.storyLabel}>LAST RADIO TRANSMISSION</Text>
            </View>
            <Text style={styles.storyQuote}>&ldquo;{hero.end.story}&rdquo;</Text>
            <Text style={styles.storyMeta}>
              Mission End: {hero.end.label}
            </Text>
            <Waveform
              seed={hero.slug}
              bars={28}
              color="#38bdf8"
              height={18}
              style={styles.waveform}
            />
          </View>

          {/* Mission Stats Bento */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>COORDINATES</Text>
              <Text style={styles.statVal}>
                {hero.coords.lat.toFixed(2)}°, {hero.coords.lon.toFixed(2)}°
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BODY</Text>
              <Text style={styles.statVal}>{hero.body.toUpperCase()}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BUILDER</Text>
              <Text style={styles.statVal}>{hero.builder}</Text>
            </View>
          </View>

          {/* Beacon Ignition CTA */}
          <View style={styles.actionSection}>
            {isBeaconLit ? (
              <View style={styles.litConfirmedBox}>
                <View style={styles.litRow}>
                  <Ionicons name="flame" size={24} color="#f59e0b" />
                  <View style={styles.litTextCol}>
                    <Text style={styles.litTitle}>
                      MEMORIAL BEACON IGNITED
                    </Text>
                    <Text style={styles.litSub}>
                      A permanent pillar of light now shines into deep space,
                      visible from planetary orbit.
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={handleReturn}
                  style={styles.returnBtn}
                >
                  <Ionicons name="planet-outline" size={18} color="#ffffff" />
                  <Text style={styles.returnBtnText}>
                    RETURN TO ORBITAL TRACKER
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handleIgnite}
                style={({ pressed }) => [
                  styles.igniteBtn,
                  pressed && styles.igniteBtnPressed,
                ]}
              >
                <Ionicons name="flame" size={22} color="#ffffff" />
                <View style={styles.igniteTextCol}>
                  <Text style={styles.igniteTitle}>
                    IGNITE MEMORIAL BEACON
                  </Text>
                  <Text style={styles.igniteSub}>
                    Honor {hero.name} with an eternal light beam
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#070814",
  },
  beaconSkyBeam: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 6,
    marginLeft: -3,
    backgroundColor: "#f59e0b",
    opacity: 0.35,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
    gap: 16,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    borderColor: "rgba(56, 189, 248, 0.3)",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#38bdf8",
  },
  headerBadgeText: {
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  titleSection: {
    gap: 4,
  },
  heroName: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
  },
  heroDesignation: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontWeight: "700",
  },
  photoCard: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
  },
  photoTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  photoTagText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  storyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 8,
  },
  storyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  storyLabel: {
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  storyQuote: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
    fontWeight: "600",
  },
  storyMeta: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
    fontWeight: "700",
  },
  waveform: {
    marginTop: 4,
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  statVal: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  actionSection: {
    marginTop: 8,
  },
  igniteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#ea580c",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: "#ea580c",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  igniteBtnPressed: {
    backgroundColor: "#c2410c",
    transform: [{ scale: 0.98 }],
  },
  igniteTextCol: {
    alignItems: "flex-start",
  },
  igniteTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  igniteSub: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 10,
    fontWeight: "600",
  },
  litConfirmedBox: {
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    borderColor: "rgba(245, 158, 11, 0.4)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  litRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  litTextCol: {
    flex: 1,
    gap: 2,
  },
  litTitle: {
    color: "#f59e0b",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  litSub: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 11,
    lineHeight: 15,
  },
  returnBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.violet,
    borderRadius: 14,
    paddingVertical: 14,
  },
  returnBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
