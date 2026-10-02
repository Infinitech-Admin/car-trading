"use client";

import { useMemo, useState } from "react";
import { Calculator, Download, FileText } from "lucide-react";

/**
 * Internal rate used only for computing the monthly estimate.
 * Palitan ng rate ng partner bank/dealership.
 * NOTE: Nasa client bundle ito, kaya makikita pa rin sa dev tools.
 * Kung confidential talaga, ilipat ang computation sa backend API.
 */
const ANNUAL_RATE = 0.08;

/**
 * false (default): hindi ipapakita ang rate, total interest, at total payable.
 *                  Monthly estimate lang ang makikita ng customer.
 * true: ipapakita ang rate at ang interest breakdown (UI, PDF, Word).
 */
const SHOW_INTEREST_BREAKDOWN = false;

const DP_OPTIONS = [10, 20, 30] as const;
const TERM_YEARS = [1, 2, 3] as const;

const DISCLAIMER =
  "This is an estimate only and not a loan approval or binding offer. Final rates, fees and terms are subject to bank/dealer approval.";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF980D]";

type Plan = {
  years: number;
  months: number;
  monthly: number;
  totalInterest: number;
  totalPayable: number;
};

/** "₱1,250,000" | "1250000" | 1250000 -> 1250000 */
export function parsePrice(price: string | number): number {
  if (typeof price === "number") return price;
  const n = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function monthlyPayment(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

const fmt = (n: number, symbol = "₱") =>
  `${symbol}${Math.round(n).toLocaleString("en-PH")}`;

function buildPlans(financed: number): Plan[] {
  return TERM_YEARS.map((years) => {
    const months = years * 12;
    const monthly = monthlyPayment(financed, ANNUAL_RATE, months);
    const totalPayable = monthly * months;
    return {
      years,
      months,
      monthly,
      totalPayable,
      totalInterest: totalPayable - financed,
    };
  });
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const termLabel = (p: Plan) =>
  `${p.years} year${p.years > 1 ? "s" : ""} (${p.months} mos)`;

export default function FinancingCalculator({
  carName,
  price,
  year,
  disabled = false,
}: {
  carName: string;
  price: string | number;
  year?: number | string;
  disabled?: boolean;
}) {
  const [dp, setDp] = useState<(typeof DP_OPTIONS)[number]>(30);

  const total = parsePrice(price);

  const { downPayment, financed, plans } = useMemo(() => {
    const downPayment = (total * dp) / 100;
    const financed = total - downPayment;
    return { downPayment, financed, plans: buildPlans(financed) };
  }, [total, dp]);

  if (total <= 0) return null;

  const safeName = carName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const title = `${year ? `${year} ` : ""}${carName}`;

  /* ----------------------------- PDF ----------------------------- */
  const downloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    // Helvetica has no ₱ glyph, so use "PHP " in the PDF.
    const money = (n: number) => fmt(n, "PHP ");

    let y = 56;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Financing Quotation", 48, y);

    y += 28;
    doc.setFontSize(14);
    doc.text(title, 48, y);

    y += 24;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const summary: [string, string][] = [
      ["Vehicle price", money(total)],
      [`Down payment (${dp}%)`, money(downPayment)],
      ["Amount financed", money(financed)],
    ];
    if (SHOW_INTEREST_BREAKDOWN) {
      summary.push([
        "Interest rate",
        `${(ANNUAL_RATE * 100).toFixed(2)}% per year`,
      ]);
    }
    summary.forEach(([label, value]) => {
      doc.text(label, 48, y);
      doc.text(value, 547, y, { align: "right" });
      y += 18;
    });

    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("Term", 48, y);
    if (SHOW_INTEREST_BREAKDOWN) {
      doc.text("Monthly", 200, y);
      doc.text("Total interest", 340, y);
      doc.text("Total payable", 547, y, { align: "right" });
    } else {
      doc.text("Estimated monthly", 547, y, { align: "right" });
    }
    y += 6;
    doc.line(48, y, 547, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    plans.forEach((p) => {
      doc.text(termLabel(p), 48, y);
      if (SHOW_INTEREST_BREAKDOWN) {
        doc.text(money(p.monthly), 200, y);
        doc.text(money(p.totalInterest), 340, y);
        doc.text(money(p.totalPayable), 547, y, { align: "right" });
      } else {
        doc.text(money(p.monthly), 547, y, { align: "right" });
      }
      y += 20;
    });

    y += 20;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(doc.splitTextToSize(DISCLAIMER, 499), 48, y);

    doc.save(`financing-${safeName}-${dp}dp.pdf`);
  };

  /* ---------------------------- WORD ----------------------------- */
  // HTML-based .doc: opens directly in Microsoft Word, no extra library needed.
  const downloadWord = () => {
    const header = SHOW_INTEREST_BREAKDOWN
      ? "<tr><th>Term</th><th>Monthly</th><th>Total interest</th><th>Total payable</th></tr>"
      : "<tr><th>Term</th><th>Estimated monthly</th></tr>";

    const rows = plans
      .map((p) =>
        SHOW_INTEREST_BREAKDOWN
          ? `<tr><td>${termLabel(p)}</td><td>${fmt(p.monthly)}</td><td>${fmt(p.totalInterest)}</td><td>${fmt(p.totalPayable)}</td></tr>`
          : `<tr><td>${termLabel(p)}</td><td>${fmt(p.monthly)}</td></tr>`,
      )
      .join("");

    const rateRow = SHOW_INTEREST_BREAKDOWN
      ? `<tr><td>Interest rate</td><td>${(ANNUAL_RATE * 100).toFixed(2)}% per year</td></tr>`
      : "";

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Financing Quotation</title>
<style>
  body{font-family:Calibri,Arial,sans-serif;font-size:11pt}
  h1{font-size:20pt;margin-bottom:0}
  h2{font-size:14pt;margin-top:4pt}
  table{border-collapse:collapse;width:100%;margin-top:12pt}
  th,td{border:1px solid #999;padding:6pt;text-align:left}
  th{background:#BF980D;color:#000}
  .note{color:#777;font-size:9pt;margin-top:16pt}
</style></head>
<body>
  <h1>Financing Quotation</h1>
  <h2>${title}</h2>
  <table>
    <tr><td>Vehicle price</td><td>${fmt(total)}</td></tr>
    <tr><td>Down payment (${dp}%)</td><td>${fmt(downPayment)}</td></tr>
    <tr><td>Amount financed</td><td>${fmt(financed)}</td></tr>
    ${rateRow}
  </table>
  <table>
    ${header}
    ${rows}
  </table>
  <p class="note">${DISCLAIMER}</p>
</body></html>`;

    download(
      new Blob(["\ufeff", html], { type: "application/msword" }),
      `financing-${safeName}-${dp}dp.doc`,
    );
  };

  return (
    <section
      aria-label="Financing"
      className="min-w-0 rounded-[28px] border border-white/10 bg-[#100e0c] p-5 sm:p-6"
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#BF980D]/10">
          <Calculator className="text-[#BF980D]" size={18} />
        </div>
        <h2 className="text-xl font-bold text-white">Financing</h2>
      </div>

      {/* Down payment buttons */}
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        Down payment
      </p>
      <div
        role="group"
        aria-label="Down payment percentage"
        className="mt-3 flex flex-wrap gap-2"
      >
        {DP_OPTIONS.map((opt) => {
          const active = opt === dp;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => setDp(opt)}
              className={`rounded-full border px-5 py-2.5 text-sm font-bold transition-all ${
                active
                  ? "border-[#BF980D] bg-[#BF980D] text-black"
                  : "border-white/15 bg-white/5 text-white hover:border-[#BF980D]/60"
              } ${focusRing}`}
            >
              {opt}%
            </button>
          );
        })}
      </div>

      {/* Summary: auto-fits 1 to 3 columns based on the card's own width */}
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-3">
        {[
          ["Vehicle price", fmt(total)],
          [`Down payment (${dp}%)`, fmt(downPayment)],
          ["Amount financed", fmt(financed)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-2xl border border-white/10 bg-[#171410] p-4"
          >
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-1 break-words text-lg font-bold text-white">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Term cards (1 / 2 / 3 years): auto-fit so they never overflow */}
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-3">
        {plans.map((p) => (
          <div
            key={`${dp}-${p.years}`}
            className="min-w-0 rounded-2xl border border-[#BF980D]/25 bg-[#171410] p-4 transition-colors hover:border-[#BF980D]/60 sm:p-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#F3D77A]">
              {p.years} year{p.years > 1 ? "s" : ""} · {p.months} months
            </p>
            <p className="mt-3 break-words text-2xl font-black leading-tight text-[#BF980D]">
              {fmt(p.monthly)}
            </p>
            <p className="text-xs text-zinc-500">estimated per month</p>

            {SHOW_INTEREST_BREAKDOWN && (
              <div className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-500">Total interest</span>
                  <span className="font-semibold text-white">
                    {fmt(p.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-500">Total payable</span>
                  <span className="font-semibold text-white">
                    {fmt(p.totalPayable)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Downloads */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={downloadPdf}
          className={`inline-flex min-w-[9rem] flex-1 items-center justify-center gap-2 rounded-full bg-[#BF980D] px-5 py-3 text-sm font-bold text-black transition-all hover:bg-[#d8b53c] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
        >
          <Download size={16} />
          Download PDF
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={downloadWord}
          className={`inline-flex min-w-[9rem] flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:border-[#BF980D] hover:bg-[#BF980D]/10 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
        >
          <FileText size={16} />
          Download Word
        </button>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Estimate only. Final rates and terms are subject to bank/dealer
        approval.
      </p>
    </section>
  );
}
