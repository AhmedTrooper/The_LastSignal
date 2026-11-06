import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";

export const metadata = generateSEO({
  title: "Privacy Policy | The Last Signal",
  description:
    "Privacy policy and data protection disclosures for The Last Signal mobile application (com.nasa.lastsignal) and web platform.",
  path: "/privacy",
});

export default function PrivacyPolicyPage() {
  return (
    <SitePage
      eyebrow="Legal & Data Protection"
      title="Privacy Policy for The Last Signal"
      scene="about"
    >
      <div className="mx-auto max-w-4xl space-y-10 text-ink" data-reveal>
        {/* Header Metadata */}
        <div className="rounded-2xl border border-line bg-mist p-6 text-sm text-ink-soft">
          <p>
            <strong>Application:</strong> The Last Signal (Mobile &amp; Web)
          </p>
          <p>
            <strong>Android Package Name:</strong>{" "}
            <code className="font-mono text-violet">com.nasa.lastsignal</code>
          </p>
          <p>
            <strong>Developer:</strong> The Last Signal Team
          </p>
          <p>
            <strong>Effective Date:</strong> October 21, 2026
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="display text-2xl">1. Overview</h2>
          <p className="leading-relaxed text-ink-soft">
            <strong>The Last Signal</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is an
            independent educational, historical, and memorial application dedicated to the robotic
            explorers left behind on Mars and the Moon. This Privacy Policy informs users of our mobile
            application (available on Google Play under package identifier{" "}
            <code className="font-mono text-violet">com.nasa.lastsignal</code>) and our official web platforms (
            <a href="https://thelastsignal.mtas.fi" className="text-violet underline hover:text-violet-deep">
              https://thelastsignal.mtas.fi
            </a>{" "}
            and{" "}
            <a href="https://the-last-signal-theta.vercel.app" className="text-violet underline hover:text-violet-deep">
              https://the-last-signal-theta.vercel.app
            </a>
            ) regarding the collection, use, and disclosure of Personal Information.
          </p>
          <p className="leading-relaxed text-ink-soft">
            By installing, accessing, or using the Service, you consent to the collection and use of
            information in accordance with this policy.
          </p>
        </section>

        {/* Information Collection */}
        <section className="space-y-4">
          <h2 className="display text-2xl">2. Information We Collect</h2>
          <div className="space-y-4 text-ink-soft">
            <h3 className="text-lg font-bold text-ink">A. User-Provided Information</h3>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong>Account Credentials (Google Sign-In):</strong> When you sign in using Google, we
                receive your Google display name, email address, and profile photo URL via Firebase
                Authentication. We use this to authenticate your identity and display your avatar next to
                your tributes.
              </li>
              <li>
                <strong>Tribute Messages:</strong> Public messages, memorials, and comments you transmit to
                the memorial downlink wall. These are stored securely in Google Cloud Firestore and made
                visible to other visitors.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-ink">B. Automatically Collected Data</h3>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong>Device &amp; Telemetry Information:</strong> Operating system version, device model,
                app version, screen dimensions, and performance diagnostics to ensure smooth 60 FPS 3D
                flight and rover simulation rendering.
              </li>
              <li>
                <strong>Log &amp; Crash Data:</strong> In case of an unexpected crash or network error,
                anonymous diagnostic stack traces may be collected via Expo Application Services (EAS) to
                remedy technical defects.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-ink">C. Local Storage</h3>
            <p className="leading-relaxed">
              Game saves, flight pilot journals, star ratings, radar telemetry calibration, audio/sound
              preferences, and uncollected echo locations are stored locally on your device via
              AsyncStorage / local storage. This game progress never leaves your device unless synced with
              your account.
            </p>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="display text-2xl">3. How We Use Information</h2>
          <ul className="list-inside list-disc space-y-2 text-ink-soft">
            <li>To provide and maintain the spaceflight simulations and memorial archive.</li>
            <li>To display verified explorer tributes on the planetary memorial transmission wall.</li>
            <li>
              To moderate transmissions, prevent spam, block abusive/offensive language, and enforce
              rate-limiting cooldowns (such as the 60-second transmission interval).
            </li>
            <li>To remember pilot achievements, flight logs, and discovered exploration sites.</li>
            <li>To detect, prevent, and mitigate security threats and software bugs.</li>
          </ul>
        </section>

        {/* Third-Party Services */}
        <section className="space-y-4">
          <h2 className="display text-2xl">4. Third-Party Service Providers</h2>
          <p className="leading-relaxed text-ink-soft">
            We employ reputable third-party infrastructure providers to facilitate our Service. These
            providers have access to your information only to perform specific tasks on our behalf and are
            obligated not to disclose or use it for any other purpose:
          </p>
          <ul className="list-inside list-disc space-y-3 text-ink-soft">
            <li>
              <strong>Google Play Services:</strong> Core application distribution, device compatibility,
              and update delivery.{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet underline hover:text-violet-deep"
              >
                Google Privacy Policy ↗
              </a>
            </li>
            <li>
              <strong>Firebase (Google LLC):</strong> Authentication (Google Sign-In) and Cloud Firestore
              database for real-time tribute downlinks.{" "}
              <a
                href="https://firebase.google.com/support/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet underline hover:text-violet-deep"
              >
                Firebase Privacy &amp; Security ↗
              </a>
            </li>
            <li>
              <strong>Expo (650 Industries, Inc.):</strong> Native runtime framework, haptic feedback, and
              cloud build delivery (EAS).{" "}
              <a
                href="https://expo.dev/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet underline hover:text-violet-deep"
              >
                Expo Privacy Policy ↗
              </a>
            </li>
            <li>
              <strong>Cloudflare:</strong> Public CDN asset distribution (planetary 3D models, audio, and
              archival mission photography).{" "}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet underline hover:text-violet-deep"
              >
                Cloudflare Privacy Policy ↗
              </a>
            </li>
          </ul>
        </section>

        {/* Children's Privacy */}
        <section className="space-y-4">
          <h2 className="display text-2xl">5. Children&rsquo;s Privacy (COPPA)</h2>
          <p className="leading-relaxed text-ink-soft">
            The Last Signal is built for educational and historical exploration of space missions. We do
            not knowingly collect personally identifiable information from children under the age of 13.
            If a parent or guardian becomes aware that their child has provided personal information
            without consent, please contact us immediately, and we will promptly remove such information
            from our servers.
          </p>
        </section>

        {/* Data Retention and Deletion */}
        <section className="space-y-4">
          <h2 className="display text-2xl">6. Account Deletion and Data Retention (Google Play Compliance)</h2>
          <p className="leading-relaxed text-ink-soft">
            In compliance with the <strong>Google Play User Data &amp; Account Deletion Policy</strong> and
            international privacy regulations (including GDPR), we provide both an immediate self-service web tool and
            a direct manual submission channel for users to delete their account and associated data without requiring
            app reinstallation.
          </p>

          <div className="rounded-2xl border border-line bg-mist p-6 space-y-4 text-ink-soft">
            <h3 className="text-base font-bold text-ink">
              Official Account &amp; Data Deletion Options:
            </h3>
            <p className="text-sm">
              Users can delete their account and associated personal data at any time via two official pathways:
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm text-ink-soft">
              <li>
                <strong>In-App Deletion Path (Android):</strong> Open <em>The Last Signal</em> mobile app &rarr; go to <em>About</em> &rarr; scroll to <em>Legal &amp; Account Data</em> &rarr; tap <em>Delete Account &amp; Data</em>.
              </li>
              <li>
                <strong>Web-Based Deletion URL (No App Required):</strong> Access our public account deletion portal below, allowing deletion without opening or reinstalling the mobile app:
              </li>
            </ul>
            <div className="rounded-xl border border-violet/30 bg-white p-4 font-mono text-sm text-violet">
              <Link
                href="/delete-account"
                className="font-bold underline hover:text-violet-deep break-all"
              >
                https://the-last-signal-theta.vercel.app/delete-account
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-white p-4 space-y-2">
                <h4 className="font-bold text-ink text-sm">Method 1: Instant Self-Service</h4>
                <p className="text-xs leading-relaxed">
                  Sign in with Google on our deletion page and confirm. Your Firebase Auth account, Firestore user
                  profile, and all memorial transmissions are permanently deleted in real-time.
                </p>
              </div>
              <div className="rounded-xl border border-line bg-white p-4 space-y-2">
                <h4 className="font-bold text-ink text-sm">Method 2: Manual Request (Email)</h4>
                <p className="text-xs leading-relaxed">
                  Email{" "}
                  <a
                    href="mailto:privacy@thelastsignal.mtas.fi?subject=Account%20Deletion%20Request%20-%20com.nasa.lastsignal"
                    className="font-mono text-violet underline hover:text-violet-deep"
                  >
                    privacy@thelastsignal.mtas.fi
                  </a>{" "}
                  with subject &ldquo;Account Deletion Request - com.nasa.lastsignal&rdquo;. We verify ownership and
                  purge all records within 30 days.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <p className="font-bold text-ink">What data is deleted:</p>
              <ul className="list-inside list-disc space-y-1">
                <li>Google display name, email address, and profile photo URL.</li>
                <li>All public memorial messages, tributes, and comments authored by the user in Cloud Firestore.</li>
                <li>Rate-limiting timestamps and cooldown tracking data.</li>
                <li>Firebase Authentication credentials.</li>
              </ul>
              <p className="font-bold text-ink pt-2">What data is retained:</p>
              <p>
                No personal data is retained following account deletion. Anonymous, aggregate crash metrics (without
                identifying device IDs, IP addresses, or accounts) may be retained purely for system stability.
              </p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="space-y-4">
          <h2 className="display text-2xl">7. Data Security</h2>
          <p className="leading-relaxed text-ink-soft">
            We value your trust. We implement robust, industry-standard administrative and technical
            safeguards, including encryption in transit (HTTPS / TLS 1.3) and strict Firestore Security
            Rules that enforce database-level authorization and validation.
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="space-y-4">
          <h2 className="display text-2xl">8. Changes to This Privacy Policy</h2>
          <p className="leading-relaxed text-ink-soft">
            We may update our Privacy Policy periodically. Any changes will be posted on this page with an
            updated effective date. We advise you to review this page periodically for any updates.
          </p>
        </section>

        {/* Contact Us */}
        <section className="space-y-4">
          <h2 className="display text-2xl">9. Contact Us</h2>
          <p className="leading-relaxed text-ink-soft">
            If you have questions, feedback, or concerns regarding this Privacy Policy or your data, please
            contact us at:
          </p>
          <div className="rounded-xl border border-line bg-mist p-5 font-mono text-sm space-y-1">
            <p><strong>The Last Signal Team</strong></p>
            <p>Website: <a href="https://thelastsignal.mtas.fi" className="text-violet underline hover:text-violet-deep">https://thelastsignal.mtas.fi</a></p>
            <p>Email: <a href="mailto:privacy@thelastsignal.mtas.fi" className="text-violet underline hover:text-violet-deep">privacy@thelastsignal.mtas.fi</a></p>
            <p>
              Account Deletion:{" "}
              <Link href="/delete-account" className="text-violet underline hover:text-violet-deep">
                https://the-last-signal-theta.vercel.app/delete-account
              </Link>
            </p>
            <p>
              Terms of Service:{" "}
              <Link href="/terms" className="text-violet underline hover:text-violet-deep">
                https://the-last-signal-theta.vercel.app/terms
              </Link>
            </p>
          </div>
        </section>
      </div>
    </SitePage>
  );
}
