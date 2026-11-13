import { useCallback, useRef, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  LayoutChangeEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useAppBarTheme } from "@/hooks/use-appbar-theme";
import { useFavoritesStore } from "@/stores/use-favorites-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { haptic } from "@/utils/haptics";
import { HomeHero } from "@/features/home/components/HomeHero";
import { HomeTicker } from "@/features/home/components/HomeTicker";
import { HomeFamous } from "@/features/home/components/HomeFamous";
import { HomeWorlds } from "@/features/home/components/HomeWorlds";
import { HomeLastSignals } from "@/features/home/components/HomeLastSignals";
import { HomeModelTeaser } from "@/features/home/components/HomeModelTeaser";
import { HomeGameStrip } from "@/features/home/components/HomeGameStrip";
import { HomeRestingTeaser } from "@/features/home/components/HomeRestingTeaser";
import { HomeHeroBrowser } from "@/features/home/components/HomeHeroBrowser";
import { HomeFooter } from "@/features/home/components/HomeFooter";

export default function HomeScreen() {
  const appbar = useAppBarTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [browserOffset, setBrowserOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const favorites = useFavoritesStore((s) => s.favorites);
  const user = useAuthStore((s) => s.user);

  const handleMeetHeroes = () => {
    scrollRef.current?.scrollTo({ y: browserOffset, animated: true });
  };

  const handleBrowserLayout = (e: LayoutChangeEvent) => {
    setBrowserOffset(e.nativeEvent.layout.y);
  };

  const onRefresh = useCallback(() => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      haptic.success();
    }, 700);
  }, []);

  const handleGamesPress = () => {
    haptic.light();
    router.push("/games" as any);
  };

  const handleFavoritesPress = () => {
    haptic.light();
    router.push("/favorites" as any);
  };

  const handleAccountPress = () => {
    haptic.light();
    router.push("/login" as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: appbar.backgroundColor }]} edges={["top", "left", "right"]}>
      {/* Native App Bar Header */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Image
            source={require("@/assets/images/splash-icon.png")}
            style={styles.brandLogo}
            contentFit="contain"
          />
          <View>
            <ThemedText style={styles.brandTitle}>RoverVilla</ThemedText>
            <ThemedText style={styles.brandTagline} type="small">Deep Space Archive</ThemedText>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleGamesPress}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            accessibilityLabel="Games Hub"
          >
            <Ionicons name="game-controller-outline" size={20} color="#0f172a" />
          </Pressable>

          <Pressable
            onPress={handleFavoritesPress}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            accessibilityLabel="Saved Spacecraft"
          >
            <Ionicons name="bookmark-outline" size={20} color="#0f172a" />
            {favorites.length > 0 && (
              <View style={styles.badgeCount}>
                <ThemedText style={styles.badgeCountText}>{favorites.length}</ThemedText>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={handleAccountPress}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            accessibilityLabel="Explorer Account"
          >
            <Ionicons
              name={user ? (user.isAnonymous ? "person-outline" : "person") : "person-circle-outline"}
              size={20}
              color={user && !user.isAnonymous ? Colors.light.violet : "#0f172a"}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.light.violet}
            colors={[Colors.light.violet]}
          />
        }
      >
        <HomeHero onMeetHeroesPress={handleMeetHeroes} />
        <HomeTicker />
        <HomeFamous />
        <HomeWorlds />
        <HomeLastSignals />
        <HomeModelTeaser />
        <HomeGameStrip />
        <HomeRestingTeaser />
        <View onLayout={handleBrowserLayout}>
          <HomeHeroBrowser />
        </View>
        <HomeFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.light.violet,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionBtn: {
    position: "relative",
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
  badgeCount: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: Colors.light.violet,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeCountText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
  },
  body: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
