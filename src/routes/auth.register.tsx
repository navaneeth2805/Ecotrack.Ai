import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/register")({ component: RegisterPage });

function RegisterPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pw,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin + "/auth/login?verified=1",
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);

    // If a session already exists, the project has email confirmation disabled.
    if (data.session) {
      toast.success("Account created — welcome aboard!");
      nav({ to: "/app/dashboard" });
      return;
    }

    // Otherwise: verification email was sent. Sign out any partial session and show confirm screen.
    await supabase.auth.signOut();
    setSent(true);
    toast.success("Verification email sent");
  }

  async function resend() {
    if (!email) return toast.error("Enter your email above first");
    setResendBusy(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin + "/auth/login?verified=1" },
    });
    setResendBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Verification email resent");
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/app/dashboard",
    });
    if (res.error) toast.error(res.error.message);
    if (!res.redirected && !res.error) nav({ to: "/app/dashboard" });
  }

  if (sent) {
    return (
      <Card className="glass p-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center">
          <MailCheck className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold mt-5">Verify your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a confirmation link to <span className="text-foreground font-medium">{email}</span>.
          Click it to activate your EcoTrack AI account.
        </p>
        <div className="mt-6 space-y-3">
          <Button
            onClick={resend}
            disabled={resendBusy}
            variant="outline"
            className="w-full h-11 bg-white/5"
          >
            {resendBusy ? "Resending…" : "Resend verification email"}
          </Button>
          <Button asChild className="w-full gradient-bg text-primary-foreground border-0 h-11">
            <Link to="/auth/login">Back to sign in</Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Didn't get it? Check spam, or try a different email by{" "}
          <button onClick={() => setSent(false)} className="text-primary hover:underline">
            going back
          </button>
          .
        </p>
      </Card>
    );
  }

  return (
    <Card className="glass p-8">
      <h1 className="font-display text-3xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Start your sustainability journey in 30 seconds.</p>
      <Button onClick={google} variant="outline" className="mt-6 w-full h-11 bg-white/5">Continue with Google</Button>
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Full name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" placeholder="Jane Green" /></div>
        <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" placeholder="you@email.com" /></div>
        <div><Label>Password</Label><Input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1.5" placeholder="At least 6 characters" /></div>
        <Button disabled={busy} className="w-full gradient-bg text-primary-foreground border-0 h-11">
          {busy ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        We'll email you a link to verify your address before your account becomes active.
      </p>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have one? <Link to="/auth/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </Card>
  );
}
