import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeroList } from "@/features/heroes/components/HeroList";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <HeroList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
