// Shared mock/sample data for charts & dashboards
export const dailyEmissions = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  co2: +(8 + Math.sin(i / 2) * 3 + Math.random() * 2).toFixed(1),
  target: 8,
}));

export const monthlyEmissions = [
  { m: "Jan", co2: 280, offset: 60 },
  { m: "Feb", co2: 260, offset: 70 },
  { m: "Mar", co2: 245, offset: 90 },
  { m: "Apr", co2: 230, offset: 110 },
  { m: "May", co2: 215, offset: 130 },
  { m: "Jun", co2: 200, offset: 150 },
  { m: "Jul", co2: 195, offset: 170 },
  { m: "Aug", co2: 180, offset: 190 },
  { m: "Sep", co2: 170, offset: 210 },
  { m: "Oct", co2: 160, offset: 230 },
  { m: "Nov", co2: 150, offset: 250 },
  { m: "Dec", co2: 140, offset: 280 },
];

export const categoryBreakdown = [
  { name: "Transport", value: 38, color: "#00C853" },
  { name: "Energy", value: 26, color: "#64DD17" },
  { name: "Food", value: 22, color: "#1B5E20" },
  { name: "Shopping", value: 14, color: "#26A69A" },
];

export const forecast = Array.from({ length: 12 }).map((_, i) => ({
  m: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  actual: i < 6 ? 200 - i * 8 : null,
  predicted: 200 - i * 10 + (i >= 6 ? Math.sin(i) * 4 : 0),
}));

export const leaderboard = [
  { rank: 1, name: "Aanya Patel", points: 14820, badge: "Eco Legend" },
  { rank: 2, name: "Liam Chen", points: 13990, badge: "Green Champion" },
  { rank: 3, name: "Maya Rao", points: 12450, badge: "Climate Hero" },
  { rank: 4, name: "Noah Singh", points: 11380, badge: "Earth Guardian" },
  { rank: 5, name: "Sofia Müller", points: 10210, badge: "Forest Friend" },
];

export const riskWidgets = [
  { name: "Flood Risk", value: 32, level: "Moderate", color: "#26A69A" },
  { name: "Heatwave Risk", value: 71, level: "High", color: "#FF7043" },
  { name: "Air Pollution Index", value: 168, level: "Unhealthy", color: "#EF5350" },
  { name: "Water Scarcity", value: 48, level: "Moderate", color: "#FFCA28" },
];

// Emissions coefficients (kg CO2 per unit) – simplified
export const emissionFactors = {
  carKm: 0.21,
  bikeKm: 0,
  publicKm: 0.05,
  flightKm: 0.25,
  evKm: 0.05,
  electricityKwh: 0.45,
  acHours: 1.2,
  lpgKg: 2.9,
  solarKwh: -0.45,
  vegMeal: 1.0,
  nonVegMeal: 4.5,
  dairyKg: 3.0,
  fastFood: 5.0,
  clothing: 12.0,
  electronics: 90,
  delivery: 0.8,
};
