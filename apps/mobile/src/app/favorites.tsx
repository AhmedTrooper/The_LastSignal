import { StyleSheet, View } from "react-native";
import { FavoritesList } from "@/features/favorites/components/FavoritesList";

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <FavoritesList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
