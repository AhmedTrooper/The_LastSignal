import { useRef, useState } from "react";
import { ScrollView, StyleSheet, View, LayoutChangeEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppBarTheme } from "@/hooks/use-appbar-theme";
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

  const handleMeetHeroes = () => {
    scrollRef.current?.scrollTo({ y: browserOffset, animated: true });
  };

  const handleBrowserLayout = (e: LayoutChangeEvent) => {
    setBrowserOffset(e.nativeEvent.layout.y);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: appbar.backgroundColor }]} edges={["top", "left", "right"]}>
      <ScrollView
        ref={scrollRef}
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
  body: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
