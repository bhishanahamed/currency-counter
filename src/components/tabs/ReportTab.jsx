import React from 'react';
import { Receipt as ReceiptIcon, Copy, FileText, Image as ImageIcon } from 'lucide-react';
import FlagIcon from '../FlagIcon';
import {
  formatCurrencyAmount,
  amountInWords,
  calculateCounterTotals,
  formatReceiptDate,
  generateTextReceipt,
  getCustomDenomLabel,
  normalizeMoney
} from '../../utils/currencyUtils';

export default function ReportTab({
  darkMode,
  activeCounter,
  activeCurrency,
  reportDate,
  mergedActiveDenoms,
  customDenomsMap = {},
  onViewReceipt,
  notifyFn
}) {
  const stats = activeCounter ? calculateCounterTotals(activeCounter) : { total: 0, notes: 0 };
  const wordsStr = activeCounter ? amountInWords(stats.total, activeCounter.currencyCode) : "";
  const denomsToUse = mergedActiveDenoms || [];
  const hasDecimalDenoms = denomsToUse.some((d) => d % 1 !== 0);

  const handleCopy = () => {
    const txt = generateTextReceipt(activeCounter, activeCurrency, stats.total, stats.notes, wordsStr, reportDate, denomsToUse, customDenomsMap);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt)
        .then(() => notifyFn("Receipt copied"))
        .catch(() => notifyFn("Copy failed"));
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = txt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      notifyFn("Receipt copied");
    }
  };

  const handleDownloadTxt = () => {
    const txt = generateTextReceipt(activeCounter, activeCurrency, stats.total, stats.notes, wordsStr, reportDate, denomsToUse, customDenomsMap);
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${activeCounter?.name || "counter"}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notifyFn("Receipt TXT downloaded");
  };

  const handleDownloadImage = () => {
    const canvas = document.createElement("canvas");
    const width = 560;
    const activeDenomCount = denomsToUse.filter((d) => (activeCounter?.qtys?.[d] || 0) > 0).length || denomsToUse.length;
    const height = 260 + activeDenomCount * 26 + 140;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      notifyFn("Canvas not supported");
      return;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    const margin = 16;
    const innerWidth = width - margin * 2;
    const innerHeight = height - margin * 2 - 10;
    ctx.strokeRect(margin, margin, innerWidth, innerHeight);

    ctx.fillStyle = "#000000";
    ctx.font = "bold 22px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CURRENCY COUNTER", 280, margin + 36);

    ctx.font = "14px Inter, Arial, sans-serif";
    ctx.fillStyle = "#4b5563";
    ctx.fillText("Count your cash quickly", 280, margin + 58);

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(margin, margin + 76);
    ctx.lineTo(margin + innerWidth, margin + 76);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "bold 12px Inter, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Denomination", margin + 24, margin + 106);
    ctx.textAlign = "center";
    ctx.fillText("Quantity", 280, margin + 106);
    ctx.textAlign = "right";
    ctx.fillText("Total", margin + innerWidth - 24, margin + 106);

    let yPos = margin + 132;
    ctx.font = "15px monospace";
    const denomsToDraw = denomsToUse.filter((d) => (activeCounter?.qtys?.[d] || 0) > 0);
    const finalDenoms = denomsToDraw.length ? denomsToDraw : denomsToUse;

    finalDenoms.forEach((denom) => {
      const qty = activeCounter?.qtys?.[denom] || 0;
      const label = getCustomDenomLabel(activeCurrency.code, denom, customDenomsMap);
      const labelStr = label ? ` (${label})` : "";
      const lineTotal = normalizeMoney(denom * qty);

      ctx.textAlign = "left";
      ctx.fillText(`${activeCurrency.symbol}${formatCurrencyAmount(denom, activeCurrency.code, hasDecimalDenoms)}${labelStr}`, margin + 24, yPos);
      ctx.textAlign = "center";
      ctx.fillText(`[ ${String(qty).padStart(2, " ")} ]`, 280, yPos);
      ctx.textAlign = "right";
      ctx.fillText(`${activeCurrency.symbol}${formatCurrencyAmount(lineTotal, activeCurrency.code, hasDecimalDenoms)}`, margin + innerWidth - 24, yPos);
      yPos += 26;
    });

    yPos += 10;
    ctx.beginPath();
    ctx.moveTo(margin, yPos);
    ctx.lineTo(margin + innerWidth, yPos);
    ctx.stroke();

    yPos += 28;
    ctx.font = "bold 11px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TOTAL", 280, yPos);

    yPos += 30;
    ctx.font = "bold 30px Inter, Arial, sans-serif";
    ctx.fillText(`${activeCurrency.symbol}${formatCurrencyAmount(stats.total, activeCurrency.code, hasDecimalDenoms)}`, 280, yPos);

    yPos += 32;
    ctx.font = "11px Inter, Arial, sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(`Date: ${formatReceiptDate(reportDate)}  •  ${stats.notes} items  •  ${activeCounter?.name || ""} ${activeCurrency.code}`, 280, yPos);

    yPos += 16;
    ctx.font = "11px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    const wrappedWords = wordsStr.match(/.{1,52}/g) || [wordsStr];
    wrappedWords.forEach((chunk) => {
      ctx.fillText(chunk, 280, yPos);
      yPos += 14;
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `receipt-${activeCounter?.name || "counter"}-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      notifyFn("Receipt image downloaded");
    }, "image/png");
  };

  const activeDenomItems = denomsToUse
    .map((d) => ({ denom: d, qty: activeCounter?.qtys?.[d] || 0 }))
    .filter((item) => item.qty > 0);

  const displayItems = activeDenomItems.length
    ? activeDenomItems
    : denomsToUse.map((d) => ({ denom: d, qty: 0 }));

  return (
    <div className="space-y-6 max-w-[560px] mx-auto">
      {/* Top Bar */}
      <div className={`rounded-2xl border p-6 flex items-center justify-between ${
        darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl grid place-items-center ${
            darkMode ? "bg-[#1a2740]" : "bg-slate-900 text-white"
          }`}>
            <ReceiptIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Receipt Report</h1>
            <div className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {activeCounter?.name} • {activeCurrency.code}
            </div>
          </div>
        </div>

        <button
          onClick={onViewReceipt}
          className="px-3 py-2 rounded-lg bg-[#16a34a] text-white text-xs font-semibold hover:bg-[#15803d] transition"
        >
          View Full Receipt
        </button>
      </div>

      {/* Embedded Printable Receipt Preview Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-[420px] bg-white text-black border-[2px] border-black rounded-[14px] overflow-hidden select-text shadow-[0_8px_30px_rgba(0,0,0,0.08)]">

          <div className="px-6 pt-6 pb-4 text-center">
            <div className="font-extrabold text-[17px] tracking-[0.08em] leading-none">
              CURRENCY COUNTER
            </div>
            <div className="mt-1.5 text-[12px] tracking-wide text-black/60 font-medium">
              Count your cash quickly
            </div>
          </div>

          <div className="h-[1.5px] bg-black mx-0" />

          <div className="px-6 py-3 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold">
              <FlagIcon currency={activeCurrency} size="sm" /> {activeCounter?.name || "Counter 1"} • {activeCurrency.code}
            </span>
            <span className="text-[10px] text-black/50">
              {formatReceiptDate(reportDate)}
            </span>
          </div>

          <div className="h-[1px] bg-black/15 mx-6" />

          <div className="px-6 py-3 grid grid-cols-[1fr_90px_1fr] text-[11px] font-bold tracking-[0.06em] uppercase text-black/60">
            <span>Denomination</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
          </div>

          <div className="px-6">
            <div className="h-[1px] bg-black/10" />
          </div>

          <div className="px-2 py-2">
            {displayItems.map(({ denom, qty }) => {
              const lineTotal = normalizeMoney(denom * qty);
              const label = getCustomDenomLabel(activeCurrency.code, denom, customDenomsMap);

              return (
                <div key={denom} className="grid grid-cols-[1fr_90px_1fr] items-center px-4 py-[7px] text-[14px] font-medium">
                  <span className="font-mono font-bold tracking-tight text-xs sm:text-[14px]">
                    {activeCurrency.symbol}{formatCurrencyAmount(denom, activeCurrency.code, hasDecimalDenoms)}
                    {label && <span className="text-[10px] block font-normal opacity-70">({label})</span>}
                  </span>
                  <span className="text-center font-mono text-[13px] tracking-wide">
                    <span className="inline-flex items-center justify-center min-w-[58px] px-2 py-0.5 rounded-[6px] border border-black/15 bg-black/[0.02]">
                      [ {String(qty).padStart(2, " ")} ]
                    </span>
                  </span>
                  <span className="text-right font-mono font-bold">
                    {activeCurrency.symbol}{formatCurrencyAmount(lineTotal, activeCurrency.code, hasDecimalDenoms)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="h-[1.5px] bg-black mx-0 mt-1" />

          <div className="px-6 py-5 text-center">
            <div className="text-[11px] tracking-[0.18em] font-bold text-black/50">
              TOTAL
            </div>
            <div className="mt-1.5 text-[30px] font-extrabold tracking-tight leading-none">
              {activeCurrency.symbol}{formatCurrencyAmount(stats.total, activeCurrency.code, hasDecimalDenoms)}
            </div>
            <div className="mt-2 text-[11px] text-black/60 font-mono">
              {stats.notes} items
            </div>
          </div>

          <div className="h-[1px] bg-black/15 mx-6" />

          <div className="px-6 py-3 space-y-1.5">
            <div className="text-[10px] text-black/50 font-medium">
              Date: {formatReceiptDate(reportDate)}
            </div>
            <div className="text-[10px] leading-[1.4] text-black/70 font-medium">
              In Words: {wordsStr || "Zero"}
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons Row */}
      <div className={`rounded-2xl border p-4 flex flex-wrap gap-2 justify-center ${
        darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <button
          onClick={onViewReceipt}
          aria-label="View Full Receipt Modal"
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-black transition"
        >
          <ReceiptIcon className="w-4 h-4" />
          <span>View Receipt</span>
        </button>
        <button
          onClick={handleCopy}
          aria-label="Copy receipt text to clipboard"
          className={`px-4 py-2 rounded-lg border text-sm font-semibold flex items-center gap-1.5 transition ${
            darkMode ? "border-slate-700 bg-[#1a2538] hover:bg-[#22334f]" : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <Copy className="w-4 h-4" />
          <span>Copy Receipt</span>
        </button>
        <button
          onClick={handleDownloadTxt}
          aria-label="Download receipt as text file"
          className={`px-4 py-2 rounded-lg border text-sm font-semibold flex items-center gap-1.5 transition ${
            darkMode ? "border-slate-700 bg-[#1a2538] hover:bg-[#22334f]" : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Download TXT</span>
        </button>
        <button
          onClick={handleDownloadImage}
          aria-label="Download receipt as image"
          className={`px-4 py-2 rounded-lg border text-sm font-semibold flex items-center gap-1.5 transition ${
            darkMode ? "border-slate-700 bg-[#1a2538] hover:bg-[#22334f]" : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Download Image</span>
        </button>
      </div>
    </div>
  );
}
