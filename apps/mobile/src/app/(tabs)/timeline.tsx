import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppBarTheme } from "@/hooks/use-appbar-theme";
import { TimelineList } from "@/features/timeline/components/TimelineList";

export default function TimelineScreen() {
  const appbar = useAppBarTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: appbar.backgroundColor }]} edges={["top", "left", "right"]}>
      <View style={styles.body}>
        <TimelineList />
      </View>
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
});
