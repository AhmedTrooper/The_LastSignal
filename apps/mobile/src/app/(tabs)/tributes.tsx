import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppBarTheme } from "@/hooks/use-appbar-theme";
import { TributesView } from "@/features/tributes/components/TributesView";

export default function TributesScreen() {
  const appbar = useAppBarTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: appbar.backgroundColor }]} edges={["top", "left", "right"]}>
      <View style={styles.body}>
        <TributesView />
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
