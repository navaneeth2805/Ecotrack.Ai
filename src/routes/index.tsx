import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, PlayCircle, Leaf, Brain, Target, BarChart3, TrendingUp,
  Trophy, Gift, FileBarChart, Check, Star, Globe2, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader, MarketingFooter } from "@/components/marketing-header";
import { Counter } from "@/components/counter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoTrack AI — Measure Today. Save Tomorrow." },
      { name: "description", content: "AI-powered sustainability platform helping individuals, colleges, businesses, and communities build a greener future." },
      { property: "og:title", content: "EcoTrack AI" },
      { property: "og:description", content: "Track, analyze and reduce your carbon footprint with AI." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Leaf, title: "Carbon Tracking", desc: "Log emissions across transport, energy, food, and shopping in seconds." },
  { icon: Brain, title: "AI Climate Coach", desc: "Personalized recommendations from your sustainability twin." },
  { icon: Target, title: "Sustainability Goals", desc: "Set, track, and crush measurable green goals every week." },
  { icon: BarChart3, title: "Smart Analytics", desc: "Beautiful charts that reveal where your impact really lives." },
  { icon: TrendingUp, title: "Carbon Forecasting", desc: "Predict your emissions trajectory months ahead with ML models." },
  { icon: Trophy, title: "Community Challenges", desc: "Compete with friends, classmates, and coworkers in green sprints." },
  { icon: Gift, title: "Green Rewards", desc: "Earn Eco Points, unlock badges, and rise in the Champion ranks." },
  { icon: FileBarChart, title: "Environmental Reports", desc: "ESG-grade reports for individuals, schools, and enterprises." },
];

const stats = [
  { label: "Tonnes of CO₂ Tracked", value: 2480000, suffix: "+" },
  { label: "Trees Equivalent Saved", value: 184000, suffix: "" },
  { label: "Active Users", value: 92000, suffix: "" },
  { label: "Challenges Completed", value: 412000, suffix: "" },
];

const testimonials = [
  { name: "Dr. Priya Iyer", role: "Sustainability Lead, NovaTech", quote: "EcoTrack AI gave our 4,000-person team a single source of truth for ESG. Carbon down 31% in 9 months." },
  { name: "Marcus Lee", role: "Dean, GreenHill College", quote: "Our campus now competes department-by-department on sustainability. Engagement is unreal." },
  { name: "Aanya Patel", role: "Climate Activist", quote: "Finally a sustainability app that doesn't feel like homework. The AI coach is genuinely useful." },
];

const pricing = [
  { name: "Free", price: "$0", desc: "For individuals getting started.", features: ["Carbon tracker", "Basic analytics", "AI coach (10 q/day)", "Community access"], cta: "Start free" },
  { name: "Pro", price: "$9", suffix: "/mo", desc: "For serious sustainability builders.", features: ["Unlimited AI coach", "Advanced forecasting", "Custom goals & reports", "Priority support", "Premium badges"], cta: "Start Pro trial", featured: true },
  { name: "Enterprise", price: "Custom", desc: "For companies, campuses, and cities.", features: ["ESG dashboard", "SSO & SAML", "API access", "Dedicated CSM", "Carbon offset marketplace"], cta: "Talk to sales" },
];

function Landing() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <MarketingHeader />

      {/* HERO */}
      <section className="relative pt-16 pb-32 grid-bg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-1/2 -translate-x-1/2 h-[640px] w-[640px] rounded-full bg-primary/20 blur-[140px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Badge variant="outline" className="border-primary/40 text-primary mb-6 bg-primary/10">
              <Sparkles className="h-3 w-3 mr-1" /> AI-powered sustainability OS
            </Badge>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Track your <span className="gradient-text">carbon footprint.</span><br />
              Reduce your <span className="gradient-text">environmental impact.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              AI-powered sustainability platform helping individuals, colleges, businesses, and communities build a greener future.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gradient-bg text-primary-foreground border-0 glow h-12 px-6 text-base">
                <Link to="/auth/register">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 text-base border-white/20 bg-white/5">
                <PlayCircle className="mr-2 h-5 w-5" /> Watch Demo
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => <div key={i} className="h-8 w-8 rounded-full gradient-bg border-2 border-background" />)}
              </div>
              <span><b className="text-foreground">92,000+</b> people reducing their footprint</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
            className="relative aspect-square max-w-lg mx-auto"
          >
            {/* Animated earth */}
            <div className="absolute inset-0 rounded-full gradient-bg blur-3xl opacity-30 animate-pulse-glow" />
            <div className="absolute inset-8 rounded-full glass-strong grid-bg animate-spin-slow overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-accent/30" />
              <Globe2 className="absolute inset-0 m-auto h-2/3 w-2/3 text-primary/30" />
            </div>
            {/* Floating metric cards */}
            {[
              { top: "8%", left: "-8%", label: "CO₂ Today", value: "4.8 kg", icon: Leaf },
              { top: "20%", right: "-10%", label: "Eco Score", value: "78/100", icon: Trophy },
              { bottom: "20%", left: "-12%", label: "Trees Saved", value: "12", icon: Leaf },
              { bottom: "5%", right: "-6%", label: "Streak", value: "21 days", icon: Star },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="absolute glass rounded-2xl p-3 flex items-center gap-3 animate-float"
                style={{ ...card, animationDelay: `${i * 0.8}s` } as React.CSSProperties}
              >
                <span className="h-9 w-9 grid place-items-center rounded-lg gradient-bg">
                  <card.icon className="h-4 w-4 text-primary-foreground" />
                </span>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{card.label}</div>
                  <div className="font-display font-bold">{card.value}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/10">Features</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Everything you need to <span className="gradient-text">go green</span></h2>
          <p className="mt-4 text-muted-foreground">From tracking to forecasting to community action — one beautiful platform.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Card className="glass p-6 h-full hover:border-primary/40 hover:-translate-y-1 transition-all">
                <span className="h-11 w-11 grid place-items-center rounded-xl gradient-bg glow mb-4">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <h3 className="font-display font-semibold text-lg">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <Card className="glass-strong p-10 md:p-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl md:text-5xl font-bold gradient-text">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </Card>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/10">Loved by climate leaders</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Trusted by <span className="gradient-text">92,000+ people</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <Card key={t.name} className="glass p-6">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-bg" />
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/10">Pricing</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Plans for <span className="gradient-text">every climate ambition</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {pricing.map((p) => (
            <Card key={p.name} className={`p-8 relative ${p.featured ? "glass-strong border-primary/40 glow scale-[1.02]" : "glass"}`}>
              {p.featured && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-bg text-primary-foreground border-0">Most popular</Badge>}
              <h3 className="font-display font-bold text-xl">{p.name}</h3>
              <div className="mt-4 flex items-end gap-1">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                {p.suffix && <span className="text-muted-foreground mb-1">{p.suffix}</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}</li>
                ))}
              </ul>
              <Button asChild className={`mt-8 w-full ${p.featured ? "gradient-bg text-primary-foreground border-0" : ""}`} variant={p.featured ? "default" : "outline"}>
                <Link to="/auth/register">{p.cta}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20">
        <Card className="glass-strong p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-10" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold">Ready to <span className="gradient-text">save tomorrow?</span></h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Join thousands building a measurably greener life.</p>
            <Button asChild size="lg" className="mt-8 gradient-bg text-primary-foreground border-0 glow h-12 px-8">
              <Link to="/auth/register">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </Card>
      </section>

      <MarketingFooter />
    </div>
  );
}
