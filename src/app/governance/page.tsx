import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/LegalPage";

export const metadata: Metadata = { title: "Governance & community policies", description: "How Leam keeps Universes safe and who decides what." };

export default function GovernancePage() {
  return (
    <LegalPage
      eyebrow="Governance"
      title="Community policies"
      updated="November 2026"
      intro="Every Universe sets its own rules on top of a shared floor. This is the floor."
      sections={[
        { id: "floor", title: "The shared floor", body: ["No harassment, hate, threats, sexual content involving minors, non-consensual imagery, doxxing or fraud — anywhere on Leam, regardless of a Universe's own rules."] },
        { id: "hosts", title: "Hosts & moderators", body: ["Hosts can appoint moderators, mute or remove participants, enable slow mode and filter keywords. Every moderation action is logged for the Universe's team."] },
        { id: "reports", title: "Reports & review", body: ["Anyone can report a message, participant or room. Reports are reviewed by trained people; urgent safety reports are prioritized around the clock."] },
        { id: "appeals", title: "Appeals", body: ["If your content or account is restricted you'll be told why and can appeal once. A different reviewer decides the appeal."] },
        { id: "transparency", title: "Transparency", body: ["We publish a twice-yearly report on enforcement volumes, appeal outcomes and government requests."] },
        { id: "changes", title: "Changing these policies", body: ["Policy changes are announced 30 days in advance, with a summary of what changed and why. Creators on the advisory council review drafts first."] },
      ]}
    />
  );
}
