import { Photo } from "@/components/ui/Photo";
import { Sparkle } from "@/components/ui/Sparkle";
import { AuthForm } from "./AuthForm";

export function AuthShell({ mode, image, title, sub }: { mode: "login" | "signup"; image: string; title: string; sub: string }) {
  return (
    <section className="auth">
      <div className="auth-media" aria-hidden>
        <Photo src={image} alt="" sizes="50vw" priority position="50% 30%" />
        <div className="auth-media-shade" />
        <p className="auth-quote">
          Your people. Your space. Your rules.
          <Sparkle size={18} />
        </p>
      </div>
      <div className="auth-panel">
        <div className="auth-inner">
          <h1 className="h2">{title}</h1>
          <p className="muted">{sub}</p>
          <AuthForm mode={mode} />
        </div>
      </div>
    </section>
  );
}
