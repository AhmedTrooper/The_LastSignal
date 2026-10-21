import { useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";

const TERMS_SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By downloading, accessing, or using The Last Signal mobile application (com.nasa.lastsignal) or web platform, you agree to be bound by these Terms of Service and our Privacy Policy.",
  },
  {
    title: "2. Nature of the Service",
    content:
      "The Last Signal is an independent, non-commercial educational memorial and archive dedicated to humanity's robotic explorers left behind on Mars, the Moon, and beyond.",
  },
  {
    title: "3. Community Standards & Tributes",
    content:
      "• Maintain a respectful, dignified, and memorial-appropriate tone.\n• Do not post defamatory, abusive, vulgar, or discriminatory language.\n• Commercial promotions and unsolicited spam are strictly prohibited.\n• All transmissions are subject to 60-second cooldown rate-limiting and character restrictions.",
  },
  {
    title: "4. Non-Affiliation Disclaimer",
    content:
      "The Last Signal is an independent memorial project created by space enthusiasts. It is not sponsored, endorsed, or affiliated with NASA, JPL-Caltech, ESA, JAXA, or any government space agency.",
  },
  {
    title: "5. Imagery & Intellectual Property",
    content:
      "Historical mission photography, planetary coordinates, and audio records are sourced from public-domain archives provided by NASA and the Planetary Data System. Synthetic reconstructive imagery is explicitly labelled as AI.",
  },
  {
    title: "6. Account Termination & Deletion",
    content:
      "You have the right to permanently delete your account and all associated memorial tributes at any time using our dedicated in-app tool or via our web portal.",
  },
  {
    title: "7. Limitation of Liability",
    content:
      "The service is provided 'AS IS' and 'AS AVAILABLE' without warranties of any kind. The Last Signal Team shall not be liable for any indirect or incidental damages arising from use of the application.",
  },
];

export default function TermsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    haptic.light();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      haptic.success();
    }, 400);
  };

  const openWebTerms = async () => {
    haptic.light();
    await WebBrowser.openBrowserAsync("https://the-last-signal-theta.vercel.app/terms");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.light.violet}
          colors={[Colors.light.violet]}
        />
      }
    >
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow} type="small">
          LEGAL & COMMUNITY STANDARDS
        </ThemedText>
        <ThemedText style={styles.title} type="title">
          Terms of Service
        </ThemedText>
        <ThemedText style={styles.metaText} type="small">
          Package: com.nasa.lastsignal · Effective Oct 21, 2026
        </ThemedText>
      </View>

      <View style={styles.sectionsList}>
        {TERMS_SECTIONS.map((sec) => (
          <View key={sec.title} style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>{sec.title}</ThemedText>
            <ThemedText style={styles.sectionContent} type="small">
              {sec.content}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.footerCard}>
        <ThemedText style={styles.contactHeading} type="subtitle">
          Questions or Support?
        </ThemedText>
        <ThemedText style={styles.contactText} type="small">
          For legal inquiries, contact privacy@thelastsignal.mtas.fi or visit the web terms portal.
        </ThemedText>

        <View style={styles.footerBtns}>
          <Pressable
            onPress={openWebTerms}
            style={({ pressed }) => [styles.webButton, pressed && styles.cardPressed]}
          >
            <Ionicons name="globe-outline" size={16} color="#ffffff" />
            <ThemedText style={styles.webButtonText}>
              Open Terms on the Web
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.push("/delete-account" as any)}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.cardPressed]}
          >
            <Ionicons name="trash-outline" size={15} color="#e11d48" />
            <ThemedText style={styles.deleteButtonText} type="small">
              Delete Account & Data
            </ThemedText>
          </Pressable>
        </View>
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
    gap: 4,
  },
  eyebrow: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.light.text,
  },
  metaText: {
    fontFamily: "monospace",
    color: Colors.light.textSecondary,
    fontSize: 11,
  },
  sectionsList: {
    gap: 12,
  },
  sectionCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  sectionContent: {
    color: Colors.light.textSecondary,
    lineHeight: 20,
    fontSize: 13,
  },
  footerCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
  },
  contactHeading: {
    fontSize: 16,
    fontWeight: "700",
  },
  contactText: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  footerBtns: {
    gap: 8,
    marginTop: 4,
  },
  webButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.violet,
    paddingVertical: 12,
    borderRadius: 14,
  },
  webButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fff1f2",
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#fecdd3",
  },
  deleteButtonText: {
    color: "#be123c",
    fontWeight: "700",
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
