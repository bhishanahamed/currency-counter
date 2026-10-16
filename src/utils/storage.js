import { DEFAULT_CURRENCIES, CURRENCY_CONFIG } from '../data/currencies.js';

export const COUNTERS_STORAGE_KEY = "currencyCounter_counters_v1";
export const HISTORY_STORAGE_KEY = "currencyCounter_history_v1";
export const CUSTOM_DENOMS_STORAGE_KEY = "customDenoms_v1";
export const SETTINGS_STORAGE_KEY = "currencyCounter_settings_v1";

export const MAX_CUSTOM_DENOM_LABEL_LENGTH = 30;
export const MAX_QUANTITY = 9999999;

export function getDefaultCounters() {
  const inrDenoms = DEFAULT_CURRENCIES.INR.denoms;
  const initialQtys = {};
  inrDenoms.forEach((d) => {
    initialQtys[d] = 0;
  });

  return [
    {
      id: "c1",
      name: "Counter 1",
      qtys: { ...initialQtys },
      expectedStr: "",
      currencyCode: "INR"
    },
    {
      id: "c2",
      name: "Till",
      qtys: { ...initialQtys },
      expectedStr: "",
      currencyCode: "INR"
    }
  ];
}

export function getDefaultSettings() {
  return {
    darkMode: false,
    defaultCurrencyCode: "INR",
    showExpectedCashToggle: true
  };
}

export function getEmptyCustomDenomsObj() {
  const obj = {};
  Object.keys(DEFAULT_CURRENCIES).forEach((code) => {
    obj[code] = [];
  });
  return obj;
}

/**
 * Validate and sanitize loaded counters
 */
export function validateAndSanitizeCounters(raw) {
  if (!Array.isArray(raw) || raw.length === 0) {
    return getDefaultCounters();
  }

  const validCounters = [];

  raw.forEach((item, idx) => {
    if (!item || typeof item !== "object") return;

    const id = typeof item.id === "string" && item.id.trim() ? item.id.trim() : `c${idx + 1}`;
    const name = typeof item.name === "string" && item.name.trim() ? item.name.trim().slice(0, 40) : `Counter ${idx + 1}`;
    const currencyCode = (typeof item.currencyCode === "string" && DEFAULT_CURRENCIES[item.currencyCode])
      ? item.currencyCode
      : "INR";
    const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.INR;

    const cleanQtys = {};
    if (item.qtys && typeof item.qtys === "object") {
      Object.entries(item.qtys).forEach(([denomStr, qtyVal]) => {
        const denomNum = parseFloat(denomStr);
        if (isNaN(denomNum) || denomNum <= 0 || denomNum > 100000) return;

        // Defensively validate denomination according to currency decimal configuration
        const dotParts = String(denomStr).split(".");
        if (dotParts.length > 2) return;

        if (config.decimals === 0) {
          if (dotParts.length > 1 || denomNum % 1 !== 0) return;
        } else {
          if (dotParts.length === 2 && dotParts[1].length > config.decimals) return;
          const scaled = denomNum * Math.pow(10, config.decimals);
          if (Math.abs(scaled - Math.round(scaled)) > 0.0001) return;
        }

        const validDenom = config.decimals === 0
          ? Math.round(denomNum)
          : Math.round(denomNum * 100) / 100;

        const qtyNum = parseInt(qtyVal, 10);
        cleanQtys[validDenom] = isNaN(qtyNum) ? 0 : Math.min(MAX_QUANTITY, Math.max(0, qtyNum));
      });
    }

    const expectedStr = typeof item.expectedStr === "string"
      ? item.expectedStr.slice(0, 30)
      : "";

    validCounters.push({
      id,
      name,
      currencyCode,
      qtys: cleanQtys,
      expectedStr
    });
  });

  return validCounters.length > 0 ? validCounters : getDefaultCounters();
}

/**
 * Validate and sanitize custom denominations with backward compatibility migration
 * Supports both legacy numeric arrays and modern { value, label } objects
 * Enforces currency-specific precision (e.g. JPY with decimals=0 disallows fractional values)
 */
