import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimelineList } from "@/features/timeline/components/TimelineList";

export default function TimelineScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <TimelineList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
