import Link from "next/link";
import SitePage from "@/app/components/site-page";
import { ArrowRight } from "@/app/components/icons";

export default function NotFound() {
  return <SitePage eyebrow="404 / A little detour" title="This page wandered off into space." lede="Nothing to worry about. There’s another story waiting just around the corner." scene="map"><div className="flex flex-wrap gap-4"><Link href="/" className="club-button club-button-primary">Back to the clubhouse <ArrowRight className="h-4 w-4" /></Link><Link href="/story" className="club-button club-button-secondary">Find a story</Link></div></SitePage>;
}