export function validateAndSanitizeCustomDenoms(raw) {
  const result = getEmptyCustomDenomsObj();
  if (!raw || typeof raw !== "object") return result;

  Object.keys(DEFAULT_CURRENCIES).forEach((code) => {
    const list = raw[code];
    if (!Array.isArray(list)) return;

    const config = CURRENCY_CONFIG[code] || CURRENCY_CONFIG.INR;
    const seenValues = new Set();
    const sanitizedList = [];

    list.forEach((item) => {
      let val = 0;
      let label = "";

      if (typeof item === "number" || typeof item === "string") {
        val = parseFloat(item);
      } else if (item && typeof item === "object") {
        val = parseFloat(item.value);
        label = typeof item.label === "string" ? item.label.trim().slice(0, MAX_CUSTOM_DENOM_LABEL_LENGTH) : "";
      }

      if (isNaN(val) || val <= 0 || val > 100000) return;

      const valStr = typeof item === "number" ? String(item) : (typeof item === "string" ? item : String(item?.value || ""));
      const dotParts = valStr.split(".");
      if (dotParts.length > 2) return;

      // Currency with 0 decimals only allows whole integer denominations
      if (config.decimals === 0) {
        if (dotParts.length > 1 || val % 1 !== 0) return;
      } else {
        if (dotParts.length === 2 && dotParts[1].length > config.decimals) return;
        const scaled = val * Math.pow(10, config.decimals);
        if (Math.abs(scaled - Math.round(scaled)) > 0.0001) return;
      }

      const roundedVal = config.decimals === 0
        ? Math.round(val)
        : Math.round(val * 100) / 100;

      // Ensure uniqueness
      const key = roundedVal.toFixed(config.decimals || 2);
      if (!seenValues.has(key)) {
        seenValues.add(key);
        sanitizedList.push({
          value: roundedVal,
          label
        });
      }
    });

    sanitizedList.sort((a, b) => b.value - a.value);
    result[code] = sanitizedList.slice(0, 50);
  });

  return result;
}

/**
 * Validate and sanitize loaded history
 * Includes self-contained customDenomsMap snapshot with fallback to empty structure for older history
 */
export function validateAndSanitizeHistory(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item) => item && typeof item === "object" && item.id && Array.isArray(item.counters))
    .slice(0, 50)
    .map((item) => {
      const itemsCount = typeof item.totalItems === "number"
        ? Math.max(0, item.totalItems)
        : (typeof item.totalNotes === "number" ? Math.max(0, item.totalNotes) : 0);

      return {
        id: String(item.id),
        timestamp: typeof item.timestamp === "number" ? item.timestamp : Date.now(),
        counters: validateAndSanitizeCounters(item.counters),
        customDenomsMap: item.customDenomsMap
          ? validateAndSanitizeCustomDenoms(item.customDenomsMap)
          : getEmptyCustomDenomsObj(),
        totalItems: itemsCount,
        totalNotes: itemsCount,
        combinedTotal: typeof item.combinedTotal === "number" ? item.combinedTotal : null,
        isMultiCurrency: Boolean(item.isMultiCurrency),
        totalsByCurrency: Array.isArray(item.totalsByCurrency) ? item.totalsByCurrency : []
      };
    });
}

/**
 * Validate and sanitize settings
 */
export function validateAndSanitizeSettings(raw) {
  const defaults = getDefaultSettings();
  if (!raw || typeof raw !== "object") return defaults;

  return {
    darkMode: typeof raw.darkMode === "boolean" ? raw.darkMode : defaults.darkMode,
    defaultCurrencyCode: (typeof raw.defaultCurrencyCode === "string" && DEFAULT_CURRENCIES[raw.defaultCurrencyCode])
      ? raw.defaultCurrencyCode
      : defaults.defaultCurrencyCode,
    showExpectedCashToggle: typeof raw.showExpectedCashToggle === "boolean"
      ? raw.showExpectedCashToggle
      : defaults.showExpectedCashToggle
  };
}

/**
 * Load counters from localStorage safely
 */
export function loadCountersFromStorage() {
  try {
    const saved = localStorage.getItem(COUNTERS_STORAGE_KEY);
    if (!saved) return getDefaultCounters();
    return validateAndSanitizeCounters(JSON.parse(saved));
  } catch {
    return getDefaultCounters();
  }
}

/**
 * Load history from localStorage safely
 */
export function loadHistoryFromStorage() {
  try {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!saved) return [];
    return validateAndSanitizeHistory(JSON.parse(saved));
  } catch {
    return [];
  }
}

/**
 * Load custom denoms from localStorage safely with migration
 */
export function loadCustomDenomsFromStorage() {
  try {
    const saved = localStorage.getItem(CUSTOM_DENOMS_STORAGE_KEY);
    if (!saved) return getEmptyCustomDenomsObj();
    return validateAndSanitizeCustomDenoms(JSON.parse(saved));
  } catch {
    return getEmptyCustomDenomsObj();
  }
}

/**
 * Load settings from localStorage safely
 */
export function loadSettingsFromStorage() {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!saved) return getDefaultSettings();
    return validateAndSanitizeSettings(JSON.parse(saved));
  } catch {
    return getDefaultSettings();
  }
}

/**
 * Clear all persisted data completely
 */
export function clearAllApplicationData() {
  try {
    localStorage.removeItem(COUNTERS_STORAGE_KEY);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    localStorage.removeItem(CUSTOM_DENOMS_STORAGE_KEY);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  } catch (err) {
    console.warn("Error clearing localStorage:", err);
  }
}
