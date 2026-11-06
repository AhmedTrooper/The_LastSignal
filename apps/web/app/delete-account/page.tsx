import { generateSEO } from "@/lib/seo";
import SitePage from "@/app/components/site-page";
import DeleteAccountContent from "./delete-account-content";

export const metadata = generateSEO({
  title: "Delete Account & Data | The Last Signal",
  description:
    "Request permanent deletion of your account, memorial transmissions, and associated data from The Last Signal (com.nasa.lastsignal) in compliance with Google Play policies.",
  path: "/delete-account",
});

export default function DeleteAccountPage() {
  return (
    <SitePage
      eyebrow="Account & Data Management"
      title="Delete Account & Personal Data"
      scene="about"
      lede="Request permanent deletion of your account, memorial transmissions, and associated profile information from The Last Signal."
    >
      <DeleteAccountContent />
    </SitePage>
  );
}
