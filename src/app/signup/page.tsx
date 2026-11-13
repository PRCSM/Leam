import type { Metadata } from "next";
import { AuthShell } from "@/components/pages/AuthShell";
import { IMG } from "@/lib/images";

export const metadata: Metadata = { title: "Create your account" };

export default function SignupPage() {
  return <AuthShell mode="signup" image={IMG.heroDancer} title="Create your Universe." sub="Start free. You can set prices and access rules later." />;
}
