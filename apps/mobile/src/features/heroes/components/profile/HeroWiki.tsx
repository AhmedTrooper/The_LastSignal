import { useState } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { WIKI, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroWiki({ hero }: Props) {
  const wiki = WIKI[hero.slug];
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!wiki) return null;

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <View style={styles.card}>
      <ThemedText style={styles.eyebrow} type="small">ARCHIVE WIKI</ThemedText>
      <ThemedText style={styles.title} type="subtitle">Full Mission Story</ThemedText>
      <ThemedText style={styles.lead}>{wiki.lead}</ThemedText>

      {/* Facts Infobox */}
      <View style={styles.infobox}>
        <ThemedText style={styles.infoboxTitle} type="small">KEY FACTS</ThemedText>
        <View style={styles.factsList}>
          {wiki.facts.map((f) => (
            <View key={f.label} style={styles.factRow}>
              <ThemedText style={styles.factLabel} type="small">{f.label}</ThemedText>
              <ThemedText style={styles.factValue} type="small">{f.value}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      {/* Sections Accordion */}
      <View style={styles.sectionsContainer}>
        {wiki.sections.map((sec) => {
          const isOpen = expandedSection === sec.id;
          return (
            <View key={sec.id} style={styles.accordionItem}>
              <Pressable
                onPress={() => toggleSection(sec.id)}
                style={styles.accordionHeader}
              >
                <ThemedText style={styles.accordionTitle}>{sec.title}</ThemedText>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={Colors.light.violet}
                />
              </Pressable>
              {isOpen && (
                <View style={styles.accordionBody}>
                  {sec.paras.map((p, i) => (
                    <ThemedText key={i} style={styles.paraText}>
                      {p}
                    </ThemedText>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Timeline */}
      {wiki.timeline && wiki.timeline.length > 0 && (
        <View style={styles.timelineSection}>
          <ThemedText style={styles.sectionHeader} type="small">MISSION TIMELINE</ThemedText>
          <View style={styles.timelineList}>
            {wiki.timeline.map((item, idx) => (
              <View key={`${item.date}-${idx}`} style={styles.timelineRow}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <ThemedText style={styles.timelineDate}>{item.date}</ThemedText>
                  <ThemedText style={styles.timelineText} type="small">{item.text}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Verified Sources */}
      {wiki.sources && wiki.sources.length > 0 && (
        <View style={styles.sourcesSection}>
          <ThemedText style={styles.sectionHeader} type="small">VERIFIED SOURCES</ThemedText>
          <View style={styles.sourcesList}>
            {wiki.sources.map((s) => (
              <Pressable
                key={s.url}
                onPress={() => Linking.openURL(s.url)}
                style={styles.sourceItem}
              >
                <Ionicons name="link-outline" size={14} color={Colors.light.violet} />
                <ThemedText style={styles.sourceText} numberOfLines={1}>{s.label}</ThemedText>
              </Pressable>
            ))}
          </View>
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
  lead: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.light.text,
  },
  infobox: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 8,
  },
  infoboxTitle: {
    fontWeight: "800",
    color: Colors.light.textSecondary,
    letterSpacing: 1,
  },
  factsList: {
    gap: 6,
  },
  factRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  factLabel: {
    color: Colors.light.textSecondary,
    flex: 1,
  },
  factValue: {
    fontWeight: "600",
    color: Colors.light.text,
    textAlign: "right",
    flex: 1,
  },
  sectionsContainer: {
    gap: 8,
    marginTop: 4,
  },
  accordionItem: {
    borderWidth: 1,
    borderColor: Colors.light.line,
    borderRadius: 14,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: Colors.light.backgroundElement,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.text,
    flex: 1,
  },
  accordionBody: {
    padding: 14,
    backgroundColor: "#ffffff",
    gap: 10,
  },
  paraText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.light.textSecondary,
  },
  sectionHeader: {
    fontWeight: "800",
    color: Colors.light.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  timelineSection: {
    marginTop: 8,
  },
  timelineList: {
    gap: 10,
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: "row",
    gap: 12,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.violet,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
    gap: 2,
  },
  timelineDate: {
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.violet,
  },
  timelineText: {
    color: Colors.light.text,
    lineHeight: 18,
  },
  sourcesSection: {
    marginTop: 8,
  },
  sourcesList: {
    gap: 6,
  },
  sourceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  sourceText: {
    fontSize: 13,
    color: Colors.light.violet,
    fontWeight: "500",
  },
});
