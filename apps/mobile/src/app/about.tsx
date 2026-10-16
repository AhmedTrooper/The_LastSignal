import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { HEROES } from "@thelastsignal/data";

const RULES = [
  {
    title: "Facts only",
    text: "Every date, number and last word comes from a real mission record, and each hero lists its sources. We never invent quotes.",
  },
  {
    title: "Real imagery",
    text: "We use public-domain mission photos and videos, credited. The images you see today are AI placeholders and are labelled as such.",
  },
  {
    title: "Independent",
    text: "The Last Signal is not affiliated with or endorsed by any space agency, and carries no agency branding.",
  },
  {
    title: "AI is labelled",
    text: "Narration or video made with AI is always marked as AI-made, and is built only from the real record.",
  },
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow} type="small">ABOUT</ThemedText>
        <ThemedText style={styles.title} type="title">
          They had names, birthdays and last words,{"\n"}
          <ThemedText style={styles.titleViolet} type="title">just like us.</ThemedText>
        </ThemedText>
        <Waveform seed="about" bars={36} fade={0.3} height={24} style={{ marginTop: 14 }} />
      </View>

      <View style={styles.leadCard}>
        <ThemedText style={styles.leadText}>
          Rovers, landers and probes went where we couldn&apos;t, and they never came back. Their missions are over, but they are still out there, on the plains of Mars and the dust of the Moon.
        </ThemedText>
        <ThemedText style={styles.leadText}>
          We remember them the way we remember great people: where they were born, the life they lived, what they discovered, and their last signal home. The archive holds {HEROES.length} of them today, from Ranger 7 in 1964 to Ingenuity.
        </ThemedText>
      </View>

      <View style={styles.rulesSection}>
        <ThemedText style={styles.rulesHeading} type="subtitle">Ground Rules</ThemedText>
        {RULES.map((r, i) => (
          <View key={r.title} style={styles.ruleCard}>
            <View style={styles.ruleNumberBadge}>
              <ThemedText style={styles.ruleNumber}>0{i + 1}</ThemedText>
            </View>
            <View style={styles.ruleContent}>
              <ThemedText style={styles.ruleTitle}>{r.title}</ThemedText>
              <ThemedText style={styles.ruleText} type="small">{r.text}</ThemedText>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
  },
  titleViolet: {
    color: Colors.light.violet,
    fontSize: 26,
    fontWeight: "800",
  },
  leadCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
  },
  leadText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.light.text,
  },
  rulesSection: {
    gap: 12,
    marginTop: 8,
  },
  rulesHeading: {
    fontSize: 20,
    fontWeight: "800",
  },
  ruleCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: Colors.light.backgroundElement,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  ruleNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.violet,
    alignItems: "center",
    justifyContent: "center",
  },
  ruleNumber: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13,
    fontFamily: "monospace",
  },
  ruleContent: {
    flex: 1,
    gap: 4,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  ruleText: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
