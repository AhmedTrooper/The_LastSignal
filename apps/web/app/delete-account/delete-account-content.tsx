"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { deleteUserDataAndAccount } from "@/lib/account";

export default function DeleteAccountContent() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deletedCount, setDeletedCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!user) return;
    setDeleting(true);
    setError(null);

    const result = await deleteUserDataAndAccount(user);

    if (result.success) {
      setDeletedCount(result.tributesDeleted);
      setDeleteSuccess(true);
      setShowConfirm(false);
    } else {
      setError(result.error || "An error occurred while deleting your account. Please try again.");
    }
    setDeleting(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 text-ink" data-reveal>
      {/* App & Compliance Metadata Badge */}
      <div className="rounded-2xl border border-line bg-mist p-6 text-sm text-ink-soft">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <p>
            <strong>Application:</strong> RoverVilla
          </p>
          <p>
            <strong>Android Package:</strong>{" "}
            <code className="font-mono text-violet">com.nasa.lastsignal</code>
          </p>
          <p>
            <strong>Developer:</strong> RoverVilla Team
          </p>
          <p>
            <strong>Policy Compliance:</strong> Google Play Data Safety &amp; GDPR Right to Erasure
          </p>
        </div>
      </div>

      {/* Both In-App and Web Deletion Pathways (Google Play Compliance) */}
      <section className="rounded-2xl border border-line bg-mist/60 p-6 sm:p-7 space-y-3">
        <h2 className="display text-xl text-ink">Two Ways to Delete Your Account</h2>
        <p className="text-xs sm:text-sm leading-relaxed text-ink-soft">
          In full compliance with Google Play Developer Policies, users may request account and data deletion either from within the Android application or directly through this web page:
        </p>

        <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet/10 text-violet text-xs font-bold">
                1
              </span>
              <h3 className="font-bold text-ink text-sm">In-App Deletion Path</h3>
            </div>
            <p className="text-xs leading-relaxed text-ink-soft">
              Open <strong>RoverVilla</strong> app &rarr; Tap <strong>About</strong> &rarr; Navigate to <strong>Legal &amp; Account Data</strong> &rarr; Tap <strong>Delete Account &amp; Data</strong> to initiate permanent erasure.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-white p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet/10 text-violet text-xs font-bold">
                2
              </span>
              <h3 className="font-bold text-ink text-sm">Web-Based Deletion Path</h3>
            </div>
            <p className="text-xs leading-relaxed text-ink-soft">
              If you have uninstalled the app or prefer the web, use the self-service tool below to sign in with Google and purge your account, profile, and memorial transmissions instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Action Card */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <h2 className="display text-2xl text-ink">Option 1: Instant Self-Service Deletion</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Sign in below to verify account ownership. Once confirmed, your user profile, authentication credentials, and all memorial transmissions will be permanently purged in real-time.
        </p>

        <div className="mt-6">
          {deleteSuccess ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-emerald-800">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                  ✓
                </span>
                <h3 className="text-lg font-bold text-emerald-900">Account Successfully Deleted</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-emerald-800">
                Your authentication record, profile data in Firestore, and {deletedCount ?? 0} memorial tribute(s) have been permanently deleted from our servers.
              </p>
              <div className="mt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : authLoading ? (
            <div className="flex items-center justify-center py-10 text-sm text-ink-soft">
              Checking authentication status…
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-mist/50 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet/10 text-violet">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-base font-bold text-ink">Sign in to Verify Ownership</h3>
              <p className="mt-1 max-w-md text-xs text-ink-soft">
                To prevent unauthorized deletion, please sign in with the Google account used in RoverVilla.
              </p>
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="mt-5 inline-flex items-center gap-3 rounded-full bg-violet px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-deep active:scale-95"
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
                Sign in with Google to Continue
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active User Summary */}
              <div className="flex flex-col gap-4 rounded-xl border border-line bg-mist p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={44}
                      height={44}
                      referrerPolicy="no-referrer"
                      className="rounded-full ring-2 ring-violet/20"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-violet font-semibold text-white">
                      {(user.displayName || "U")[0]?.toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-ink">{user.displayName || "Explorer"}</p>
                    <p className="text-xs text-ink-soft">{user.email}</p>
                  </div>
                </div>
                <span className="inline-flex self-start sm:self-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                  Ownership Verified
                </span>
              </div>

              {/* Data Deletion Summary Warning */}
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 text-xs text-red-900 space-y-2">
                <p className="font-bold uppercase tracking-wider text-red-700">Warning: Permanent Action</p>
                <p>
                  Deleting your account will immediately and irrevocably delete:
                </p>
                <ul className="list-inside list-disc space-y-1 pl-1">
                  <li>Your user profile and settings record in Cloud Firestore</li>
                  <li>All memorial tributes, comments, and transmissions authored by your account</li>
                  <li>Your Firebase Authentication credentials and Google account linkage</li>
                  <li>Your cooldown records and transmission history</li>
                </ul>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600">
                  {error}
                </div>
              )}

              {/* Delete trigger or Confirmation Dialog */}
              {!showConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete My Account &amp; All Data
                </button>
              ) : (
                <div className="rounded-xl border border-red-300 bg-red-100/50 p-5 space-y-3">
                  <p className="text-sm font-bold text-red-900">
                    Are you absolutely sure you want to delete your account?
                  </p>
                  <p className="text-xs text-red-800">
                    This action cannot be undone. All your memorial messages and account data will be permanently wiped.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleDelete}
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting ? "Deleting account and data…" : "Yes, Permanently Delete Everything"}
                    </button>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => setShowConfirm(false)}
                      className="rounded-full border border-line bg-white px-5 py-2.5 text-xs font-semibold text-ink hover:bg-mist"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Manual Request Fallback (Google Play Policy Requirement) */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8 space-y-4">
        <h2 className="display text-2xl text-ink">Option 2: Manual Deletion Request (By Email)</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          If you have uninstalled the app, lost access to your Google account, or prefer to submit a manual deletion request, our data protection officer will process your request within <strong>30 days</strong> in accordance with Google Play Developer Policy.
        </p>

        <div className="rounded-xl border border-line bg-mist p-5 text-sm space-y-2">
          <p><strong>How to request manual deletion:</strong></p>
          <ol className="list-inside list-decimal space-y-2 text-ink-soft text-xs sm:text-sm">
            <li>
              Send an email to{" "}
              <a
                href="mailto:privacy@thelastsignal.mtas.fi?subject=Account%20Deletion%20Request%20-%20com.nasa.lastsignal&body=Please%20permanently%20delete%20my%20account%20and%20all%20associated%20data%20for%20RoverVilla%20(com.nasa.lastsignal).%0A%0AMy%20Google%20Email:%20%0AApproximate%20date%20of%20last%20tribute%20(if%20any):%20"
                className="font-mono text-violet underline hover:text-violet-deep"
              >
                privacy@thelastsignal.mtas.fi
              </a>
              .
            </li>
            <li>Use the subject line: <code className="font-mono text-violet">Account Deletion Request - com.nasa.lastsignal</code></li>
            <li>Send the message from the email address linked to your Google Account so we can verify ownership.</li>
            <li>Include any specific details (such as your display name or approximate tribute dates).</li>
          </ol>
          <div className="pt-2">
            <a
              href="mailto:privacy@thelastsignal.mtas.fi?subject=Account%20Deletion%20Request%20-%20com.nasa.lastsignal&body=Please%20permanently%20delete%20my%20account%20and%20all%20associated%20data%20for%20RoverVilla%20(com.nasa.lastsignal).%0A%0AMy%20Google%20Email:%20%0AApproximate%20date%20of%20last%20tribute%20(if%20any):%20"
              className="inline-flex items-center gap-2 rounded-full border border-violet bg-violet/5 px-5 py-2.5 text-xs font-semibold text-violet hover:bg-violet hover:text-white transition-colors"
            >
              ✉ Draft Deletion Request Email
            </a>
          </div>
        </div>
      </section>

      {/* Comprehensive Data Types & Retention Table */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8 space-y-4">
        <h2 className="display text-2xl text-ink">3. Data Types &amp; Retention Policies</h2>
        <p className="text-sm text-ink-soft">
          The table below explains what information is collected, how it is stored, and what happens when an account deletion is executed.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-line text-ink-soft">
                <th className="py-3 pr-4 font-semibold">Data Category</th>
                <th className="py-3 pr-4 font-semibold">Specific Fields</th>
                <th className="py-3 pr-4 font-semibold">Storage Location</th>
                <th className="py-3 font-semibold">Action Upon Deletion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink-soft">
              <tr>
                <td className="py-3 pr-4 font-semibold text-ink">Account Credentials</td>
                <td className="py-3 pr-4">Email, Display Name, Photo URL</td>
                <td className="py-3 pr-4">Firebase Auth &amp; Firestore</td>
                <td className="py-3 text-red-600 font-medium">Permanently deleted immediately</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-ink">Memorial Transmissions</td>
                <td className="py-3 pr-4">Public tribute messages, hero associations, timestamps</td>
                <td className="py-3 pr-4">Cloud Firestore</td>
                <td className="py-3 text-red-600 font-medium">All user tributes removed</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-ink">Rate Limiting &amp; State</td>
                <td className="py-3 pr-4">Last commented timestamp, cooldown counters</td>
                <td className="py-3 pr-4">Cloud Firestore</td>
                <td className="py-3 text-red-600 font-medium">Permanently purged</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-ink">Offline Game State</td>
                <td className="py-3 pr-4">Touchdown / rover flight journal, sound settings</td>
                <td className="py-3 pr-4">On-device local storage (AsyncStorage)</td>
                <td className="py-3 text-ink">Cleared by clearing app cache or uninstalling app</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-ink">Diagnostic Telemetry</td>
                <td className="py-3 pr-4">Aggregated crash occurrences (anonymous, no user IDs)</td>
                <td className="py-3 pr-4">EAS / Application hosting</td>
                <td className="py-3 text-ink">Retained in aggregate without personal identifiers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Local App Storage Instructions */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8 space-y-4">
        <h2 className="display text-2xl text-ink">4. How to Clear Local Data on Android</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          If you also want to remove locally cached game states, radar calibration settings, or sound preferences from your Android device:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-xs sm:text-sm text-ink-soft">
          <li>Open your device&rsquo;s <strong>Settings</strong> app.</li>
          <li>Tap <strong>Apps</strong> (or <strong>Apps &amp; Notifications</strong>).</li>
          <li>Select <strong>RoverVilla</strong> from the list.</li>
          <li>Tap <strong>Storage &amp; cache</strong>.</li>
          <li>Tap <strong>Clear Storage</strong> (or <strong>Clear Data</strong>), then confirm.</li>
          <li>Alternatively, simply uninstall the application.</li>
        </ol>
      </section>

      {/* Footer Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line text-xs font-mono text-ink-soft">
        <Link href="/privacy" className="text-violet hover:underline">
          ← View Full Privacy Policy
        </Link>
        <Link href="/terms" className="text-violet hover:underline">
          View Terms of Service →
        </Link>
      </div>
    </div>
  );
}
