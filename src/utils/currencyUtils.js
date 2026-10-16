import { DEFAULT_CURRENCIES, CURRENCY_CONFIG, CURRENCY_WORDS_SUFFIX } from '../data/currencies.js';
import { amountInWords, MAX_INDIAN_WORDS_AMOUNT } from './numberToWords.js';
import {
  COUNTERS_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
  CUSTOM_DENOMS_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  getDefaultCounters,
  getDefaultSettings,
  getEmptyCustomDenomsObj,
  validateAndSanitizeCounters,
  validateAndSanitizeHistory,
  validateAndSanitizeCustomDenoms,
  validateAndSanitizeSettings,
  loadCountersFromStorage,
  loadHistoryFromStorage,
  loadCustomDenomsFromStorage,
  loadSettingsFromStorage,
  clearAllApplicationData,
  MAX_CUSTOM_DENOM_LABEL_LENGTH,
  MAX_QUANTITY
} from './storage.js';

export {
  amountInWords,
  MAX_INDIAN_WORDS_AMOUNT,
  COUNTERS_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
  CUSTOM_DENOMS_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  MAX_CUSTOM_DENOM_LABEL_LENGTH,
  MAX_QUANTITY,
  getDefaultCounters,
  getDefaultSettings,
  getEmptyCustomDenomsObj,
  validateAndSanitizeCounters,
  validateAndSanitizeHistory,
  validateAndSanitizeCustomDenoms,
  validateAndSanitizeSettings,
  loadCountersFromStorage,
  loadHistoryFromStorage,
  loadCustomDenomsFromStorage,
  loadSettingsFromStorage,
  clearAllApplicationData
};

export function getCurrencyObj(code) {
  return DEFAULT_CURRENCIES[code] ?? DEFAULT_CURRENCIES.INR;
}

export function getCurrencyConfig(code) {
  return CURRENCY_CONFIG[code] ?? CURRENCY_CONFIG.INR;
}

/**
 * Normalizes money according to currency-specific decimal rules
 * Decimals = 2 -> round to 2 decimal places
 * Decimals = 0 -> round to integer
 */
export function normalizeMoney(value, currencyCode = "INR") {
  const num = Number(value);
  if (isNaN(num)) return 0;
  const config = getCurrencyConfig(currencyCode);
  if (config.decimals === 0) {
    return Math.round(num);
  }
  const factor = Math.pow(10, config.decimals);
  return Math.round(num * factor) / factor;
}

export function createZeroQuantities(denoms) {
  const qtys = {};
  (denoms || []).forEach((item) => {
    const denomVal = typeof item === 'object' && item !== null ? item.value : item;
    const num = parseFloat(denomVal);
    if (!isNaN(num) && num > 0) {
      qtys[num] = 0;
    }
  });
  return qtys;
}

/**
 * Format currency amount with currency-specific locale and appropriate decimal precision
 */
export function formatCurrencyAmount(amount, currencyCode = "INR", forceDecimals = false) {
  const config = getCurrencyConfig(currencyCode);
  const locale = config.locale || "en-US";
  const num = Number(amount) || 0;
  const hasDecimals = Math.abs(num % 1) > 0.00001;

  const showDecimals = (forceDecimals || hasDecimals) && config.decimals > 0;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: showDecimals ? config.decimals : 0,
    maximumFractionDigits: showDecimals ? config.decimals : 0
  }).format(num);
}

/**
 * Calculates counter totals with integer minor units according to currency precision
 * For decimals=2: uses 100 minor units per major unit
 * For decimals=0: uses whole units directly
 * Avoids floating-point errors (e.g. 0.50 * 10 = 5.00, 0.25 * 4 = 1.00)
 */
export function calculateCounterTotals(counter) {
  if (!counter) {
    return { total: 0, notes: 0, items: 0, expected: 0, diff: 0 };
  }

  const code = counter.currencyCode || "INR";
  const config = getCurrencyConfig(code);
  const factor = config.decimals === 0 ? 1 : Math.pow(10, config.decimals);

  let totalMinorUnits = 0;
  let items = 0;
  const qtys = counter.qtys || {};

  Object.entries(qtys).forEach(([denomStr, qtyVal]) => {
    const denom = parseFloat(denomStr);
    if (isNaN(denom) || denom <= 0) return;
    const qty = Math.max(0, Math.min(MAX_QUANTITY, parseInt(qtyVal, 10) || 0));
    if (qty > 0) {
      totalMinorUnits += Math.round(denom * factor) * qty;
      items += qty;
    }
  });

  const total = totalMinorUnits / factor;
  const rawExpected = (counter.expectedStr || "").trim();
  const expectedNum = parseFloat(rawExpected.replace(/[^0-9.]/g, ""));
  const expected = isNaN(expectedNum) ? 0 : normalizeMoney(expectedNum, code);

  // If no expected cash is entered and expected is 0, diff is 0
  const diff = rawExpected === "" && expected === 0 ? 0 : normalizeMoney(total - expected, code);

  return { total, notes: items, items, expected, diff };
}

