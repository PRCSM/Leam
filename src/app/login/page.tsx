import type { Metadata } from "next";
import { AuthShell } from "@/components/pages/AuthShell";
import { IMG } from "@/lib/images";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage() {
  return <AuthShell mode="login" image={IMG.womanLight} title="Welcome back." sub="Log in to manage your Universes and join rooms." />;
}
