import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { StoryBookReader } from "@/features/book/components/StoryBookReader";

export default function BookScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <StoryBookReader />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080914",
  },
});
