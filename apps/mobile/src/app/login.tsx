import { useState } from "react";
import {
  ActivityIndicator,
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
import { useAuthStore } from "@/stores/use-auth-store";

export default function LoginScreen() {
  const router = useRouter();
  const { user, signInWithGoogle, signInAnonymously, signOut } = useAuthStore();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingAnon, setLoadingAnon] = useState(false);

  const handleGoogleSignIn = async () => {
    haptic.selection();
    setLoadingGoogle(true);
    try {
      await signInWithGoogle();
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        haptic.success();
        router.back();
      }
    } catch {
      haptic.light();
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleAnonymousSignIn = () => {
    haptic.selection();
    setLoadingAnon(true);
    setTimeout(() => {
      signInAnonymously();
      setLoadingAnon(false);
      haptic.success();
      router.back();
    }, 300);
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
      {user ? (
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
              onPress={handleSignOut}
              style={({ pressed }) => [styles.signOutBtn, pressed && styles.cardPressed]}
            >
              <Ionicons name="log-out-outline" size={15} color={Colors.light.textSecondary} />
              <ThemedText style={styles.signOutBtnText} type="small">
                Sign Out
              </ThemedText>
            </Pressable>
          </View>
        </View>
      ) : (
        /* Sign-in Buttons */
        <View style={styles.authActionsCard}>
          {/* Google Sign In */}
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
            {loadingGoogle ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <View style={styles.googleIconCircle}>
                  <Ionicons name="logo-google" size={16} color={Colors.light.violet} />
                </View>
                <ThemedText style={styles.googleButtonText}>
                  Sign in with Google
                </ThemedText>
              </>
            )}
          </Pressable>

          {/* Continue Anonymously */}
          <Pressable
            onPress={handleAnonymousSignIn}
            disabled={loadingGoogle || loadingAnon}
            style={({ pressed }) => [
              styles.anonButton,
              pressed && styles.cardPressed,
              loadingAnon && styles.buttonDisabled,
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
                Save and organize your favorite spacecraft
              </ThemedText>
            </View>
            <View style={styles.perkRow}>
              <Ionicons name="shield-checkmark-outline" size={15} color={Colors.light.violet} />
              <ThemedText style={styles.perkText} type="small">
                No passwords required · Delete data anytime
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      {/* Legal & Policy Links */}
      <View style={styles.legalFooter}>
        <ThemedText style={styles.legalNotice} type="small">
          {"By signing in or continuing as a guest, you agree to The Last Signal's:"}
        </ThemedText>
        <View style={styles.legalLinksRow}>
          <Pressable
            onPress={() => router.push("/terms" as any)}
            accessibilityRole="link"
          >
            <ThemedText style={styles.legalLink} type="small">
              Terms of Service
            </ThemedText>
          </Pressable>
          <ThemedText style={styles.dotSeparator} type="small">
            {"·"}
          </ThemedText>
          <Pressable
            onPress={() => router.push("/privacy" as any)}
            accessibilityRole="link"
          >
            <ThemedText style={styles.legalLink} type="small">
              Privacy Policy
            </ThemedText>
          </Pressable>
          <ThemedText style={styles.dotSeparator} type="small">
            {"·"}
          </ThemedText>
          <Pressable
            onPress={() => router.push("/delete-account" as any)}
            accessibilityRole="link"
          >
            <ThemedText style={styles.legalLinkDelete} type="small">
              Delete Account
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
    padding: 20,
    paddingBottom: 48,
    gap: 20,
  },
  header: {
    alignItems: "center",
    textAlign: "center",
    gap: 8,
    paddingTop: 12,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#070814",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  logo: {
    width: 44,
    height: 44,
  },
  eyebrow: {
    fontFamily: "monospace",
    color: Colors.light.violet,
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.light.text,
    textAlign: "center",
  },
  subtitle: {
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    maxWidth: 320,
  },
  authActionsCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.light.violet,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: Colors.light.violet,
    shadowOffset: { width: 0, height: 3 },
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
    fontSize: 15,
    fontWeight: "700",
  },
  anonButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  anonButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  perksList: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.line,
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  perkText: {
    color: Colors.light.textSecondary,
    fontSize: 12,
  },
  profileCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.violet,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.light.text,
  },
  profileRole: {
    color: Colors.light.textSecondary,
    fontSize: 12,
  },
  profileActions: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.line,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fff1f2",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecdd3",
  },
  deleteBtnText: {
    color: "#be123c",
    fontWeight: "700",
    fontSize: 12,
  },
  signOutBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  signOutBtnText: {
    color: Colors.light.textSecondary,
    fontWeight: "600",
    fontSize: 12,
  },
  legalFooter: {
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
  },
  legalNotice: {
    color: Colors.light.textSecondary,
    fontSize: 11,
    textAlign: "center",
  },
  legalLinksRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legalLink: {
    color: Colors.light.violet,
    fontWeight: "600",
    fontSize: 11,
    textDecorationLine: "underline",
  },
  legalLinkDelete: {
    color: "#e11d48",
    fontWeight: "600",
    fontSize: 11,
    textDecorationLine: "underline",
  },
  dotSeparator: {
    color: Colors.light.textSecondary,
    fontSize: 11,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
