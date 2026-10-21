"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

function MobileAuthBridgeContent() {
  const searchParams = useSearchParams();
  // Default to the Expo dev scheme. In a standalone install, Expo Router
  // exposes this same scheme via Linking.createURL("auth").
  const redirectUri = searchParams.get("redirect_uri") || "thelastsignal://auth";
  const [status, setStatus] = useState<"loading" | "prompt" | "success" | "error">("prompt");
  const [errorMessage, setErrorMessage] = useState("");
  const [appRedirectUrl, setAppRedirectUrl] = useState("");

  // Send the user back to the mobile app with a REAL Firebase id_token.
  // The app will pass that token to signInWithCredential, creating a real,
  // verified Firebase session. This replaces the previous version which only
  // forwarded name/email/uid and let the app fabricate its own user.
  const returnToAppWithCredential = async (user: User, idToken: string) => {
    setStatus("success");
    const name = encodeURIComponent(user.displayName || "Explorer");
    const email = encodeURIComponent(user.email || "");
    const photo = encodeURIComponent(user.photoURL || "");
    const uid = encodeURIComponent(user.uid);
    const token = encodeURIComponent(idToken);
    const separator = redirectUri.includes("?") ? "&" : "?";
    const target = `${redirectUri}${separator}name=${name}&email=${email}&photo=${photo}&uid=${uid}&id_token=${token}`;
    setAppRedirectUrl(target);

    // Try automatic redirect
    try {
      window.location.href = target;
    } catch {
      // User can click button if automatic redirect is blocked
    }
  };

  useEffect(() => {
    // If we just returned from a redirect-flow sign-in, finish it now.
    getRedirectResult(auth)
      .then(async (res) => {
        if (res) {
          try {
            // The Google-issued id_token is on the OAuth credential, not on
            // user.getIdToken() (which returns Firebase's own session token,
            // iss: securetoken.google.com). Firebase validates the Google
            // id_token only when the credential is presented directly.
            const credential = GoogleAuthProvider.credentialFromResult(res);
            const googleIdToken = credential?.idToken;
            if (res.user && googleIdToken) {
              await returnToAppWithCredential(res.user, googleIdToken);
            }
          } catch (err) {
            console.warn("Failed to extract Google id_token after redirect:", err);
            setStatus("error");
            setErrorMessage("We couldn't refresh your session. Please try again.");
          }
        }
      })
      .catch((err) => {
        console.warn("Redirect result:", err);
      });
  }, []);

  const triggerGoogleSignIn = async () => {
    setStatus("loading");
    setErrorMessage("");

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleIdToken = credential?.idToken;
      if (result.user && googleIdToken) {
        await returnToAppWithCredential(result.user, googleIdToken);
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (
        e?.code === "auth/popup-blocked" ||
        e?.code === "auth/operation-not-supported-in-this-environment"
      ) {
        await signInWithRedirect(auth, provider);
        return;
      }
      if (e?.code === "auth/popup-closed-by-user") {
        // User dismissed; return to the prompt state without an error.
        setStatus("prompt");
        return;
      }
      setStatus("error");
      setErrorMessage(e?.message || "Google sign-in was interrupted. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070814] px-4 text-white">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5b2eff]/20 text-[#7a57ff]">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>

        <h1 className="text-xl font-bold">The Last Signal</h1>
        <p className="mt-1 text-xs text-white/60">
          Choose your Google Account to authenticate the mobile app
        </p>

        {status === "success" ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-emerald-500/20 p-4 text-xs font-semibold text-emerald-300">
              ✓ Authenticated! Returning to The Last Signal app…
            </div>
            {appRedirectUrl ? (
              <a
                href={appRedirectUrl}
                className="inline-block w-full rounded-full bg-[#5b2eff] px-5 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#6d42ff]"
              >
                Tap here to return to app →
              </a>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <button
              onClick={triggerGoogleSignIn}
              disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-gray-900 shadow-md transition-all hover:bg-gray-100 active:scale-95 disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {status === "loading" ? "Opening Google..." : "Choose Google Account"}
            </button>

            {errorMessage ? (
              <p className="text-xs text-rose-400">{errorMessage}</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MobileAuthBridgePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070814]" />}>
      <MobileAuthBridgeContent />
    </Suspense>
  );
}
