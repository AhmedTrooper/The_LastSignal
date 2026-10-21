import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Waveform } from "@/components/Waveform";
import { Colors } from "@/constants/theme";
import { haptic } from "@/utils/haptics";
import { useAuthStore, type AuthUser } from "@/stores/use-auth-store";

export default function LoginScreen() {
  const router = useRouter();
  const { user, signInWithGoogle, signInAnonymously, signOut } = useAuthStore();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingAnon, setLoadingAnon] = useState(false);

  const handleGoogleSignIn = async () => {
    haptic.selection();
    setLoadingGoogle(true);
    try {
      // Opens the deployed web-bridge in the system browser, which signs in
      // the user and deep-links back with a real Firebase id_token. The store
      // then exchanges it via `signInWithCredential`, so by the time this
      // resolves the auth listener has populated the user.
      await signInWithGoogle();
      haptic.success();
      router.back();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed. Please try again.";
      // Most common cause here: Firebase Web client wasn't rebuilt with the
      // new bridge page that sends `id_token`, or the token round-trip
      // failed (network, expired). Surface, don't silently swallow.
      haptic.warning();
      Alert.alert("Sign-In Failed", message);
      setLoadingGoogle(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    haptic.selection();
    setLoadingAnon(true);
    try {
      await signInAnonymously();
      haptic.success();
      router.back();
    } catch {
      haptic.light();
    } finally {
      setLoadingAnon(false);
    }
  };

  const handleSignOut = async () => {
    haptic.light();
    await signOut();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Image
            source={require("@/assets/images/splash-icon.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        <ThemedText style={styles.eyebrow} type="small">
          DEEP SPACE ARCHIVE · AUTHENTICATION
        </ThemedText>

        <ThemedText style={styles.title} type="title">
          {user ? "Your Explorer Profile" : "Join The Last Signal"}
        </ThemedText>

        <ThemedText style={styles.subtitle} type="small">
          {user
            ? "Your account is active. You can leave permanent tributes on the memorial wall."
            : "Sign in to leave permanent transmissions across Mars and the Moon, or continue exploring as a guest."}
        </ThemedText>

        <Waveform
          seed="login-beacon"
          bars={34}
          fade={0.35}
          height={18}
          color={Colors.light.violet}
          style={{ marginTop: 8 }}
        />
      </View>

      {/* Active User Card (if signed in) */}
      {user ? <ActiveAccountCard user={user} onSignOut={handleSignOut} /> : (
        /* Sign-in Buttons */
        <View style={styles.authActionsCard}>
          {/* Google Sign In — opens the real system account picker via
              expo-auth-session. Only this path yields a verified Firebase
              session; the previous fake account list was removed. */}
          <Pressable
            onPress={handleGoogleSignIn}
            disabled={loadingGoogle || loadingAnon}
            style={({ pressed }) => [
              styles.googleButton,
              pressed && styles.cardPressed,
              loadingGoogle && styles.buttonDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sign in with Google"
          >
            <View style={styles.googleIconCircle}>
              {loadingGoogle ? (
                <ActivityIndicator size="small" color={Colors.light.violet} />
              ) : (
                <Ionicons name="logo-google" size={16} color={Colors.light.violet} />
              )}
            </View>
            <ThemedText style={styles.googleButtonText}>
              {loadingGoogle ? "Opening Google…" : "Sign in with Google"}
            </ThemedText>
          </Pressable>

          {/* Continue Anonymously */}
          <Pressable
            onPress={handleAnonymousSignIn}
            disabled={loadingAnon || loadingGoogle}
            style={({ pressed }) => [
              styles.anonButton,
              pressed && styles.cardPressed,
              (loadingAnon || loadingGoogle) && styles.buttonDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Continue anonymously as guest"
          >
            {loadingAnon ? (
              <ActivityIndicator size="small" color={Colors.light.text} />
            ) : (
              <>
                <Ionicons name="finger-print-outline" size={18} color={Colors.light.text} />
                <ThemedText style={styles.anonButtonText}>
                  Continue Anonymously
                </ThemedText>
              </>
            )}
          </Pressable>

          {/* Features Checklist */}
          <View style={styles.perksList}>
            <View style={styles.perkRow}>
              <Ionicons name="radio-outline" size={15} color={Colors.light.violet} />
              <ThemedText style={styles.perkText} type="small">
                Transmit tributes to Opportunity, Spirit, and Ingenuity
              </ThemedText>
            </View>
            <View style={styles.perkRow}>
              <Ionicons name="bookmark-outline" size={15} color={Colors.light.violet} />
              <ThemedText style={styles.perkText} type="small">
                Save missions to your personal offline archive
              </ThemedText>
            </View>
            <View style={styles.perkRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={15}
                color={Colors.light.violet}
              />
              <ThemedText style={styles.perkText} type="small">
                End-to-end account deletion and data safety compliant
              </ThemedText>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function ActiveAccountCard({
  user,
  onSignOut,
}: {
  user: AuthUser;
  onSignOut: () => void;
}) {
  const router = useRouter();
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Ionicons
            name={user.isAnonymous ? "person-outline" : "checkmark-circle"}
            size={24}
            color="#ffffff"
          />
        </View>
        <View style={styles.profileInfo}>
          <ThemedText style={styles.profileName}>{user.name}</ThemedText>
          <ThemedText style={styles.profileRole} type="small">
            {user.isAnonymous ? "Anonymous Guest" : user.email || "Verified Explorer"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.profileActions}>
        <Pressable
          onPress={() => router.push("/delete-account" as any)}
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.cardPressed]}
        >
          <Ionicons name="trash-outline" size={15} color="#e11d48" />
          <ThemedText style={styles.deleteBtnText} type="small">
            Delete Account
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={onSignOut}
          style={({ pressed }) => [styles.signOutBtn, pressed && styles.cardPressed]}
        >
          <Ionicons
            name="log-out-outline"
            size={15}
            color={Colors.light.textSecondary}
          />
          <ThemedText style={styles.signOutBtnText} type="small">
            Sign Out
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#070814",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  logo: {
    width: 42,
    height: 42,
  },
  eyebrow: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.light.text,
    textAlign: "center",
  },
  subtitle: {
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 320,
  },
  profileCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.line,
    padding: 16,
    gap: 14,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.violet,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.light.text,
  },
  profileRole: {
    color: Colors.light.textSecondary,
  },
  profileActions: {
    flexDirection: "row",
    gap: 10,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fff1f2",
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ffe4e6",
  },
  deleteBtnText: {
    color: "#e11d48",
    fontWeight: "700",
  },
  signOutBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#f4f4f5",
    borderRadius: 12,
    paddingVertical: 10,
  },
  signOutBtnText: {
    color: Colors.light.textSecondary,
    fontWeight: "700",
  },
  authActionsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.light.line,
    padding: 20,
    gap: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.light.violet,
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  googleIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  anonButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  anonButtonText: {
    color: Colors.light.text,
    fontWeight: "700",
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  perksList: {
    marginTop: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.line,
    paddingTop: 14,
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  perkText: {
    flex: 1,
    color: Colors.light.textSecondary,
    lineHeight: 17,
  },
});
