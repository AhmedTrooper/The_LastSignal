import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import Link from "next/link";

export const metadata = generateSEO({
  title: "Terms of Service | The Last Signal",
  description:
    "Terms of service, community standards, and operational disclosures for The Last Signal mobile application (com.nasa.lastsignal) and web platform.",
  path: "/terms",
});

export default function TermsOfServicePage() {
  return (
    <SitePage eyebrow="Legal & Usage" title="Terms of Service for The Last Signal" scene="about">
      <div className="mx-auto max-w-4xl space-y-10 text-ink" data-reveal>
        {/* Header Metadata */}
        <div className="rounded-2xl border border-line bg-mist p-6 text-sm text-ink-soft">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
        </div>

        {/* 1. Acceptance of Terms */}
        <section className="space-y-4">
          <h2 className="display text-2xl">1. Acceptance of Terms</h2>
          <p className="leading-relaxed text-ink-soft">
            By downloading, accessing, or using <strong>The Last Signal</strong> mobile application or
            associated web services at{" "}
            <a href="https://thelastsignal.mtas.fi" className="text-violet underline hover:text-violet-deep">
              https://thelastsignal.mtas.fi
            </a>{" "}
            and{" "}
            <a href="https://the-last-signal-theta.vercel.app" className="text-violet underline hover:text-violet-deep">
              https://the-last-signal-theta.vercel.app
            </a>
            , you agree to be bound by these Terms of Service and our{" "}
            <Link href="/privacy" className="text-violet underline hover:text-violet-deep">
              Privacy Policy
            </Link>
            . If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        {/* 2. Educational Space Memorial */}
        <section className="space-y-4">
          <h2 className="display text-2xl">2. Nature of the Service</h2>
          <p className="leading-relaxed text-ink-soft">
            The Last Signal is an independent, non-commercial educational spaceflight memorial and archive dedicated
            to the robotic explorers left behind on Mars, the Moon, and beyond. It provides historical telemetry,
            interactive simulations, archival landing sites, and a worldwide tribute transmission wall.
          </p>
        </section>

        {/* 3. Community Standards & Memorial Wall */}
        <section className="space-y-4">
          <h2 className="display text-2xl">3. Community Standards &amp; Memorial Transmissions</h2>
          <p className="leading-relaxed text-ink-soft">
            Users may post messages, thoughts, and tributes to our planetary memorial downlink wall. By submitting
            content to the memorial wall, you agree:
          </p>
          <ul className="list-inside list-disc space-y-2 text-ink-soft">
            <li>To maintain a respectful, dignified, and memorial-appropriate tone.</li>
            <li>
              Not to submit content that is abusive, harassing, defamatory, vulgar, hateful, or discriminatory.
            </li>
            <li>Not to submit commercial promotions, spam, unsolicited advertisements, or harmful URLs.</li>
            <li>
              To observe automated anti-spam protections, including character limits (maximum 1,000 characters) and
              rate-limiting cooldowns (60 seconds between transmissions).
            </li>
          </ul>
          <p className="leading-relaxed text-ink-soft">
            We reserve the right to moderate, hide, or permanently remove any content that violates these standards.
          </p>
        </section>

        {/* 4. Non-Affiliation Disclaimer */}
        <section className="space-y-4">
          <h2 className="display text-2xl">4. Non-Affiliation with Space Agencies</h2>
          <div className="rounded-xl border border-line bg-mist p-5 text-sm leading-relaxed text-ink-soft">
            <strong>Important Disclaimer:</strong> The Last Signal is an independent memorial project created by
            enthusiasts. It is <strong>not</strong> sponsored, endorsed, or affiliated with NASA (National
            Aeronautics and Space Administration), JPL (Jet Propulsion Laboratory), ESA (European Space Agency),
            JAXA, or any other government or space agency. All trademarks and project names belong to their
            respective owners.
          </div>
        </section>

        {/* 5. Imagery & Intellectual Property */}
        <section className="space-y-4">
          <h2 className="display text-2xl">5. Intellectual Property &amp; Archival Imagery</h2>
          <p className="leading-relaxed text-ink-soft">
            Historical mission photography, planetary elevation data, and audio snippets utilized within the
            application are sourced from public-domain repositories provided by NASA/JPL-Caltech and the Planetary
            Data System. Any artistic reconstructions or synthetic illustrations are explicitly designated with an
            &ldquo;AI&rdquo; badge in compliance with our honesty principles.
          </p>
        </section>

        {/* 6. Account & Data Deletion */}
        <section className="space-y-4">
          <h2 className="display text-2xl">6. Account Termination &amp; Deletion</h2>
          <p className="leading-relaxed text-ink-soft">
            You may discontinue using our application at any time. In accordance with Google Play Developer Policies
            and GDPR, you have the right to permanently purge your account and all memorial transmissions at any
            time using our dedicated tool at{" "}
            <Link href="/delete-account" className="font-semibold text-violet underline hover:text-violet-deep">
              https://the-last-signal-theta.vercel.app/delete-account
            </Link>
            .
          </p>
        </section>

        {/* 7. Limitation of Liability */}
        <section className="space-y-4">
          <h2 className="display text-2xl">7. Limitation of Liability</h2>
          <p className="leading-relaxed text-ink-soft">
            The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without
            warranties of any kind, whether express or implied. To the maximum extent permitted by applicable law,
            The Last Signal Team shall not be liable for any indirect, incidental, special, or consequential damages
            arising from your use or inability to use the Service.
          </p>
        </section>

        {/* 8. Contact Information */}
        <section className="space-y-4">
          <h2 className="display text-2xl">8. Contact Us</h2>
          <p className="leading-relaxed text-ink-soft">
            For legal inquiries, copyright concerns, or support questions regarding these terms, please contact:
          </p>
          <div className="rounded-xl border border-line bg-mist p-5 font-mono text-sm space-y-1">
            <p>
              <strong>The Last Signal Team</strong>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:privacy@thelastsignal.mtas.fi" className="text-violet underline hover:text-violet-deep">
                privacy@thelastsignal.mtas.fi
              </a>
            </p>
            <p>
              Account Deletion:{" "}
              <Link href="/delete-account" className="text-violet underline hover:text-violet-deep">
                https://the-last-signal-theta.vercel.app/delete-account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </SitePage>
  );
}
