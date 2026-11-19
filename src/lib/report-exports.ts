import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReportPayload } from "@/lib/reports.functions";

function filenameBase(r: ReportPayload) {
  const d = new Date(r.generatedAt).toISOString().slice(0, 10);
  return `ecotrack-${r.type}-${d}`;
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportCSV(r: ReportPayload) {
  const lines: string[] = [];
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  lines.push(`${r.title}`);
  lines.push(`Generated,${r.generatedAt}`);
  lines.push(`User,${r.user.name} (${r.user.email})`);
  lines.push(`Period,${r.period.from} to ${r.period.to}`);
  lines.push("");
  lines.push("Metric,Value,Hint");
  for (const m of r.metrics) lines.push([m.label, m.value, m.hint ?? ""].map(esc).join(","));
  for (const t of r.tables) {
    lines.push("");
    lines.push(t.title);
    lines.push(t.columns.map(esc).join(","));
    for (const row of t.rows) lines.push(row.map(esc).join(","));
  }
  lines.push("");
  lines.push("Raw Entries");
  lines.push("Date,Category,Subcategory,Amount,Unit,CO2 (kg),Notes");
  for (const e of r.rawEntries)
    lines.push(
      [e.entry_date, e.category, e.subcategory ?? "", e.amount, e.unit ?? "", e.co2_kg, e.notes ?? ""].map(esc).join(",")
    );
  download(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }), `${filenameBase(r)}.csv`);
}

export function exportXLSX(r: ReportPayload) {
  const wb = XLSX.utils.book_new();
  const summary = [
    [r.title],
    ["Generated", r.generatedAt],
    ["User", `${r.user.name} (${r.user.email})`],
    ["Period", `${r.period.from} to ${r.period.to}`],
    [],
    ["Metric", "Value", "Hint"],
    ...r.metrics.map((m) => [m.label, m.value, m.hint ?? ""]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), "Summary");
  for (const t of r.tables) {
    const aoa = [[t.title], t.columns, ...t.rows];
    const safe = t.title.replace(/[^\w ]/g, "").slice(0, 28) || "Sheet";
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), safe);
  }
  const narr = [["Section", "Body"], ...r.narrative.map((s) => [s.heading, s.body])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(narr), "Narrative");
  const recs = [["#", "Recommendation"], ...r.recommendations.map((x, i) => [i + 1, x])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(recs), "Recommendations");
  const rawHeader = ["Date", "Category", "Subcategory", "Amount", "Unit", "CO2 (kg)", "Notes"];
  const raw = [
    rawHeader,
    ...r.rawEntries.map((e) => [e.entry_date, e.category, e.subcategory ?? "", e.amount, e.unit ?? "", e.co2_kg, e.notes ?? ""]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(raw), "Raw Entries");
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  download(new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${filenameBase(r)}.xlsx`);
}

export function exportPDF(r: ReportPayload) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  let y = 48;

  doc.setFillColor(16, 78, 64);
  doc.rect(0, 0, W, 84, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("EcoTrack AI", 40, 40);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(r.title, 40, 62);
  y = 110;

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.text(`${r.user.name} • ${r.user.email}`, 40, y);
  doc.text(`Period: ${r.period.from} → ${r.period.to}`, 40, y + 14);
  doc.text(`Generated: ${new Date(r.generatedAt).toLocaleString()}`, 40, y + 28);
  y += 50;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value", "Hint"]],
    body: r.metrics.map((m) => [m.label, m.value, m.hint ?? ""]),
    headStyles: { fillColor: [16, 78, 64] },
    styles: { fontSize: 9 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

  for (const t of r.tables) {
    if (y > 700) { doc.addPage(); y = 48; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(t.title, 40, y);
    autoTable(doc, {
      startY: y + 8,
      head: [t.columns],
      body: t.rows.length ? t.rows.map((row) => row.map((c) => String(c))) : [["—", ...t.columns.slice(1).map(() => "")]],
      headStyles: { fillColor: [16, 78, 64] },
      styles: { fontSize: 9 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  }

  if (r.narrative.length) {
    if (y > 680) { doc.addPage(); y = 48; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("AI Analysis", 40, y);
    y += 16;
    doc.setFontSize(10);
    for (const s of r.narrative) {
      const body = doc.splitTextToSize(s.body, W - 80);
      const need = 18 + body.length * 12 + 8;
      if (y + need > 800) { doc.addPage(); y = 48; }
      doc.setFont("helvetica", "bold");
      doc.text(s.heading, 40, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.text(body, 40, y);
      y += body.length * 12 + 10;
    }
  }

  if (r.recommendations.length) {
    if (y > 720) { doc.addPage(); y = 48; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Recommendations", 40, y);
    y += 8;
    autoTable(doc, {
      startY: y + 4,
      head: [["#", "Recommendation"]],
      body: r.recommendations.map((x, i) => [String(i + 1), x]),
      headStyles: { fillColor: [16, 78, 64] },
      styles: { fontSize: 9 },
      columnStyles: { 0: { cellWidth: 30 } },
    });
  }

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`EcoTrack AI • ${r.title} • page ${i} / ${pages}`, 40, 820);
  }

  doc.save(`${filenameBase(r)}.pdf`);
}
