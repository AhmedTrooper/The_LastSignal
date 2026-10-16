import { StyleSheet, TextInput, View } from "react-native";
import { Colors } from "@/constants/theme";
import { useHeroStore } from "@/stores/use-hero-store";

export function SearchBar() {
  const searchQuery = useHeroStore((s) => s.searchQuery);
  const setSearchQuery = useHeroStore((s) => s.setSearchQuery);

  return (
    <View style={styles.container}>
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search rovers, landers, sites..."
        placeholderTextColor={Colors.light.textSecondary}
        style={styles.input}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  input: {
    fontSize: 15,
    color: Colors.light.text,
    padding: 0,
  },
});
