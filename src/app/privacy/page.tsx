import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="November 2026"
      intro="What we collect, why we collect it, and the controls you have."
      sections={[
        { id: "collect", title: "What we collect", body: ["Account details you give us (name, email, profile photo), content you post in chats and rooms, and basic device and usage data needed to run live video reliably.", "Payment details are collected and stored by our payment processor, not by Leam."] },
        { id: "use", title: "How we use it", body: ["To operate Universes, deliver rooms and chat, process memberships and tickets, keep the service safe, and send messages you've opted into.", "We do not sell personal data."] },
        { id: "creators", title: "What creators can see", body: ["Creators see members' display names, profile photos and membership tier. Emails are shared with a creator only if you opt in when joining."] },
        { id: "recordings", title: "Live rooms & replays", body: ["Rooms may be recorded for replay when the host enables it; a recording indicator is always shown. Speakers are told before joining the stage."] },
        { id: "rights", title: "Your rights", body: ["You can access, export, correct or delete your data from account settings, or by contacting support. Depending on where you live you may have additional rights under laws such as the GDPR or CCPA."] },
        { id: "contact", title: "Contact", body: ["Reach our privacy team through the support page."] },
      ]}
    />
  );
}
