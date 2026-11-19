import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Footprints, Brain, Target, Trophy, BarChart3, TrendingUp,
  Gift, Users, Sparkles, AlertTriangle, GraduationCap, Building2, Shield, LogOut, Settings, Bell, Menu, Bot, FileText, Activity
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter, useSidebar
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import type { ReactNode } from "react";

const groups = [
  { label: "Overview", items: [
    { to: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/app/os", icon: Activity, label: "Sustainability OS" },
    { to: "/app/tracker", icon: Footprints, label: "Carbon Tracker" },
    { to: "/app/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/app/forecasting", icon: TrendingUp, label: "Forecasting" },
    { to: "/app/reports", icon: FileText, label: "AI Reports" },
  ]},
  { label: "Sustainability", items: [
    { to: "/app/agents", icon: Bot, label: "AI Agents" },
    { to: "/app/coach", icon: Brain, label: "AI Climate Coach" },
    { to: "/app/twin", icon: Sparkles, label: "AI Sustainability Twin" },
    { to: "/app/goals", icon: Target, label: "Goals" },
    { to: "/app/challenges", icon: Trophy, label: "Challenges" },
    { to: "/app/rewards", icon: Gift, label: "Green Rewards" },
  ]},
  { label: "Community", items: [
    { to: "/app/community", icon: Users, label: "Community Hub" },
    { to: "/app/risk", icon: AlertTriangle, label: "Climate Risk Center" },
  ]},
  { label: "Organizations", items: [
    { to: "/app/campus", icon: GraduationCap, label: "Eco School & College" },
    { to: "/app/esg", icon: Building2, label: "Corporate ESG" },
    { to: "/app/admin", icon: Shield, label: "Admin Panel" },
  ]},
];

function AppSidebar() {
  const path = useRouterState({ select: s => s.location.pathname });
  return (
    <Sidebar collapsible="icon" className="border-r border-white/5">
      <SidebarHeader className="p-4"><Logo /></SidebarHeader>
      <SidebarContent>
        {groups.map(g => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map(item => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={path === item.to} tooltip={item.label}>
                      <Link to={item.to}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-3">
        <SidebarMenuButton asChild tooltip="Settings"><Link to="/app/dashboard"><Settings className="h-4 w-4" /><span>Settings</span></Link></SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({ children, title, subtitle, actions }: { children: ReactNode; title: string; subtitle?: string; actions?: ReactNode }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const initials = (user?.email?.[0] ?? "E").toUpperCase();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/60 border-b border-white/5">
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <SidebarTrigger />
                <div className="min-w-0">
                  <h1 className="font-display font-bold text-lg sm:text-xl truncate">{title}</h1>
                  {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {actions}
                <Button size="icon" variant="ghost" className="rounded-full"><Bell className="h-4 w-4" /></Button>
                <Avatar className="h-9 w-9 border border-primary/40"><AvatarFallback className="gradient-bg text-primary-foreground font-semibold text-xs">{initials}</AvatarFallback></Avatar>
                <Button size="icon" variant="ghost" className="rounded-full" onClick={async () => { await signOut(); nav({ to: "/" }); }}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
