import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth/login" });
    return { user: data.user };
  },
  component: AppLayout,
});

function AppLayout() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") nav({ to: "/auth/login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [nav]);
  if (!ready) return null;
  return <Outlet />;
}
