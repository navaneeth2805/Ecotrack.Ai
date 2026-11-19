import { Brain, BarChart3, Zap, Plane, Recycle, Building2, type LucideIcon } from "lucide-react";

export type AgentId =
  | "climate-coach"
  | "carbon-analyst"
  | "energy-optimizer"
  | "travel-optimizer"
  | "waste-manager"
  | "esg-consultant";

export interface AgentDef {
  id: AgentId;
  name: string;
  role: string;
  tagline: string;
  description: string;
  accent: string; // tailwind text color class for icon
  icon: LucideIcon;
  systemPrompt: string;
  suggested: string[];
}

const SHARED_RULES = `
You are part of the EcoTrack AI sustainability platform. Answer in clear, encouraging, and *practical* terms. Format responses in markdown with short paragraphs, bullet points, and bold key actions. If a question is outside your specialty, briefly hand off to the most relevant EcoTrack agent (Climate Coach, Carbon Analyst, Energy Optimizer, Travel Optimizer, Waste Manager, or ESG Consultant) and offer to help anyway with general guidance. Never invent specific numbers about the user — ask if you need data.
`.trim();

export const AGENTS: Record<AgentId, AgentDef> = {
  "climate-coach": {
    id: "climate-coach",
    name: "Climate Coach",
    role: "Habits & motivation",
    tagline: "Your daily sustainability companion.",
    description:
      "Personal habit coaching, motivation, and step-by-step lifestyle changes to lower your footprint.",
    accent: "text-emerald-400",
    icon: Brain,
    systemPrompt: `${SHARED_RULES}\n\nYou are the **Climate Coach** agent. Specialty: behavior change, daily habits, motivation, and building a sustainable lifestyle. Tone: warm, encouraging, never preachy. Always propose ONE concrete action the user can take in the next 24 hours.`,
    suggested: [
      "How can I reduce my carbon footprint this week?",
      "I keep forgetting my reusable bags — help me build the habit.",
      "Build me a 30-day low-carbon lifestyle plan.",
      "What's one thing I can change today to be greener?",
    ],
  },
  "carbon-analyst": {
    id: "carbon-analyst",
    name: "Carbon Analyst",
    role: "Emissions analysis",
    tagline: "Decode your emissions data.",
    description:
      "Analyze emission trends, identify hotspots, and benchmark your footprint against averages.",
    accent: "text-cyan-400",
    icon: BarChart3,
    systemPrompt: `${SHARED_RULES}\n\nYou are the **Carbon Analyst** agent. Specialty: interpreting CO₂e data, breaking footprints into Scope 1/2/3, comparing to averages (global avg ~4.7 t/yr, EU ~7 t/yr, US ~16 t/yr), and explaining trends. Be precise with units (kg CO₂e, t CO₂e). When the user shares numbers, do the math step-by-step.`,
    suggested: [
      "How does 12 kg CO₂/day compare to the global average?",
      "What's driving most household emissions?",
      "Explain Scope 1, 2, and 3 in plain English.",
      "If I cut driving by 30%, how much CO₂ do I save per year?",
    ],
  },
  "energy-optimizer": {
    id: "energy-optimizer",
    name: "Energy Optimizer",
    role: "Home & electricity",
    tagline: "Cut your power bill and your kWh.",
    description:
      "Reduce electricity use, optimize HVAC, and evaluate solar, heat pumps, and home efficiency upgrades.",
    accent: "text-amber-400",
    icon: Zap,
    systemPrompt: `${SHARED_RULES}\n\nYou are the **Energy Optimizer** agent. Specialty: residential electricity, HVAC efficiency, appliances, solar PV ROI, heat pumps, insulation, smart thermostats, and time-of-use tariffs. Quantify savings in both kWh/year and rough dollar amount when reasonable assumptions allow.`,
    suggested: [
      "How much can a heat pump save me vs gas heating?",
      "What temperature should my thermostat be?",
      "Is rooftop solar worth it for a 3-bedroom house?",
      "How do I find phantom load in my home?",
    ],
  },
  "travel-optimizer": {
    id: "travel-optimizer",
    name: "Travel Optimizer",
    role: "Transport & mobility",
    tagline: "Greener routes, smarter trips.",
    description:
      "Low-carbon route planning, EV vs ICE comparisons, flight alternatives, and weekly commute redesign.",
    accent: "text-sky-400",
    icon: Plane,
    systemPrompt: `${SHARED_RULES}\n\nYou are the **Travel Optimizer** agent. Specialty: transport mode comparison (car ~0.21, bus ~0.10, rail ~0.04, short-haul flight ~0.25, long-haul ~0.15 kg CO₂/passenger-km), EV adoption, multimodal commutes, flight offsets, and car-share/bike infrastructure. Always show a side-by-side mode comparison when relevant.`,
    suggested: [
      "Should I take the train or fly from NYC to DC?",
      "Plan a low-carbon weekly commute for me.",
      "How much CO₂ does an EV save vs a hybrid?",
      "What's the greenest way to do a 500 km trip?",
    ],
  },
  "waste-manager": {
    id: "waste-manager",
    name: "Waste Manager",
    role: "Recycling & circular",
    tagline: "Trash less. Reuse more.",
    description:
      "Recycling guidance, composting, plastic reduction, and circular-economy product choices.",
    accent: "text-lime-400",
    icon: Recycle,
    systemPrompt: `${SHARED_RULES}\n\nYou are the **Waste Manager** agent. Specialty: recycling rules (clean & dry, no wishcycling), composting (browns:greens 3:1), single-use plastic alternatives, e-waste, textile reuse, and the waste hierarchy (refuse → reduce → reuse → recycle → recover). When the user names a product, give a one-line disposal verdict.`,
    suggested: [
      "Can I recycle pizza boxes with grease on them?",
      "How do I start composting in an apartment?",
      "What's the best way to dispose of old electronics?",
      "Help me cut my plastic use in half.",
    ],
  },
  "esg-consultant": {
    id: "esg-consultant",
    name: "ESG Consultant",
    role: "Business & compliance",
    tagline: "ESG reporting, demystified.",
    description:
      "Corporate sustainability strategy, Scope 1-2-3 accounting, CSRD/GRI/TCFD reporting, and SBTi targets.",
    accent: "text-fuchsia-400",
    icon: Building2,
    systemPrompt: `${SHARED_RULES}\n\nYou are the **ESG Consultant** agent. Specialty: corporate ESG reporting frameworks (CSRD, GRI, TCFD, ISSB, SASB), Science-Based Targets (SBTi), GHG Protocol Scope 1/2/3, materiality assessments, double materiality, and assurance levels. Tone: professional, board-ready. Cite framework names exactly.`,
    suggested: [
      "What's the difference between CSRD and GRI?",
      "How do I start a Scope 3 inventory?",
      "Walk me through setting a Science-Based Target.",
      "What's a double materiality assessment?",
    ],
  },
};

export const AGENT_LIST: AgentDef[] = Object.values(AGENTS);
