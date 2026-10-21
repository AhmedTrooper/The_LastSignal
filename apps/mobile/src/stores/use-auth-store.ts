import { create } from "zustand";
import {
  signInAnonymously as firebaseSignInAnonymously,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  deleteUser,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { auth, db } from "@/lib/firebase";

// Ensure any in-flight system browser session (e.g. an open OAuth webview
// from a previous version of the bridge) is closed before we open our own.
WebBrowser.maybeCompleteAuthSession();

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  photoUrl?: string;
  isAnonymous: boolean;
  createdAt: string;
}

// URL of the deployed web app's mobile-auth bridge. This page performs
// `signInWithPopup` against the Web OAuth client (which Google trusts because
// it lives on the verified Vercel domain) and then redirects back into the
// app with a real Firebase `id_token`. The mobile app exchanges that token
// with `signInWithCredential`, which yields a real, verified Firebase session.
//
// Configured via `EXPO_PUBLIC_WEB_BRIDGE_URL` so the URL can be overridden
// per environment (e.g. http://<laptop-lan-ip>:3000 for local testing, or
// the deployed Vercel URL in production). Default points at the prod
// deployment.
const WEB_BRIDGE_BASE_URL =
  process.env.EXPO_PUBLIC_WEB_BRIDGE_URL?.replace(/\/+$/, "") ||
  "https://the-last-signal-theta.vercel.app/auth/mobile";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  /**
   * Process an incoming deep-link URL. Exposed so the root layout can wire it
   * to `Linking.addEventListener('url', …)` and `Linking.getInitialURL()` for
   * both warm and cold starts. Returns true if the URL was a successful
   * sign-in callback (and we should close any open auth-browser).
   */
  handleAuthUrl: (url: string) => Promise<boolean>;
}

// Sync user to Firestore `users/{uid}` collection matching web schema
async function syncFirestoreUserProfile(
  uid: string,
  name: string,
  email: string = "",
  photoUrl: string = ""
) {
  if (!auth.currentUser || auth.currentUser.isAnonymous || auth.currentUser.uid !== uid) {
    return;
  }
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid,
        name: name || "Anonymous",
        email: email || "",
        photoUrl: photoUrl || "",
        status: "active",
        isDeleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(userRef, {
        name: name || "Anonymous",
        photoUrl: photoUrl || "",
        updatedAt: serverTimestamp(),
      });
    }
  } catch {
    // Non-blocking background sync matching apps/web/lib/auth-context.tsx
  }
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Listen to Firebase Auth state changes
  onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      const displayName =
        fbUser.displayName ||
        (fbUser.isAnonymous ? "Anonymous Explorer" : "Verified Explorer");
      const authUser: AuthUser = {
        id: fbUser.uid,
        name: displayName,
        email: fbUser.email || undefined,
        photoUrl: fbUser.photoURL || undefined,
        isAnonymous: fbUser.isAnonymous,
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
      };
      set({ user: authUser, isLoading: false });
      await syncFirestoreUserProfile(
        fbUser.uid,
        displayName,
        fbUser.email || "",
        fbUser.photoURL || ""
      );
    } else {
      // If we don't have a local non-Firebase session, reset to null
      set((state) => (state.user?.isAnonymous ? state : { user: null, isLoading: false }));
    }
  });

  return {
    user: null,
    isLoading: false,

    handleAuthUrl: async (url: string) => {
      try {
        const parsed = Linking.parse(url);
        const q = parsed.queryParams || {};
        const idToken = (q.id_token as string) || (q.token as string);

        if (idToken) {
          // Hand the token to Firebase. This is what creates the real session;
          // the previous version of this function fabricated a local user with
          // `id: g_<email>` — that path was impersonable and matched no
          // Firebase user, so calls to Firestore that required auth would
          // fail.
          try {
            const credential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, credential);
            return true;
          } catch (err) {
            console.warn("Firebase credential exchange failed:", err);
            // Don't fabricate a fake user — surface the failure.
            set({ isLoading: false });
            return false;
          }
        }

        // No token — the URL wasn't a Google sign-in callback.
        return false;
      } catch (err) {
        console.warn("Failed to parse incoming auth URL:", err);
        return false;
      } finally {
        // Always dismiss any open in-app browser whether or not a token was
        // found, so the auth sheet doesn't linger on top of the app.
        try {
          WebBrowser.dismissAuthSession();
          WebBrowser.dismissBrowser();
        } catch {
          // ignore dismiss errors
        }
      }
    },

    signInWithGoogle: async () => {
      set({ isLoading: true });
      try {
        // The deep-link target the bridge will redirect back to. Must match
        // the `scheme` in app.json (thelastsignal) so Android Intent filters
        // and iOS's URL scheme routing wake the app.
        const redirectUri = Linking.createURL("auth");

        // Open the bridge in the system browser (SFSafariViewController on
        // iOS, Custom Tabs on Android). openAuthSessionAsync returns when
        // the browser hands control back to the app via the deep link.
        const bridgeUrl = `${WEB_BRIDGE_BASE_URL}?redirect_uri=${encodeURIComponent(
          redirectUri
        )}`;

        const result = await WebBrowser.openAuthSessionAsync(bridgeUrl, redirectUri);

        if (result.type === "success" && result.url) {
          await get().handleAuthUrl(result.url);
        } else {
          // User dismissed the browser or it was cancelled without a result.
          set({ isLoading: false });
        }
      } catch (err) {
        console.warn("Google sign-in error:", err);
        set({ isLoading: false });
        throw err;
      }
    },

    signInAnonymously: async () => {
      set({ isLoading: true });
      try {
        const fbResult = await firebaseSignInAnonymously(auth);
        if (fbResult.user) {
          const authUser: AuthUser = {
            id: fbResult.user.uid,
            name: "Anonymous Explorer",
            isAnonymous: true,
            createdAt: fbResult.user.metadata.creationTime || new Date().toISOString(),
          };
          set({ user: authUser, isLoading: false });
          await syncFirestoreUserProfile(fbResult.user.uid, "Anonymous Explorer");
          return;
        }
      } catch (err) {
        console.warn("Firebase anonymous auth failed, falling back to local guest:", err);
      }

      // Local offline fallback
      const fallbackUser: AuthUser = {
        id: `anon_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: "Anonymous Explorer",
        isAnonymous: true,
        createdAt: new Date().toISOString(),
      };
      set({ user: fallbackUser, isLoading: false });
    },

    signOut: async () => {
      try {
        await firebaseSignOut(auth);
      } catch {
        // ignore
      }
      set({ user: null, isLoading: false });
    },

    deleteAccount: async () => {
      const currentUser = auth.currentUser;
      const localUser = get().user;

      if (currentUser) {
        try {
          // Delete user document in Firestore
          await deleteDoc(doc(db, "users", currentUser.uid));
        } catch {
          // Non-blocking
        }

        try {
          // Delete from Firebase Auth
          await deleteUser(currentUser);
        } catch (err) {
          console.warn("Firebase delete user warning:", err);
        }
      } else if (localUser?.id) {
        try {
          await deleteDoc(doc(db, "users", localUser.id));
        } catch {
          // Non-blocking
        }
      }

      set({ user: null, isLoading: false });
    },
  };
});
