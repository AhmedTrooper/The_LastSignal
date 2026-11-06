export default function MissionIntro({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="club-mission-intro"><p className="club-kicker">Your hands on the hardware</p><h1 className="display">{title}</h1><p>{children}</p><span>Illustrative learning tools · not live spacecraft controls</span></div>;
}
