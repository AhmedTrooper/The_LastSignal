import Link from "next/link";
import { Logo } from "@/app/components/logo";
import { BookIcon, HeartIcon, MapIcon } from "@/app/components/icons";

export default function Footer() {
  return <footer className="club-footer">
    <div className="club-footer-top"><div><p className="club-kicker">A little curiosity goes a long way.</p><h2 className="display">They never came back.<br /><span>So we bring their stories home.</span></h2><p>The next time you look up, there’s a little explorer you’ll know by name.</p></div><nav className="club-footer-nav" aria-label="Keep exploring"><Link href="/story"><BookIcon className="h-5 w-5" />Find your next story</Link><Link href="/where-they-rest"><MapIcon className="h-5 w-5" />Visit the space map</Link><Link href="/tributes"><HeartIcon className="h-5 w-5" />Leave a kind message</Link></nav></div>
    <div className="club-footer-bottom"><Link href="/" aria-label="RoverVilla home"><Logo compact /></Link><p>An independent project, not endorsed by NASA or any space agency. Mission media is credited. AI-assisted illustrations and imagined machine voices are labelled separately from the historical record.</p><nav className="club-footer-legal" aria-label="Information and policies"><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/delete-account">Account &amp; data</Link></nav></div>
  </footer>;
}
