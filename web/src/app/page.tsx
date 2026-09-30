import { ClosingNote, SiteHeader } from "@/components/site/SiteChrome";
import { WelcomeRace } from "@/components/welcome/WelcomeRace";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <WelcomeRace />
        <ClosingNote />
      </main>
    </>
  );
}
