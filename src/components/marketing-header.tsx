import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import { Button } from "./ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/40 border-b border-white/5">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#stats" className="hover:text-foreground transition">Impact</a>
          <a href="#testimonials" className="hover:text-foreground transition">Customers</a>
          <Link to="/pricing" className="hover:text-foreground transition">Pricing</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/auth/login">Sign in</Link></Button>
          <Button asChild size="sm" className="gradient-bg text-primary-foreground border-0 glow">
            <Link to="/auth/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">
            Measure Today. Save Tomorrow. The AI sustainability OS for a greener planet.
          </p>
        </div>
        <FooterCol title="Product" items={["Features", "Pricing", "Integrations", "Changelog"]} />
        <FooterCol title="Solutions" items={["Individuals", "Colleges", "Enterprise", "Cities"]} />
        <FooterCol title="Company" items={["About", "Blog", "Careers", "Contact"]} />
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EcoTrack AI. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((i) => <li key={i}><a href="#" className="hover:text-foreground">{i}</a></li>)}
      </ul>
    </div>
  );
}
