import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Minus, Sparkles, Building2, GraduationCap, User } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/marketing-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Fragment, useState } from "react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — EcoTrack AI" },
      { name: "description", content: "Transparent pricing for individuals, colleges, and enterprise teams. Measure today. Save tomorrow." },
      { property: "og:title", content: "Pricing — EcoTrack AI" },
      { property: "og:description", content: "Plans for individuals, campuses, and enterprises." },
    ],
  }),
  component: PricingPage,
});

type Cycle = "monthly" | "annual";

const tiers = [
  {
    id: "individual",
    name: "Individual",
    icon: User,
    tagline: "For climate-conscious people building greener habits.",
    price: { monthly: 0, annual: 0 },
    cta: "Start Free",
    href: "/auth/register",
    highlight: false,
    features: [
      "Personal carbon tracker",
      "AI Climate Coach (50 msgs/mo)",
      "5 active sustainability goals",
      "Weekly insights & forecasts",
      "Community challenges",
    ],
  },
  {
    id: "college",
    name: "College & Campus",
    icon: GraduationCap,
    tagline: "Empower students, faculty, and campus operations with shared impact.",
    price: { monthly: 199, annual: 159 },
    cta: "Start 30-day trial",
    href: "/auth/register",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Up to 5,000 student seats",
      "Campus sustainability dashboard",
      "Department-level analytics",
      "Inter-college leaderboards",
      "Unlimited AI coach & twin",
      "SSO (Google, Microsoft)",
      "Priority email support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    tagline: "ESG reporting, Scope 1-2-3 emissions, and AI risk modeling at scale.",
    price: { monthly: null, annual: null },
    cta: "Talk to sales",
    href: "/auth/register",
    highlight: false,
    features: [
      "Unlimited seats & business units",
      "Full Scope 1, 2 & 3 reporting",
      "CSRD / GRI / TCFD exports",
      "Climate risk forecasting (AI)",
      "Custom integrations & API",
      "SAML SSO + SCIM provisioning",
      "Dedicated CSM & 99.95% SLA",
    ],
  },
];

const comparisonGroups: { title: string; rows: { label: string; values: (string | boolean)[] }[] }[] = [
  {
    title: "Tracking & Insights",
    rows: [
      { label: "Personal carbon tracker", values: [true, true, true] },
      { label: "Household / team tracking", values: [false, true, true] },
      { label: "Scope 1, 2 & 3 emissions", values: [false, "Scope 1-2", true] },
      { label: "Real-time forecasting", values: ["Basic", "Advanced", "AI predictive"] },
    ],
  },
  {
    title: "AI & Automation",
    rows: [
      { label: "AI Climate Coach", values: ["50 msgs/mo", "Unlimited", "Unlimited + custom"] },
      { label: "AI Sustainability Twin", values: [true, true, true] },
      { label: "Automated recommendations", values: [true, true, true] },
      { label: "Custom AI models", values: [false, false, true] },
    ],
  },
  {
    title: "Collaboration & Reporting",
    rows: [
      { label: "Community & challenges", values: [true, true, true] },
      { label: "Department dashboards", values: [false, true, true] },
      { label: "ESG / CSRD / GRI exports", values: [false, "Basic", "Full suite"] },
      { label: "Public sustainability page", values: [false, true, true] },
    ],
  },
  {
    title: "Security & Support",
    rows: [
      { label: "SSO", values: [false, "Google / MS", "SAML + SCIM"] },
      { label: "Audit logs", values: [false, "90 days", "Unlimited"] },
      { label: "Support", values: ["Community", "Priority email", "24/7 + CSM"] },
      { label: "SLA", values: [false, "99.5%", "99.95%"] },
    ],
  },
];

const faqs = [
  { q: "Can I switch plans later?", a: "Yes — upgrade, downgrade, or cancel any time. Annual plans are pro-rated on upgrade." },
  { q: "Do you offer education discounts?", a: "Accredited colleges and non-profits receive up to 40% off the Campus plan. Contact sales to verify." },
  { q: "Is my emissions data private?", a: "Always. Data is encrypted at rest and in transit, and never sold or used to train third-party models." },
  { q: "What integrations are supported?", a: "Google Workspace, Microsoft 365, Slack, utility providers, ERP/HRIS (Workday, SAP) on Enterprise." },
];

