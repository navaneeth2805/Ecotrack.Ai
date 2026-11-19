import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/forgot")({ component: ForgotPage });

function ForgotPage() {
  const [email, setEmail] = useState(""); const [busy, setBusy] = useState(false); const [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/auth/login" });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true); toast.success("Check your inbox");
  }
  return (
    <Card className="glass p-8">
      <h1 className="font-display text-3xl font-bold">Forgot password</h1>
      <p className="mt-1 text-sm text-muted-foreground">We'll email you a reset link.</p>
      {sent ? (
        <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30 text-sm">
          Reset link sent to <b>{email}</b>. Check your inbox.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
          <Button disabled={busy} className="w-full gradient-bg text-primary-foreground border-0 h-11">
            {busy ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/auth/login" className="text-primary hover:underline">Back to sign in</Link>
      </p>
    </Card>
  );
}
