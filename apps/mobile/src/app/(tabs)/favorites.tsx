import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FavoritesList } from "@/features/favorites/components/FavoritesList";

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FavoritesList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
