import { useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { useAuthStore } from "@/stores/use-auth-store";
import { useFavoritesStore } from "@/stores/use-favorites-store";

export default function DeleteAccountScreen() {
  const { user, deleteAccount } = useAuthStore();
  const [deleted, setDeleted] = useState(false);

  const handleInAppDelete = () => {
    haptic.warning();
    Alert.alert(
      "Permanently Delete Account & Data?",
      "This action will permanently delete your explorer profile, revoke your Google login, and clear all local saved data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            await deleteAccount();
            useFavoritesStore.setState({ favorites: [] });
            haptic.success();
            setDeleted(true);
          },
        },
      ]
    );
  };

  const handleClearLocalData = () => {
    haptic.warning();
    Alert.alert(
      "Clear Local Device Storage?",
      "This will remove your saved spacecraft favorites and reset locally cached preferences.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Local Data",
          style: "destructive",
          onPress: () => {
            useFavoritesStore.setState({ favorites: [] });
            haptic.success();
            Alert.alert("Success", "Local device storage and favorites cleared.");
          },
        },
      ]
    );
  };

  const openWebPortal = async () => {
    haptic.light();
    await WebBrowser.openBrowserAsync("https://the-last-signal-theta.vercel.app/delete-account");
  };

  const openMailRequest = () => {
    haptic.light();
    const mailto =
      "mailto:privacy@thelastsignal.mtas.fi?subject=Account%20Deletion%20Request%20-%20com.nasa.lastsignal&body=Please%20permanently%20delete%20my%20account%20and%20all%20associated%20data%20for%20RoverVilla%20(com.nasa.lastsignal).%0A%0AGoogle%20Email:%20";
    Linking.openURL(mailto);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow} type="small">
          ACCOUNT & DATA MANAGEMENT
        </ThemedText>
        <ThemedText style={styles.title} type="title">
          Delete Account & Data
        </ThemedText>
        <ThemedText style={styles.metaText} type="small">
          Package: com.nasa.lastsignal · Google Play Compliant
        </ThemedText>
      </View>

      {/* Compliance Notice */}
      <View style={styles.complianceCard}>
        <ThemedText style={styles.complianceText} type="small">
          In compliance with the Google Play Account Deletion Policy and GDPR, you have the right to permanently erase your profile and all transmitted content.
        </ThemedText>
      </View>

      {/* Success banner if deleted */}
      {deleted ? (
        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle" size={24} color="#059669" />
          <View style={styles.successContent}>
            <ThemedText style={styles.successTitle}>
              Account Deleted Successfully
            </ThemedText>
            <ThemedText style={styles.successText} type="small">
              Your credentials and local records have been purged.
            </ThemedText>
          </View>
        </View>
      ) : user ? (
        /* Active Account Card */
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons
                name={user.isAnonymous ? "person-outline" : "person"}
                size={22}
                color="#ffffff"
              />
            </View>
            <View style={styles.accountInfo}>
              <ThemedText style={styles.accountName}>{user.name}</ThemedText>
              <ThemedText style={styles.accountEmail} type="small">
                {user.email || "Guest Account"}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.warningText} type="small">
            Deleting your account will immediately and permanently erase your explorer profile, authentication session, and all authored memorial transmissions.
          </ThemedText>

          <Pressable
            onPress={handleInAppDelete}
            style={({ pressed }) => [styles.deleteBtn, pressed && styles.cardPressed]}
            accessibilityRole="button"
            accessibilityLabel="Permanently delete account and data"
          >
            <Ionicons name="trash" size={16} color="#ffffff" />
            <ThemedText style={styles.deleteBtnText}>
              Delete My Account & All Data
            </ThemedText>
          </Pressable>
        </View>
      ) : (
        /* Guest / Not Signed In Card */
        <View style={styles.guestCard}>
          <Ionicons name="shield-outline" size={24} color={Colors.light.violet} />
          <ThemedText style={styles.guestTitle}>
            Guest Mode Active
          </ThemedText>
          <ThemedText style={styles.guestText} type="small">
            You are currently browsing as a guest. No cloud account or personal credentials are saved on our servers.
          </ThemedText>
          <Pressable
            onPress={handleClearLocalData}
            style={({ pressed }) => [styles.clearLocalBtn, pressed && styles.cardPressed]}
          >
            <Ionicons name="trash-outline" size={15} color="#be123c" />
            <ThemedText style={styles.clearLocalBtnText} type="small">
              Clear Local Device Storage & Favorites
            </ThemedText>
          </Pressable>
        </View>
      )}

      {/* Alternative Deletion Options */}
      <View style={styles.optionsSection}>
        <ThemedText style={styles.sectionHeading} type="subtitle">
          Additional Deletion Channels
        </ThemedText>

        {/* Web Portal Button */}
        <Pressable
          onPress={openWebPortal}
          style={({ pressed }) => [styles.channelCard, pressed && styles.cardPressed]}
          accessibilityRole="button"
          accessibilityLabel="Open Web Account Deletion Portal"
        >
          <View style={styles.channelIcon}>
            <Ionicons name="globe-outline" size={20} color={Colors.light.violet} />
          </View>
          <View style={styles.channelContent}>
            <ThemedText style={styles.channelTitle}>
              Web Deletion Portal (No App Required)
            </ThemedText>
            <ThemedText style={styles.channelDesc} type="small">
              If you ever uninstall the app, you can delete your data at the-last-signal-theta.vercel.app/delete-account
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.light.textSecondary} />
        </Pressable>

        {/* Email Fallback */}
        <Pressable
          onPress={openMailRequest}
          style={({ pressed }) => [styles.channelCard, pressed && styles.cardPressed]}
          accessibilityRole="button"
          accessibilityLabel="Send email deletion request"
        >
          <View style={styles.channelIcon}>
            <Ionicons name="mail-outline" size={20} color={Colors.light.violet} />
          </View>
          <View style={styles.channelContent}>
            <ThemedText style={styles.channelTitle}>
              Manual Request by Email
            </ThemedText>
            <ThemedText style={styles.channelDesc} type="small">
              Send an email to privacy@thelastsignal.mtas.fi (processed within 30 days)
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.light.textSecondary} />
        </Pressable>
      </View>

      {/* Android System Storage Guide */}
      <View style={styles.guideCard}>
        <ThemedText style={styles.guideTitle} type="subtitle">
          How to Clear App Data on Android
        </ThemedText>
        <ThemedText style={styles.guideStep} type="small">
          1. Open Android Settings → Apps.
        </ThemedText>
        <ThemedText style={styles.guideStep} type="small">
          2. Select RoverVilla.
        </ThemedText>
        <ThemedText style={styles.guideStep} type="small">
          3. Tap Storage & cache → Clear Storage.
        </ThemedText>
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
    fontSize: 26,
    fontWeight: "800",
    color: Colors.light.text,
  },
  metaText: {
    fontFamily: "monospace",
    color: Colors.light.textSecondary,
    fontSize: 11,
  },
  complianceCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  complianceText: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
    fontSize: 12,
  },
  accountCard: {
    backgroundColor: "#fff1f2",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fecdd3",
    gap: 12,
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#be123c",
    alignItems: "center",
    justifyContent: "center",
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#881337",
  },
  accountEmail: {
    color: "#9f1239",
    fontSize: 12,
  },
  warningText: {
    color: "#9f1239",
    lineHeight: 18,
    fontSize: 12,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#e11d48",
    paddingVertical: 12,
    borderRadius: 14,
  },
  deleteBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  successCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#ecfdf5",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#065f46",
  },
  successText: {
    fontSize: 12,
    color: "#047857",
  },
  guestCard: {
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 8,
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  guestText: {
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    fontSize: 12,
  },
  clearLocalBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff1f2",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecdd3",
    marginTop: 4,
  },
  clearLocalBtnText: {
    color: "#be123c",
    fontWeight: "700",
    fontSize: 12,
  },
  optionsSection: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  channelCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  channelIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.light.backgroundSelected,
    alignItems: "center",
    justifyContent: "center",
  },
  channelContent: {
    flex: 1,
    gap: 2,
  },
  channelTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.text,
  },
  channelDesc: {
    color: Colors.light.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  guideCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 6,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  guideStep: {
    color: Colors.light.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
