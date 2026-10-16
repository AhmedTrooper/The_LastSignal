import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useTributesStore } from "@/stores/use-tributes-store";
import type { Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroProfileTributes({ hero }: Props) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const { tributes, addTribute } = useTributesStore();

  const heroTributes = tributes.filter((t) => t.heroSlug === hero.slug);

  const handlePost = () => {
    if (!msg.trim()) return;
    addTribute(hero.slug, name, msg);
    setMsg("");
    setName("");
  };

  return (
    <View style={styles.card}>
      <ThemedText style={styles.eyebrow} type="small">TRIBUTES</ThemedText>
      <ThemedText style={styles.title} type="subtitle">Leave a Message</ThemedText>
      <ThemedText style={styles.subtitle} type="small">
        Write a farewell or note of remembrance for {hero.name}.
      </ThemedText>

      {/* Input Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Your name (optional)"
          placeholderTextColor={Colors.light.textSecondary}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder={`Leave your message for ${hero.name}...`}
          placeholderTextColor={Colors.light.textSecondary}
          value={msg}
          onChangeText={setMsg}
          multiline
        />
        <Pressable
          onPress={handlePost}
          disabled={!msg.trim()}
          style={({ pressed }) => [styles.postBtn, (!msg.trim() || pressed) && styles.postBtnDisabled]}
        >
          <ThemedText style={styles.postBtnText}>Post Tribute</ThemedText>
        </Pressable>
      </View>

      {/* Existing Tributes */}
      {heroTributes.length > 0 && (
        <View style={styles.tributesList}>
          {heroTributes.map((item) => (
            <View key={item.id} style={styles.tributeItem}>
              <View style={styles.itemHeader}>
                <ThemedText style={styles.itemAuthor}>{item.name}</ThemedText>
                <ThemedText style={styles.itemDate} type="small">{item.date}</ThemedText>
              </View>
              <ThemedText style={styles.itemMsg}>{item.message}</ThemedText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginTop: -4,
  },
  form: {
    gap: 10,
    marginTop: 4,
  },
  input: {
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.light.text,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  postBtn: {
    backgroundColor: Colors.light.violet,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  postBtnDisabled: {
    opacity: 0.6,
  },
  postBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  tributesList: {
    gap: 10,
    marginTop: 6,
  },
  tributeItem: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 4,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemAuthor: {
    fontWeight: "700",
    fontSize: 13,
    color: Colors.light.violet,
  },
  itemDate: {
    color: Colors.light.textSecondary,
    fontFamily: "monospace",
    fontSize: 11,
  },
  itemMsg: {
    color: Colors.light.text,
    lineHeight: 18,
    fontSize: 13,
  },
});