export function remapQuantities(existingQtys, newDenoms) {
  const remapped = {};
  newDenoms.forEach((item) => {
    const denom = typeof item === 'object' && item !== null ? item.value : item;
    remapped[denom] = 0;
  });
  return remapped;
}

/**
 * Returns merged sorted array of unique denomination numbers
 */
export function getMergedDenoms(currencyCode, customDenomsMap = {}) {
  const defaultDenoms = getCurrencyObj(currencyCode).denoms;
  const customList = customDenomsMap[currencyCode] || [];
  const config = getCurrencyConfig(currencyCode);

  const rawValues = [
    ...defaultDenoms,
    ...customList.map((item) => (typeof item === 'object' && item !== null ? item.value : item))
  ];

  const uniqueDenoms = [];
  rawValues.forEach((val) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      if (config.decimals === 0 && num % 1 !== 0) return;
      const valStr = String(val);
      const dotParts = valStr.split(".");
      if (dotParts.length === 2 && dotParts[1].length > config.decimals) return;
      const rounded = config.decimals === 0 ? Math.round(num) : Math.round(num * 100) / 100;
      if (!uniqueDenoms.some((item) => Math.abs(item - rounded) < 0.000001)) {
        uniqueDenoms.push(rounded);
      }
    }
  });

  uniqueDenoms.sort((a, b) => b - a);
  return uniqueDenoms;
}

/**
 * Get custom denomination label if present
 */
export function getCustomDenomLabel(currencyCode, denomVal, customDenomsMap = {}) {
  const list = customDenomsMap[currencyCode] || [];
  const found = list.find((item) => {
    if (typeof item === 'object' && item !== null) {
      return Math.abs(item.value - denomVal) < 0.0001;
    }
    return false;
  });
  return found?.label || "";
}

