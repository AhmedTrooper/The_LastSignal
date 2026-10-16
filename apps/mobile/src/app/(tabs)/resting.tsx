import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RestingList } from "@/features/resting/components/RestingList";

export default function RestingScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <RestingList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
