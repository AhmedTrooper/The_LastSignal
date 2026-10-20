"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Syncs user profile with `users/{uid}` collection in Firestore
  const syncUserProfile = async (firebaseUser: User) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Anonymous",
          email: firebaseUser.email || "",
          photoUrl: firebaseUser.photoURL || "",
          status: "active",
          isDeleted: false,
          deactivatedAt: null,
          deletedAt: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(userRef, {
          name: firebaseUser.displayName || "Anonymous",
          photoUrl: firebaseUser.photoURL || "",
          updatedAt: serverTimestamp(),
        });
      }
    } catch {
      // Non-blocking background sync
    }
  };

  useEffect(() => {
    let cancelled = false;

    // getRedirectResult MUST resolve before we consider auth settled. If
    // onAuthStateChanged resolves first it settles on null and the credential
    // that arrives afterwards never produces a fresh user state — the page
    // refreshes but no session is created.
    const init = async () => {
      let redirectUser: User | null = null;
      try {
        const result = await getRedirectResult(auth);
        redirectUser = result?.user ?? null;
      } catch (err) {
        // No redirect in flight, or the user never completed it. Non-blocking,
        // but surfaced so a genuine failure isn't mistaken for "just browsing".
        console.warn("getRedirectResult:", (err as { code?: string })?.code ?? err);
      }

      // Seed state from the redirect credential before subscribing, so the
      // listener never observes a transient null.
      if (redirectUser && !cancelled) {
        setUser(redirectUser);
      }

      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (cancelled) return;
        setUser(currentUser);
        if (currentUser) {
          await syncUserProfile(currentUser);
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    let unsubscribe: (() => void) | undefined;
    init()
      .then((fn) => {
        unsubscribe = fn;
      })
      .catch((err) => {
        console.error("Auth init failed:", err);
      })
      .finally(() => {
        // Safety net: never leave the UI stuck on `loading`, which hides the
        // sign-in button entirely.
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      // Keep signInWithPopup first and synchronous w.r.t. the click handler
      // (callers invoke this from onClick with no preceding await).
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await syncUserProfile(result.user);
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error?.code === "auth/configuration-not-found") {
        const msg =
          "Google Sign-In is not enabled in Firebase Console yet. Please go to Firebase Console > Authentication > Sign-in method, click Google, and enable it.";
        console.error(msg);
        alert(msg);
        return;
      }
      if (error?.code === "auth/popup-closed-by-user") {
        return; // User dismissed; nothing to do.
      }
      if (
        error?.code === "auth/popup-blocked" ||
        error?.code === "auth/operation-not-supported-in-this-environment"
      ) {
        // Browser (Firefox ETP, Safari webviews, mobile browsers) blocked the
        // popup. Fall back to a full-page redirect — completes via
        // getRedirectResult() in the effect above.
        await signInWithRedirect(auth, provider);
        return;
      }
      throw err;
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