export function formatReceiptDate(dateObj) {
  const d = dateObj instanceof Date ? dateObj : new Date();
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

export function generateTextReceipt(counter, currency, totalVal, totalItems, wordsStr, dateObj, denomsList, customDenomsMap = {}) {
  if (!counter) return "";
  const lines = [];
  lines.push("┌──────────────────────────────────────┐");
  lines.push("│          CURRENCY COUNTER            │");
  lines.push("│      Count your cash quickly         │");
  lines.push("├──────────────────────────────────────┤");
  lines.push("│                                      │");
  lines.push(`│  Counter: ${(counter.name + " (" + currency.code + ")").padEnd(28, " ")}│`);
  lines.push("│                                      │");
  lines.push(`│  ${"Denomination".padEnd(15)} ${"Quantity".padEnd(10)} ${"Total".padStart(8)} │`);
  lines.push("│                                      │");

  const denomsToUse = denomsList || getMergedDenoms(counter.currencyCode, customDenomsMap);
  const hasDecimalDenoms = denomsToUse.some((d) => d % 1 !== 0);
  let hasActiveItems = false;

  denomsToUse.forEach((denom) => {
    const qty = counter.qtys?.[denom] || 0;
    if (qty === 0) return;
    hasActiveItems = true;
    const label = getCustomDenomLabel(currency.code, denom, customDenomsMap);
    const denomFormatted = `${currency.symbol}${formatCurrencyAmount(denom, currency.code, hasDecimalDenoms)}${label ? ` (${label})` : ""}`;
    const denomCol = denomFormatted.slice(0, 14).padEnd(14);
    const qtyCol = `[${String(qty).padStart(3, " ")} ]`;
    const lineTotal = normalizeMoney(denom * qty, currency.code);
    const lineVal = `${currency.symbol}${formatCurrencyAmount(lineTotal, currency.code, hasDecimalDenoms)}`.padStart(9);
    lines.push(`│  ${denomCol} ${qtyCol.padStart(9)} ${lineVal.padStart(9)} │`);
  });

  if (!hasActiveItems) {
    denomsToUse.forEach((denom) => {
      const label = getCustomDenomLabel(currency.code, denom, customDenomsMap);
      const denomFormatted = `${currency.symbol}${formatCurrencyAmount(denom, currency.code, hasDecimalDenoms)}${label ? ` (${label})` : ""}`;
      const denomCol = denomFormatted.slice(0, 14).padEnd(14);
      const zeroVal = `${currency.symbol}0`.padStart(9);
      lines.push(`│  ${denomCol} ${"[ 0 ]".padStart(9)} ${zeroVal.padStart(9)} │`);
    });
  }

  lines.push("│                                      │");
  lines.push("├──────────────────────────────────────┤");
  lines.push("│              TOTAL                   │");
  lines.push(`│            ${currency.symbol}${formatCurrencyAmount(totalVal, currency.code, hasDecimalDenoms).padStart(10)}            │`);
  lines.push("└──────────────────────────────────────┘");
  lines.push("");
  lines.push(`Date: ${formatReceiptDate(dateObj)}`);
  lines.push(`Items: ${totalItems}`);
  lines.push(`In Words: ${wordsStr}`);

  return lines.join("\n");
}

export function exportToCSV(counters, combinedByCurrency, notifyFn, customDenomsMap = {}) {
  const rows = [
    ["Counter", "CounterID", "CurrencyCode", "CurrencySymbol", "CurrencyName", "Denomination", "CustomLabel", "Quantity", "Value", "CounterTotal", "CounterItems"].join(",")
  ];

  counters.forEach((counter) => {
    const stats = calculateCounterTotals(counter);
    const currency = getCurrencyObj(counter.currencyCode);
    const hasDecimalDenoms = Object.keys(counter.qtys || {}).some((d) => parseFloat(d) % 1 !== 0);

    let hasAnyItems = false;
    Object.entries(counter.qtys || {}).forEach(([denomStr, qtyVal]) => {
      const denom = parseFloat(denomStr);
      const qty = qtyVal || 0;
      if (qty === 0) return;
      hasAnyItems = true;
      const label = getCustomDenomLabel(currency.code, denom, customDenomsMap);
      const lineTotal = normalizeMoney(denom * qty, currency.code);

      rows.push([
        `"${counter.name.replace(/"/g, '""')}"`,
        counter.id,
        currency.code,
        currency.symbol,
        `"${currency.name}"`,
        denom,
        `"${label.replace(/"/g, '""')}"`,
        qty,
        lineTotal,
        stats.total,
        stats.items
      ].join(","));
    });

    if (!hasAnyItems) {
      rows.push([
        `"${counter.name.replace(/"/g, '""')}"`,
        counter.id,
        currency.code,
        currency.symbol,
        `"${currency.name}"`,
        0,
        '""',
        0, 0, 0, 0
      ].join(","));
    }
  });

  rows.push("");
  rows.push("CombinedByCurrency");
  rows.push("CurrencyCode,Total,Items,InWords");

  combinedByCurrency.forEach((item) => {
    rows.push(`${item.currency.code},${item.total},${item.notes},"${amountInWords(item.total, item.currency.code).replace(/"/g, '""')}"`);
  });

  const csvContent = rows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const dateStr = new Date().toISOString().slice(0, 10);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `currency-counter-${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  if (notifyFn) notifyFn("CSV exported");
}

export function buildWhatsAppShareText({
  counter,
  currency,
  counters = [],
  combinedByCurrency = [],
  grandWords = "",
  reportDate = new Date(),
  customDenomsMap = {},
  options = {}
}) {
  const {
    scope = "active",
    includeBreakdown = true,
    includeTally = true,
    includeWords = true,
    includeTimestamp = true,
    customNote = ""
  } = options;

  const dateStr = formatReceiptDate(reportDate);

  if (scope === "active" && counter && currency) {
    const stats = calculateCounterTotals(counter);
    const denoms = getMergedDenoms(counter.currencyCode, customDenomsMap);
    const hasDecimals = denoms.some((d) => d % 1 !== 0);
    const lines = [];

    lines.push("🧾 *CASH DENOMINATION REPORT*");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    if (includeTimestamp) {
      lines.push(`📅 *Date:* ${dateStr}`);
    }
    lines.push(`🏷️ *Counter:* ${counter.name || "Counter 1"} (${currency.code})`);
    if (customNote && customNote.trim()) {
      lines.push(`💬 *Note:* ${customNote.trim()}`);
    }
    lines.push("━━━━━━━━━━━━━━━━━━━━");

    if (includeBreakdown) {
      lines.push("*DENOMINATION BREAKDOWN:*");
      const activeRows = [];
      denoms.forEach((denom) => {
        const qty = counter.qtys?.[denom] || 0;
        if (qty > 0) {
          const lineTotal = normalizeMoney(denom * qty, currency.code);
          const label = getCustomDenomLabel(currency.code, denom, customDenomsMap);
          const denomLabel = `${currency.symbol}${formatCurrencyAmount(denom, currency.code, hasDecimals)}${label ? ` (${label})` : ""}`;
          activeRows.push(` • ${denomLabel}  ×  ${qty}  =  ${currency.symbol}${formatCurrencyAmount(lineTotal, currency.code, hasDecimals)}`);
        }
      });

      if (activeRows.length > 0) {
        lines.push(activeRows.join("\n"));
      } else {
        lines.push(" _No notes/coins counted yet (all 0)_");
      }
      lines.push("━━━━━━━━━━━━━━━━━━━━");
    }

    lines.push(`🔢 *Total Items / Notes:* ${stats.notes}`);
    lines.push(`💰 *Total Amount:* ${currency.symbol}${formatCurrencyAmount(stats.total, currency.code, hasDecimals)}`);

    if (includeWords) {
      const words = amountInWords(stats.total, currency.code);
      lines.push(`📝 *In Words:* ${words}`);
    }

    if (includeTally && (counter.expectedStr || "").trim()) {
      lines.push("━━━━━━━━━━━━━━━━━━━━");
      lines.push(`💵 *Expected Cash:* ${currency.symbol}${counter.expectedStr.trim()}`);
      const diffStatus = stats.diff === 0 ? "Matched ✅" : stats.diff > 0 ? "Excess 🔺" : "Short 🔻";
      const sign = stats.diff > 0 ? "+" : "";
      lines.push(`⚖️ *Difference:* ${sign}${currency.symbol}${formatCurrencyAmount(stats.diff, currency.code, hasDecimals)} (${diffStatus})`);
    }

    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push("_Generated via Currency Counter_");

    return lines.join("\n");
  }

  // All counters summary
  const lines = [];
  lines.push("🧾 *ALL COUNTERS CASH REPORT*");
  lines.push("━━━━━━━━━━━━━━━━━━━━");
  if (includeTimestamp) {
    lines.push(`📅 *Date:* ${dateStr}`);
  }
  lines.push(`📊 *Total Counters:* ${counters.length || 1}`);
  if (customNote && customNote.trim()) {
    lines.push(`💬 *Note:* ${customNote.trim()}`);
  }
  lines.push("━━━━━━━━━━━━━━━━━━━━");

  lines.push("*TOTALS BY CURRENCY:*");
  if (combinedByCurrency.length > 0) {
    combinedByCurrency.forEach((item) => {
      const currSym = item.currency.symbol;
      const currCode = item.currency.code;
      const formatted = formatCurrencyAmount(item.total, currCode);
      lines.push(`• *${currCode}:* ${currSym}${formatted} (${item.notes} items)`);
      if (includeWords) {
        lines.push(`  _In words: ${amountInWords(item.total, currCode)}_`);
      }
    });
  } else {
    lines.push("• Total: 0");
  }

  if (includeBreakdown && counters.length > 0) {
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push("*COUNTER-WISE SUMMARY:*");
    counters.forEach((c) => {
      const cCurr = getCurrencyObj(c.currencyCode || "INR");
      const cStats = calculateCounterTotals(c);
      lines.push(`📍 *${c.name} (${cCurr.code}):* ${cCurr.symbol}${formatCurrencyAmount(cStats.total, cCurr.code)} (${cStats.notes} items)`);
    });
  }

  lines.push("━━━━━━━━━━━━━━━━━━━━");
  lines.push("_Generated via Currency Counter_");

  return lines.join("\n");
}

export function openWhatsAppUrl(text, phoneNumber = "") {
  const cleanPhone = (phoneNumber || "").replace(/[^0-9]/g, "");
  const baseUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : "https://wa.me/";
  const whatsappUrl = `${baseUrl}?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

export function shareToWhatsApp(combinedByCurrency, counterCount, grandWords, notifyFn, counter = null, currency = null, customDenomsMap = {}) {
  const text = buildWhatsAppShareText({
    counter,
    currency,
    counters: counter ? [counter] : [],
    combinedByCurrency,
    grandWords,
    customDenomsMap,
    options: {
      scope: counter ? "active" : "all",
      includeBreakdown: true,
      includeTally: true,
      includeWords: true,
      includeTimestamp: true
    }
  });

  openWhatsAppUrl(text);
  if (notifyFn) notifyFn("Opening WhatsApp Share");
}
