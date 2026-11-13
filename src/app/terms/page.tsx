import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/LegalPage";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="November 2026"
      intro="The agreement between you and Leam Collective when you use Leam."
      sections={[
        { id: "accounts", title: "Accounts", body: ["You must be old enough to consent to data processing in your country. You're responsible for activity on your account and for keeping your credentials secure."] },
        { id: "creators", title: "Creators & Universes", body: ["Creators set access rules and prices and are responsible for delivering what they advertise. Creators keep ownership of their content and grant Leam the license needed to host and stream it."] },
        { id: "payments", title: "Payments, refunds & fees", body: ["Memberships renew until cancelled. Tickets are non-refundable unless an event is cancelled. Platform fees are listed on the pricing page."] },
        { id: "conduct", title: "Community conduct", body: ["Follow the community policies on the Governance page. We may remove content or restrict accounts that put others at risk."] },
        { id: "liability", title: "Disclaimers & liability", body: ["Leam is provided as-is to the extent permitted by law. Nothing here limits rights you have under consumer protection law."] },
        { id: "changes", title: "Changes", body: ["We'll give notice of material changes before they take effect."] },
      ]}
    />
  );
}
