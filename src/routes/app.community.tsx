import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/app/community")({ component: Community });

type Post = { id: string; user_id: string; content: string; likes_count: number; created_at: string; profiles?: { full_name: string | null } | null };

function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [me, setMe] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    setMe(u.user?.id ?? null);
    const { data } = await supabase.from("community_posts").select("*, profiles(full_name)").order("created_at", { ascending: false }).limit(50);
    setPosts((data as any) || []);
    if (u.user) {
      const { data: ls } = await supabase.from("post_likes").select("post_id").eq("user_id", u.user.id);
      setLikedIds(new Set((ls || []).map((r: any) => r.post_id)));
    }
  }
  useEffect(() => { load(); }, []);

  async function post() {
    if (!content.trim() || !me) return;
    const { error } = await supabase.from("community_posts").insert({ user_id: me, content });
    if (error) return toast.error(error.message);
    setContent(""); toast.success("Posted!"); load();
  }
  async function like(p: Post) {
    if (!me) return;
    if (likedIds.has(p.id)) {
      await supabase.from("post_likes").delete().eq("post_id", p.id).eq("user_id", me);
      await supabase.from("community_posts").update({ likes_count: Math.max(0, p.likes_count - 1) }).eq("id", p.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: p.id, user_id: me });
      await supabase.from("community_posts").update({ likes_count: p.likes_count + 1 }).eq("id", p.id);
    }
    load();
  }

  const trending = [
    "#PlasticFreeJuly", "#ClimateAction", "#GreenCommute", "#TreesForTomorrow", "#ZeroWaste",
  ];

  return (
    <AppShell title="Community Hub" subtitle="Share wins, swap tips, and rally for the planet">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass p-4">
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share a sustainability win, tip, or question…" rows={3} />
            <div className="mt-3 flex justify-end"><Button onClick={post} className="gradient-bg text-primary-foreground border-0"><Send className="h-4 w-4 mr-1" /> Post</Button></div>
          </Card>

          {posts.length === 0 && <Card className="glass p-8 text-center text-sm text-muted-foreground">No posts yet — be the first to inspire the community!</Card>}

          {posts.map(p => (
            <Card key={p.id} className="glass p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10"><AvatarFallback className="gradient-bg text-primary-foreground text-xs font-semibold">{(p.profiles?.full_name ?? "U")[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{p.profiles?.full_name ?? "Anonymous"}</div>
                  <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</div>
                </div>
              </div>
              <p className="mt-3 text-sm whitespace-pre-wrap">{p.content}</p>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <button onClick={() => like(p)} className={`flex items-center gap-1 hover:text-primary transition ${likedIds.has(p.id) ? "text-primary" : "text-muted-foreground"}`}>
                  <Heart className={`h-4 w-4 ${likedIds.has(p.id) ? "fill-primary" : ""}`} /> {p.likes_count}
                </button>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground"><MessageCircle className="h-4 w-4" /> Comment</button>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="glass p-5">
            <h3 className="font-display font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Trending</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {trending.map(t => <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">{t}</span>)}
            </div>
          </Card>
          <Card className="glass p-5">
            <h3 className="font-display font-semibold">Community challenges</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between"><span>Plastic-Free July</span><span className="text-primary font-mono">12,840</span></li>
              <li className="flex justify-between"><span>Plant a Tree September</span><span className="text-primary font-mono">8,210</span></li>
              <li className="flex justify-between"><span>Bike to Work Week</span><span className="text-primary font-mono">5,604</span></li>
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
