import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

const loginSearchSchema = z.object({ verified: z.string().optional() });

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
  validateSearch: loginSearchSchema,
});

function LoginPage() {
  const nav = useNavigate();
  const search = useSearch({ from: "/auth/login" });
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [needsVerify, setNeedsVerify] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);

  useEffect(() => {
    if (search.verified) toast.success("Email verified — you can now sign in.");
  }, [search.verified]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNeedsVerify(false);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setBusy(false);
    if (error) {
      if (/email|confirm|verif/i.test(error.message)) {
        setNeedsVerify(true);
        return toast.error("Please verify your email before signing in.");
      }
      return toast.error(error.message);
    }
    toast.success("Welcome back!");
    nav({ to: "/app/dashboard" });
  }

  async function resend() {
    if (!email) return toast.error("Enter your email first");
    setResendBusy(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin + "/auth/login?verified=1" },
    });
    setResendBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Verification email sent");
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app/dashboard" });
    if (res.error) toast.error(res.error.message);
    if (!res.redirected && !res.error) nav({ to: "/app/dashboard" });
  }

  return (
    <Card className="glass p-8">
      <h1 className="font-display text-3xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to keep saving tomorrow.</p>
      <Button onClick={google} variant="outline" className="mt-6 w-full h-11 bg-white/5">
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
        Continue with Google
      </Button>
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="mt-1.5" /></div>
        <div>
          <div className="flex justify-between items-center"><Label>Password</Label><Link to="/auth/forgot" className="text-xs text-primary hover:underline">Forgot?</Link></div>
          <Input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" className="mt-1.5" />
        </div>
        <Button disabled={busy} className="w-full gradient-bg text-primary-foreground border-0 h-11">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      {needsVerify && (
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
          <p className="text-foreground">Your email isn't verified yet.</p>
          <button
            onClick={resend}
            disabled={resendBusy}
            className="mt-1 text-primary hover:underline disabled:opacity-60"
          >
            {resendBusy ? "Resending…" : "Resend verification email"}
          </button>
        </div>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to EcoTrack? <Link to="/auth/register" className="text-primary hover:underline">Create account</Link>
      </p>
    </Card>
  );
}
