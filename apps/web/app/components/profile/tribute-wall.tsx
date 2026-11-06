"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/app/components/icons";
import { useAuth } from "@/lib/auth-context";
import { submitTribute, subscribeTributes, type Tribute } from "@/lib/tribute";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TributeWall({
  slug,
  name,
  dark = false,
}: {
  slug: string;
  name: string;
  dark?: boolean;
}) {
  const { user, loading: authLoading, signInWithGoogle, signOutUser } = useAuth();
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 1. Real-time tributes listener
  useEffect(() => {
    const unsubscribe = subscribeTributes(
      (list) => {
        if (Array.isArray(list)) {
          setTributes(list);
        } else {
          setTributes([]);
        }
      },
      (err) => {
        console.warn("Could not fetch tributes:", err);
        setTributes([]);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Check user's lastCommentedAt to restore remaining cooldown on load
  useEffect(() => {
    if (!user) return;

    let mounted = true;
    const checkUserCooldown = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (mounted && userSnap.exists()) {
          const data = userSnap.data();
          if (data?.lastCommentedAt) {
            const lastTime = data.lastCommentedAt.toMillis();
            const elapsed = Math.floor((Date.now() - lastTime) / 1000);
            if (elapsed < 60) {
              setCooldown(60 - elapsed);
            }
          }
        }
      } catch {
        // Ignore read errors
      }
    };

    checkUserCooldown();
    return () => {
      mounted = false;
    };
  }, [user]);

  // 3. 60-Second Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cooldown > 0 || !message.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await submitTribute({
        userId: user.uid,
        userName: user.displayName || "Anonymous Explorer",
        userPhotoUrl: user.photoURL || "",
        text: message,
      });

      setMessage("");
      setCooldown(60);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || "Failed to submit tribute. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = dark
    ? "bg-white/10 text-white placeholder:text-white/50 border-white/10 focus:border-violet-bright"
    : "bg-white border-line focus:border-violet";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      {/* Tribute Form Card */}
      <div className={`rounded-2xl border p-6 ${dark ? "border-white/10 bg-white/5" : "border-line bg-white"}`}>
        {authLoading ? (
          <div className="flex items-center justify-center py-12 text-sm text-ink-soft">
            Checking authentication…
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet/10 text-violet">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-ink"}`}>A kind message goes a long way.</h3>
              <p className={`mt-1 text-xs max-w-xs ${dark ? "text-white/60" : "text-ink-soft"}`}>
                You can read the messages without an account. Sign in with Google if you’d like to add your own.
              </p>
            </div>
            <button
              onClick={() => signInWithGoogle()}
              type="button"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-violet px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-deep active:scale-95"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Profile Header */}
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    width={36}
                    height={36}
                    referrerPolicy="no-referrer"
                    className="rounded-full ring-2 ring-violet/20"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet font-semibold text-white">
                    {(user.displayName || "U")[0]?.toUpperCase()}
                  </span>
                )}
                <div>
                  <p className={`text-sm font-bold ${dark ? "text-white" : "text-ink"}`}>
                    {user.displayName || "Explorer"}
                  </p>
                  <p className={`text-[11px] ${dark ? "text-white/50" : "text-ink-soft"}`}>
                    RoverVilla explorer
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/delete-account"
                  className="text-xs text-red-500/80 hover:text-red-500 underline transition-colors"
                >
                  Delete Account
                </Link>
                <span className={dark ? "text-white/20" : "text-line"}>·</span>
                <button
                  type="button"
                  onClick={() => signOutUser()}
                  className="text-xs text-ink-soft hover:text-red-500 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>

            {/* Tribute Textarea */}
            <div>
              <label className="mb-3 block text-sm font-semibold" htmlFor={`t-msg-${slug}`}>
                What would you like to say to {name}?
              </label>
              <textarea
                id={`t-msg-${slug}`}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError(null);
                }}
                maxLength={1000}
                rows={4}
                required
                placeholder={`A favourite moment, a little thank-you, or something ${name} helped you learn…`}
                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all ${field}`}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className={dark ? "text-white/40" : "text-ink-soft"}>
                  {message.length} / 1000
                </span>
                <span className="font-mono text-[10px] text-ink-soft">
                  A short pause between messages
                </span>
              </div>
            </div>

            {/* Error & Success Feedback */}
            {error && (
              <div role="alert" className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-500">
                {error}
              </div>
            )}
            {success && (
              <div role="status" className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700">
                Your message is on the RoverVilla wall. Thank you for sharing it.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || cooldown > 0 || !message.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-violet-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cooldown > 0 ? (
                <>You can share another message in {cooldown}s</>
              ) : loading ? (
                <>Adding your message…</>
              ) : (
                <>
                  Share my message <ArrowRight />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Live Memorial Tributes Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className={`text-xs font-mono font-bold tracking-wider uppercase ${dark ? "text-white/70" : "text-ink-soft"}`}>
              Messages from explorers ({Array.isArray(tributes) ? tributes.length : 0})
            </h4>
          </div>
        </div>

        <ul className="grid grid-cols-1 content-start gap-3 sm:grid-cols-2" aria-live="polite">
          {!Array.isArray(tributes) || tributes.length === 0 ? (
            <li
              className={`rounded-2xl border border-dashed p-8 text-center text-sm sm:col-span-2 ${
                dark ? "border-white/20 text-white/60" : "border-line text-ink-soft"
              }`}
            >
              No messages yet. There’s room for your little thank-you.
            </li>
          ) : (
            tributes.map((t) => (
              <li
                key={t.id}
                className={`rounded-2xl border p-5 transition-all hover:border-violet/30 ${
                  dark ? "border-white/10 bg-white/5 text-white" : "border-line bg-white text-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  {t.userPhotoUrl ? (
                    <Image
                      src={t.userPhotoUrl}
                      alt={t.userName}
                      width={40}
                      height={40}
                      referrerPolicy="no-referrer"
                      className="rounded-full ring-1 ring-violet/20 object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#ff8a5c,#5b2eff)] font-semibold text-white"
                      aria-hidden
                    >
                      {t.userName[0]?.toUpperCase() || "E"}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{t.userName}</p>
                    <p className="font-mono text-[11px] text-ink-soft">
                      {(() => {
                        try {
                          if (t.createdAt?.toDate) {
                            return t.createdAt.toDate().toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            });
                          }
                          const obj = t.createdAt as unknown as { seconds?: number };
                          if (typeof obj?.seconds === "number") {
                            return new Date(obj.seconds * 1000).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            });
                          }
                        } catch {
                          // fallback below
                        }
                        return "Just now";
                      })()}
                    </p>
                  </div>
                </div>
                {/* Safe string rendering prevents any script injection */}
                <p className="mt-3 text-[14px] leading-relaxed break-words whitespace-pre-wrap">
                  {t.text}
                </p>
              </li>
            ))
          )}
        </ul><p className={`mt-4 text-xs leading-relaxed ${dark ? "text-white/60" : "text-ink-soft"}`}>The shared RoverVilla wall stays here on Earth. These messages are not transmitted to a spacecraft.</p>
      </div>
    </div>
  );
}