function PricingPage() {
  const [cycle, setCycle] = useState<Cycle>("annual");

  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative px-4 sm:px-6 pt-20 pb-12 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-5 border-primary/30 text-primary">
              <Sparkles className="w-3 h-3 mr-1" /> Simple, transparent pricing
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
              Plans that scale from <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">one footprint</span> to a planet
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a single climate champion or a global enterprise, EcoTrack AI grows with you.
            </p>

            {/* Billing toggle */}
            <div className="mt-8 inline-flex items-center gap-1 p-1 rounded-full border border-white/10 bg-background/40 backdrop-blur">
              <button
                onClick={() => setCycle("monthly")}
                className={`px-5 py-2 text-sm rounded-full transition ${cycle === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setCycle("annual")}
                className={`px-5 py-2 text-sm rounded-full transition flex items-center gap-2 ${cycle === "annual" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Annual <span className="text-xs opacity-80">Save 20%</span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* Tier cards */}
        <section id="pricing" className="px-4 sm:px-6 pb-20">
          <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-3">
            {tiers.map((t, i) => {
              const Icon = t.icon;
              const price = t.price[cycle];
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Card className={`relative h-full p-7 backdrop-blur-xl bg-background/40 border ${t.highlight ? "border-primary/50 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.5)]" : "border-white/10"}`}>
                    {t.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="gradient-bg border-0 text-primary-foreground">{t.badge}</Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{t.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground min-h-[40px]">{t.tagline}</p>

                    <div className="my-6">
                      {price === null ? (
                        <div className="text-4xl font-bold">Custom</div>
                      ) : price === 0 ? (
                        <div className="text-4xl font-bold">Free</div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">${price}</span>
                          <span className="text-muted-foreground">/mo</span>
                          {cycle === "annual" && <span className="text-xs text-muted-foreground ml-2">billed yearly</span>}
                        </div>
                      )}
                    </div>

                    <Button
                      asChild
                      className={`w-full ${t.highlight ? "gradient-bg text-primary-foreground border-0 glow" : ""}`}
                      variant={t.highlight ? "default" : "outline"}
                    >
                      <Link to={t.href}>{t.cta}</Link>
                    </Button>

                    <ul className="mt-7 space-y-3">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Comparison */}
        <section className="px-4 sm:px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold">Compare every feature</h2>
              <p className="text-muted-foreground mt-2">A clear, side-by-side breakdown across plans.</p>
            </div>

            <Card className="overflow-hidden backdrop-blur-xl bg-background/40 border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="text-left p-4 font-medium w-1/3">Feature</th>
                      <th className="p-4 font-semibold">Individual</th>
                      <th className="p-4 font-semibold text-primary">Campus</th>
                      <th className="p-4 font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonGroups.map((group) => (
                      <Fragment key={group.title}>
                        <tr className="bg-primary/5">
                          <td colSpan={4} className="px-4 py-2 text-xs uppercase tracking-wider text-primary font-semibold">
                            {group.title}
                          </td>
                        </tr>
                        {group.rows.map((row) => (
                          <tr key={row.label} className="border-b border-white/5">
                            <td className="p-4 text-muted-foreground">{row.label}</td>
                            {row.values.map((v, i) => (
                              <td key={i} className="p-4 text-center">
                                {v === true ? (
                                  <Check className="w-4 h-4 text-primary mx-auto" />
                                ) : v === false ? (
                                  <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                                ) : (
                                  <span className="text-foreground/90">{v}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 sm:px-6 pb-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Frequently asked questions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {faqs.map((f) => (
                <Card key={f.q} className="p-6 backdrop-blur-xl bg-background/40 border border-white/10">
                  <h3 className="font-semibold mb-2">{f.q}</h3>
                  <p className="text-sm text-muted-foreground">{f.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 pb-24">
          <div className="mx-auto max-w-5xl rounded-3xl p-10 md:p-14 text-center bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to measure what matters?</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Join thousands tracking, reducing, and reporting emissions with EcoTrack AI.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="gradient-bg text-primary-foreground border-0 glow">
                <Link to="/auth/register">Start free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/auth/register">Talk to sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
