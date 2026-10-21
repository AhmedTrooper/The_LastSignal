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

const SECTIONS = [
  {
    title: "1. Overview",
    content:
      "The Last Signal is an independent educational, historical, and memorial application dedicated to the robotic explorers left behind on Mars and the Moon. This Privacy Policy informs users of our mobile application (package identifier com.nasa.lastsignal) regarding the collection, use, and protection of information.",
  },
  {
    title: "2. Information We Collect",
    content:
      "• Account Credentials: When signing in via Google, Firebase Authentication receives your display name, email, and photo URL to identify you and display your tribute author tag.\n• Tributes: Public memorial messages and comments you submit are stored securely in Google Cloud Firestore.\n• Device Telemetry: OS version, device model, app performance diagnostics to ensure smooth 60 FPS 3D rover rendering.\n• Local Storage: Favorites, flight pilot logs, and audio settings are saved on-device.",
  },
  {
    title: "3. How We Use Information",
    content:
      "• To maintain the spaceflight simulations and memorial archive.\n• To display verified explorer tributes on the planetary memorial transmission wall.\n• To moderate transmissions, prevent spam, and enforce rate-limiting cooldowns.\n• To remember pilot achievements and discovered exploration sites.",
  },
  {
    title: "4. Third-Party Service Providers",
    content:
      "• Google Play Services: Core application distribution and updates.\n• Firebase (Google LLC): Authentication and Cloud Firestore database.\n• Expo (650 Industries): Runtime framework, haptics, and cloud build delivery.\n• Cloudflare: Public CDN asset distribution for 3D models and photos.",
  },
  {
    title: "5. Children's Privacy (COPPA)",
    content:
      "The Last Signal is built for educational and historical exploration. We do not knowingly collect personally identifiable information from children under the age of 13. If you believe a child has provided personal information, please contact us for immediate removal.",
  },
  {
    title: "6. Account Deletion & Retention",
    content:
      "You have the right to permanently purge your account and all memorial transmissions at any time. You can do so directly from the 'Delete Account & Data' screen in this app, or on our web portal without needing the app installed.",
  },
  {
    title: "7. Data Security",
    content:
      "We implement industry-standard safeguards, including encryption in transit (TLS 1.3) and strict Firestore Security Rules that enforce database-level authorization and validation.",
  },
];

export default function PrivacyScreen() {
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

  const openWebPolicy = async () => {
    haptic.light();
    await WebBrowser.openBrowserAsync("https://the-last-signal-theta.vercel.app/privacy");
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
      {/* Header Info */}
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow} type="small">
          LEGAL & DATA PROTECTION
        </ThemedText>
        <ThemedText style={styles.title} type="title">
          Privacy Policy
        </ThemedText>
        <ThemedText style={styles.metaText} type="small">
          Package: com.nasa.lastsignal · Effective Oct 21, 2026
        </ThemedText>
      </View>

      {/* Account Deletion Quick Banner */}
      <Pressable
        onPress={() => {
          haptic.light();
          router.push("/delete-account" as any);
        }}
        style={({ pressed }) => [styles.deleteBanner, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel="Navigate to Account Deletion screen"
      >
        <View style={styles.deleteBannerIcon}>
          <Ionicons name="trash-outline" size={18} color="#e11d48" />
        </View>
        <View style={styles.deleteBannerContent}>
          <ThemedText style={styles.deleteBannerTitle}>
            Delete Account & Data
          </ThemedText>
          <ThemedText style={styles.deleteBannerText} type="small">
            Tap here to manage or permanently purge your account →
          </ThemedText>
        </View>
      </Pressable>

      {/* Sections List */}
      <View style={styles.sectionsList}>
        {SECTIONS.map((sec) => (
          <View key={sec.title} style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>{sec.title}</ThemedText>
            <ThemedText style={styles.sectionContent} type="small">
              {sec.content}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Contact & Web Action */}
      <View style={styles.footerCard}>
        <ThemedText style={styles.contactHeading} type="subtitle">
          Contact &amp; Web Version
        </ThemedText>
        <ThemedText style={styles.contactText} type="small">
          For privacy inquiries, email privacy@thelastsignal.mtas.fi. You can also review the full web policy.
        </ThemedText>
        <Pressable
          onPress={openWebPolicy}
          style={({ pressed }) => [styles.webButton, pressed && styles.cardPressed]}
        >
          <Ionicons name="globe-outline" size={16} color="#ffffff" />
          <ThemedText style={styles.webButtonText}>
            Open Policy on the Web
          </ThemedText>
        </Pressable>
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
  deleteBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff1f2",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fecdd3",
  },
  deleteBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffe4e6",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBannerContent: {
    flex: 1,
  },
  deleteBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#be123c",
  },
  deleteBannerText: {
    fontSize: 12,
    color: "#9f1239",
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
    gap: 10,
  },
  contactHeading: {
    fontSize: 16,
    fontWeight: "700",
  },
  contactText: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
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
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
