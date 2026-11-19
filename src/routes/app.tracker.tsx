import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Home, UtensilsCrossed, ShoppingBag, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { emissionFactors } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/app/tracker")({ component: Tracker });

type Cat = "transport" | "energy" | "food" | "shopping";

function Tracker() {
  const [tab, setTab] = useState<Cat>("transport");
  const [transport, setT] = useState({ carKm: 0, bikeKm: 0, publicKm: 0, flightKm: 0, evKm: 0 });
  const [energy, setE] = useState({ electricityKwh: 0, acHours: 0, lpgKg: 0, solarKwh: 0 });
  const [food, setF] = useState({ vegMeal: 0, nonVegMeal: 0, dairyKg: 0, fastFood: 0 });
  const [shop, setS] = useState({ clothing: 0, electronics: 0, delivery: 0 });

  const totals = {
    transport: Object.entries(transport).reduce((a, [k, v]) => a + v * (emissionFactors as any)[k], 0),
    energy: Object.entries(energy).reduce((a, [k, v]) => a + v * (emissionFactors as any)[k], 0),
    food: Object.entries(food).reduce((a, [k, v]) => a + v * (emissionFactors as any)[k], 0),
    shopping: Object.entries(shop).reduce((a, [k, v]) => a + v * (emissionFactors as any)[k], 0),
  };
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
  const impactScore = Math.max(0, Math.min(100, 100 - grandTotal / 2));

  async function save() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return toast.error("Sign in required");
    const entries = [
      { user_id: u.user.id, category: "transport", co2_kg: totals.transport, amount: Object.values(transport).reduce((a,b)=>a+b,0) },
      { user_id: u.user.id, category: "energy", co2_kg: totals.energy, amount: Object.values(energy).reduce((a,b)=>a+b,0) },
      { user_id: u.user.id, category: "food", co2_kg: totals.food, amount: Object.values(food).reduce((a,b)=>a+b,0) },
      { user_id: u.user.id, category: "shopping", co2_kg: totals.shopping, amount: Object.values(shop).reduce((a,b)=>a+b,0) },
    ].filter(e => e.co2_kg > 0);
    if (!entries.length) return toast.error("Enter at least one value");
    const { error } = await supabase.from("carbon_entries").insert(entries);
    if (error) return toast.error(error.message);
    toast.success(`Logged ${grandTotal.toFixed(1)} kg CO₂`);
    setT({ carKm: 0, bikeKm: 0, publicKm: 0, flightKm: 0, evKm: 0 });
    setE({ electricityKwh: 0, acHours: 0, lpgKg: 0, solarKwh: 0 });
    setF({ vegMeal: 0, nonVegMeal: 0, dairyKg: 0, fastFood: 0 });
    setS({ clothing: 0, electronics: 0, delivery: 0 });
  }

  const fields = (obj: any, setObj: any, items: { key: string; label: string; unit: string }[]) => (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map(({ key, label, unit }) => (
        <div key={key}>
          <Label>{label} <span className="text-muted-foreground text-xs">({unit})</span></Label>
          <Input type="number" min={0} className="mt-1.5" value={obj[key] || ""} onChange={(e) => setObj({ ...obj, [key]: +e.target.value || 0 })} />
        </div>
      ))}
    </div>
  );

  return (
    <AppShell title="Carbon Tracker" subtitle="Log activity across your life and see your real impact"
      actions={<Button onClick={save} className="gradient-bg text-primary-foreground border-0">Save entry</Button>}>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass p-6 lg:col-span-2">
          <Tabs value={tab} onValueChange={(v) => setTab(v as Cat)}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="transport"><Car className="h-4 w-4 mr-1.5" />Transport</TabsTrigger>
              <TabsTrigger value="energy"><Home className="h-4 w-4 mr-1.5" />Energy</TabsTrigger>
              <TabsTrigger value="food"><UtensilsCrossed className="h-4 w-4 mr-1.5" />Food</TabsTrigger>
              <TabsTrigger value="shopping"><ShoppingBag className="h-4 w-4 mr-1.5" />Shopping</TabsTrigger>
            </TabsList>
            <TabsContent value="transport" className="mt-6">
              {fields(transport, setT, [
                { key: "carKm", label: "Car distance", unit: "km" },
                { key: "bikeKm", label: "Bike distance", unit: "km" },
                { key: "publicKm", label: "Public transport", unit: "km" },
                { key: "flightKm", label: "Flights", unit: "km" },
                { key: "evKm", label: "EV travel", unit: "km" },
              ])}
            </TabsContent>
            <TabsContent value="energy" className="mt-6">
              {fields(energy, setE, [
                { key: "electricityKwh", label: "Electricity usage", unit: "kWh" },
                { key: "acHours", label: "AC usage", unit: "hours" },
                { key: "lpgKg", label: "LPG usage", unit: "kg" },
                { key: "solarKwh", label: "Solar generated", unit: "kWh" },
              ])}
            </TabsContent>
            <TabsContent value="food" className="mt-6">
              {fields(food, setF, [
                { key: "vegMeal", label: "Vegetarian meals", unit: "count" },
                { key: "nonVegMeal", label: "Non-vegetarian meals", unit: "count" },
                { key: "dairyKg", label: "Dairy", unit: "kg" },
                { key: "fastFood", label: "Fast food", unit: "meals" },
              ])}
            </TabsContent>
            <TabsContent value="shopping" className="mt-6">
              {fields(shop, setS, [
                { key: "clothing", label: "Clothing purchases", unit: "items" },
                { key: "electronics", label: "Electronics purchases", unit: "items" },
                { key: "delivery", label: "Online deliveries", unit: "count" },
              ])}
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="glass-strong p-6">
          <h3 className="font-display font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Live impact</h3>
          <div className="mt-6 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total carbon footprint</div>
            <div className="font-display text-5xl font-bold gradient-text mt-1">{grandTotal.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">kg CO₂</div>
          </div>
          <div className="mt-6 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Environmental impact score</div>
            <div className="font-display text-3xl font-bold mt-1">{impactScore.toFixed(0)}/100</div>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            {Object.entries(totals).map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="capitalize text-muted-foreground">{k}</span><span className="font-mono">{v.toFixed(1)} kg</span></div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
