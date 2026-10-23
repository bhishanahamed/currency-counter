import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import ReceiptModal from './components/ReceiptModal';
import WhatsAppShareModal from './components/WhatsAppShareModal';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import BottomNav from './components/BottomNav';

import HomeTab from './components/tabs/HomeTab';
import CounterTab from './components/tabs/CounterTab';
import ReportTab from './components/tabs/ReportTab';
import HistoryTab from './components/tabs/HistoryTab';
import SettingsTab from './components/tabs/SettingsTab';
import AboutTab from './components/tabs/AboutTab';

import { DEFAULT_CURRENCIES } from './data/currencies';
import {
  createZeroQuantities,
  getCurrencyObj,
  getCurrencyConfig,
  calculateCounterTotals,
  normalizeMoney,
  MAX_QUANTITY,
  MAX_CUSTOM_DENOM_LABEL_LENGTH,
  COUNTERS_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
  CUSTOM_DENOMS_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  getDefaultCounters,
  getDefaultSettings,
  getEmptyCustomDenomsObj,
  validateAndSanitizeCounters,
  validateAndSanitizeCustomDenoms,
  loadCountersFromStorage,
  loadHistoryFromStorage,
  loadCustomDenomsFromStorage,
  loadSettingsFromStorage,
  clearAllApplicationData,
  getMergedDenoms,
  amountInWords,
  exportToCSV,
  shareToWhatsApp
} from './utils/currencyUtils';

export default function App() {
  // Settings State with Lazy Initialization from LocalStorage
  const [settings, setSettings] = useState(() => loadSettingsFromStorage());
  const darkMode = settings.darkMode;
  const defaultCurrencyCode = settings.defaultCurrencyCode;
  const showExpectedCashToggle = settings.showExpectedCashToggle;

  const [activeTab, setActiveTab] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navClickKey, setNavClickKey] = useState(0);

  // Counters State with Lazy Initialization from LocalStorage
  const [counters, setCounters] = useState(() => loadCountersFromStorage());
  const [activeCounterId, setActiveCounterId] = useState(() => {
    const loaded = loadCountersFromStorage();
    return loaded[0]?.id || "c1";
  });

  // History State with Lazy Initialization from LocalStorage
  const [history, setHistory] = useState(() => loadHistoryFromStorage());

  // Custom Denominations with Migration & LocalStorage persistence
  const [customDenomsMap, setCustomDenomsMap] = useState(() => loadCustomDenomsFromStorage());

  // PWA State
  const [pwaStatus, setPwaStatus] = useState(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return "unsupported";
    }
    return "registering";
  });
  const [pwaRegistered, setPwaRegistered] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);

  // Modals & UI States
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [customDenomInputVal, setCustomDenomInputVal] = useState("");
  const [customDenomLabelInputVal, setCustomDenomLabelInputVal] = useState("");
  const [isDefaultDropdownOpen, setIsDefaultDropdownOpen] = useState(false);
  const [isActiveCounterDropdownOpen, setIsActiveCounterDropdownOpen] = useState(false);
  const [currencySearchQuery, setCurrencySearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [reportDate, setReportDate] = useState(() => new Date());

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "danger",
    onConfirm: () => {}
  });

  const showToast = useCallback((msg) => setToastMessage(msg), []);

  // Persist Counters whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(COUNTERS_STORAGE_KEY, JSON.stringify(counters));
    } catch (err) {
      console.warn("Failed to persist counters to localStorage:", err);
    }
  }, [counters]);

  // Persist History whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      console.warn("Failed to persist history to localStorage:", err);
    }
  }, [history]);

  // Persist Custom Denominations whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_DENOMS_STORAGE_KEY, JSON.stringify(customDenomsMap));
    } catch (err) {
      console.warn("Failed to persist custom denominations to localStorage:", err);
    }
  }, [customDenomsMap]);

  // Persist Settings whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.warn("Failed to persist settings to localStorage:", err);
    }
  }, [settings]);

  // Toast Auto-Clear
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Dark Mode Class Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // PWA Service Worker Registration
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          if (reg) {
            setPwaRegistered(true);
            setPwaStatus("ready");
          } else {
            setPwaStatus("failed");
          }
        })
        .catch((err) => {
          console.warn("Service worker registration error:", err);
          setPwaRegistered(false);
          setPwaStatus("failed");
        });
    } else {
      setPwaStatus("unsupported");
    }

    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-currency-dropdown]")) {
        setIsDefaultDropdownOpen(false);
        setIsActiveCounterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Active counter and currency objects
  const activeCounter = useMemo(
    () => counters.find((c) => c.id === activeCounterId) || counters[0] || getDefaultCounters()[0],
    [counters, activeCounterId]
  );

  const activeCurrency = useMemo(
    () => getCurrencyObj(activeCounter?.currencyCode || "INR"),
    [activeCounter]
  );

  const mergedActiveDenoms = useMemo(
    () => getMergedDenoms(activeCounter?.currencyCode || "INR", customDenomsMap),
    [activeCounter?.currencyCode, customDenomsMap]
  );

  // Grouped combined totals by currency - NEVER mathematically adds different currencies
  const combinedByCurrency = useMemo(() => {
    const map = new Map();
    counters.forEach((c) => {
      const stats = calculateCounterTotals(c);
      const code = c.currencyCode || "INR";
      const currency = getCurrencyObj(code);
      const existing = map.get(code);

      if (existing) {
        existing.total = normalizeMoney(existing.total + stats.total, code);
        existing.notes += stats.notes;
        existing.items = existing.notes;
      } else {
        map.set(code, {
          total: stats.total,
          notes: stats.notes,
          items: stats.notes,
          currency
        });
      }
    });

    const items = Array.from(map.values());
    if (items.length <= 1) return items;

    // FIX #7: Stable deterministic order based on DEFAULT_CURRENCIES keys: INR, USD, EUR, GBP, JPY, AUD, CAD, AED, SAR, SGD
    const CURRENCY_ORDER = Object.keys(DEFAULT_CURRENCIES);
    return items.sort((a, b) => {
      const idxA = CURRENCY_ORDER.indexOf(a.currency.code);
      const idxB = CURRENCY_ORDER.indexOf(b.currency.code);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return a.currency.code.localeCompare(b.currency.code);
    });
  }, [counters]);

  const combinedStats = useMemo(() => {
    const totalNotes = combinedByCurrency.reduce((sum, item) => sum + item.notes, 0);

    if (combinedByCurrency.length === 1) {
      return {
        isMultiCurrency: false,
        total: combinedByCurrency[0].total,
        notes: combinedByCurrency[0].notes,
        currencyCode: combinedByCurrency[0].currency.code
      };
    }

    return {
      isMultiCurrency: combinedByCurrency.length > 1,
      total: null, // Multiple currencies cannot have a single numeric sum
      notes: totalNotes,
      currencyCode: null
    };
  }, [combinedByCurrency]);

  const grandWords = useMemo(() => {
    if (combinedByCurrency.length === 1) {
      return amountInWords(combinedByCurrency[0].total, combinedByCurrency[0].currency.code);
    }
    if (combinedByCurrency.length === 0) {
      return amountInWords(0, defaultCurrencyCode);
    }
    return combinedByCurrency
      .map((item) => `${item.currency.code}: ${amountInWords(item.total, item.currency.code)}`)
      .join(" • ");
  }, [combinedByCurrency, defaultCurrencyCode]);

  const filteredCurrenciesList = useMemo(() => {
    const q = currencySearchQuery.toLowerCase().trim();
    if (!q) return Object.values(DEFAULT_CURRENCIES);
    return Object.values(DEFAULT_CURRENCIES).filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [currencySearchQuery]);

  // FIX #1: Dedicated React State Handler for Expected Cash with clean sanitization
  const handleExpectedCashChange = useCallback((value) => {
    let sanitized = String(value || "").replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    if (parts.length > 2) {
      sanitized = parts[0] + "." + parts.slice(1).join("");
    }
    const dotIndex = sanitized.indexOf(".");
    if (dotIndex === -1) {
      if (sanitized.length > 12) sanitized = sanitized.slice(0, 12);
    } else {
      const intPart = sanitized.slice(0, dotIndex).slice(0, 12);
      const decPart = sanitized.slice(dotIndex + 1).slice(0, 2);
      sanitized = `${intPart}.${decPart}`;
    }

    setCounters((prev) =>
      prev.map((counter) =>
        counter.id === activeCounterId
          ? {
              ...counter,
              expectedStr: sanitized
            }
          : counter
      )
    );
  }, [activeCounterId]);

  // Quantity step handler with safe clamping [0, MAX_QUANTITY]
  const handleQtyStep = useCallback((denom, delta) => {
    setCounters((prev) =>
      prev.map((c) => {
        if (c.id !== activeCounterId) return c;
        const current = Number(c.qtys?.[denom]) || 0;
        const next = Math.min(MAX_QUANTITY, Math.max(0, current + delta));
        return {
          ...c,
          qtys: {
            ...c.qtys,
            [denom]: next
          }
        };
      })
    );
  }, [activeCounterId]);

  // Quantity input handler with safe clamping [0, MAX_QUANTITY]
  const handleQtyInput = useCallback((denom, strVal) => {
    const cleaned = strVal.replace(/\D/g, "").slice(0, 7);
    const qtyNum = cleaned === "" ? 0 : Math.min(MAX_QUANTITY, Math.max(0, parseInt(cleaned, 10) || 0));
    setCounters((prev) =>
      prev.map((c) =>
        c.id === activeCounterId
          ? {
              ...c,
              qtys: {
                ...c.qtys,
                [denom]: qtyNum
              }
            }
          : c
      )
    );
  }, [activeCounterId]);

  // FIX #11: Add Counter uses defaultCurrencyCode without altering existing counters
  const handleAddCounter = useCallback(() => {
    const newId = "c" + Date.now();
    const denoms = getMergedDenoms(defaultCurrencyCode, customDenomsMap);
    setCounters((prev) => [
      ...prev,
      {
        id: newId,
        name: `Counter ${prev.length + 1}`,
        qtys: createZeroQuantities(denoms),
        expectedStr: "",
        currencyCode: defaultCurrencyCode
      }
    ]);
    setActiveCounterId(newId);
  }, [defaultCurrencyCode, customDenomsMap]);

  const handleRemoveCounter = useCallback((id) => {
    if (counters.length <= 1) return;
    const remaining = counters.filter((c) => c.id !== id);
    setCounters(remaining);
    if (activeCounterId === id) {
      setActiveCounterId(remaining[0].id);
    }
  }, [counters, activeCounterId]);

  const handleRenameCounter = useCallback((id, newName) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  }, []);

  // Internal helper to apply currency change and reset quantities
  const applyCounterCurrencyChange = useCallback((counterId, newCurrencyCode) => {
    const denoms = getMergedDenoms(newCurrencyCode, customDenomsMap);
    setCounters((prev) =>
      prev.map((c) => {
        if (c.id !== counterId) return c;
        return {
          ...c,
          currencyCode: newCurrencyCode,
          qtys: createZeroQuantities(denoms),
          expectedStr: ""
        };
      })
    );
  }, [customDenomsMap]);

  // FIX #10: Safe Counter Currency Change with Confirmation
  const handleSwitchCounterCurrency = useCallback((counterId, newCurrencyCode) => {
    const targetCounter = counters.find((c) => c.id === counterId);
    if (!targetCounter || targetCounter.currencyCode === newCurrencyCode) return;

    const hasNonZero = Object.values(targetCounter.qtys || {}).some((qty) => qty > 0);
    const newCurrObj = getCurrencyObj(newCurrencyCode);

    if (!hasNonZero) {
      // Counter is empty, switch currency directly
      applyCounterCurrencyChange(counterId, newCurrencyCode);
      showToast(`Switched "${targetCounter.name}" to ${newCurrObj.code} (${newCurrObj.symbol})`);
    } else {
      // Counter has active notes, confirm before resetting
      setConfirmDialog({
        isOpen: true,
        title: "Change Currency?",
        message: `Changing currency to ${newCurrObj.name} (${newCurrObj.code}) will clear all active quantities and expected cash for "${targetCounter.name}". Are you sure you want to proceed?`,
        confirmText: "Change & Reset",
        cancelText: "Cancel",
        variant: "warning",
        onConfirm: () => {
          applyCounterCurrencyChange(counterId, newCurrencyCode);
          showToast(`Switched to ${newCurrObj.code} and reset quantities`);
        }
      });
    }
  }, [counters, applyCounterCurrencyChange, showToast]);

  // FIX #11: Default currency updates setting only, not existing counters
  const handleSelectDefaultCurrency = useCallback((code) => {
    const curr = getCurrencyObj(code);
    setSettings((prev) => ({ ...prev, defaultCurrencyCode: code }));
    showToast(`Default currency set to ${curr.code} (${curr.name}) for new counters`);
  }, [showToast]);

  // FIX #12 & FIX #13: Custom Denomination with Label and 50 Max Limit
  const handleAddCustomDenom = useCallback(() => {
    const activeCode = activeCounter?.currencyCode || defaultCurrencyCode;
    const currentList = customDenomsMap[activeCode] || [];

    if (currentList.length >= 50) {
      showToast("Maximum 50 custom denominations allowed");
      return;
    }

    const rawVal = customDenomInputVal.trim();
    if (!rawVal) {
      showToast("Enter denomination value");
      return;
    }

    // Strict numeric-string validation before parseFloat based on currency precision
    const config = getCurrencyConfig(activeCode);
    const maxDecimals = typeof config.decimals === "number" ? config.decimals : 2;

    if (maxDecimals === 0) {
      if (/^[0-9]+\.[0-9]+$/.test(rawVal)) {
        showToast(`${activeCode} does not support decimal denominations`);
        return;
      }
      if (!/^[0-9]+$/.test(rawVal)) {
        showToast("Invalid denomination");
        return;
      }
    } else {
      const validPattern = new RegExp(`^[0-9]+(?:\\.[0-9]{1,${maxDecimals}})?$`);
      if (!validPattern.test(rawVal)) {
        if (/^[0-9]+\.[0-9]+$/.test(rawVal)) {
          showToast(`Maximum ${maxDecimals} decimal places allowed for ${activeCode}.`);
          return;
        }
        showToast("Invalid denomination");
        return;
      }
    }

    const valNum = parseFloat(rawVal);
    if (isNaN(valNum) || valNum <= 0) {
      showToast("Invalid denomination");
      return;
    }
    if (valNum > 100000) {
      showToast("Maximum custom denomination is 1,00,000");
      return;
    }

    const roundedVal = maxDecimals === 0 ? Math.round(valNum) : Math.round(valNum * 100) / 100;
    const isDefault = getCurrencyObj(activeCode).denoms.some(
      (d) => Math.abs(d - roundedVal) < 0.0001
    );
    const isAlreadyCustom = currentList.some((item) => {
      const v = typeof item === "object" && item !== null ? item.value : item;
      return Math.abs(v - roundedVal) < 0.0001;
    });

    if (isDefault) {
      showToast(`${roundedVal} already exists as default`);
      return;
    }
    if (isAlreadyCustom) {
      showToast(`${roundedVal} already added`);
      return;
    }

    // Consistent label length using shared MAX_CUSTOM_DENOM_LABEL_LENGTH
    const label = (customDenomLabelInputVal || "").trim().slice(0, MAX_CUSTOM_DENOM_LABEL_LENGTH);
    const newEntry = { value: roundedVal, label };

    setCustomDenomsMap((prev) => {
      const list = prev[activeCode] || [];
      const updated = [...list, newEntry].sort((a, b) => {
        const vA = typeof a === "object" && a !== null ? a.value : a;
        const vB = typeof b === "object" && b !== null ? b.value : b;
        return vB - vA;
      });
      return { ...prev, [activeCode]: updated };
    });

    if (activeCounter && activeCounter.currencyCode === activeCode) {
      setCounters((prev) =>
        prev.map((c) =>
          c.id === activeCounterId
            ? {
                ...c,
                qtys: {
                  ...c.qtys,
                  [roundedVal]: c.qtys?.[roundedVal] || 0
                }
              }
            : c
        )
      );
    }

    setCustomDenomInputVal("");
    setCustomDenomLabelInputVal("");
    showToast(`Added custom ${roundedVal}${label ? ` (${label})` : ""} to ${activeCode}`);
    setIsAddCustomOpen(false);
  }, [
    activeCounter,
    defaultCurrencyCode,
    customDenomsMap,
    customDenomInputVal,
    customDenomLabelInputVal,
    activeCounterId,
    showToast
  ]);

  const handleRemoveCustomDenom = useCallback((currencyCode, denomVal) => {
    setCustomDenomsMap((prev) => ({
      ...prev,
      [currencyCode]: (prev[currencyCode] || []).filter((item) => {
        const v = typeof item === "object" && item !== null ? item.value : item;
        return Math.abs(v - denomVal) > 0.0001;
      })
    }));

    setCounters((prev) =>
      prev.map((c) => {
        if (c.currencyCode !== currencyCode) return c;
        const newQtys = { ...c.qtys };
        delete newQtys[denomVal];
        delete newQtys[String(denomVal)];
        Object.keys(newQtys).forEach((k) => {
          if (Math.abs(parseFloat(k) - denomVal) < 0.0001) delete newQtys[k];
        });
        return { ...c, qtys: newQtys };
      })
    );
    showToast(`Removed custom ${denomVal} from ${currencyCode}`);
  }, [showToast]);

  const handleResetCustomDenoms = useCallback((currencyCode) => {
    const list = customDenomsMap[currencyCode] || [];
    if (list.length === 0) {
      showToast(`No custom denoms for ${currencyCode}`);
      return;
    }

    setCustomDenomsMap((prev) => ({ ...prev, [currencyCode]: [] }));
    setCounters((prev) =>
      prev.map((c) => {
        if (c.currencyCode !== currencyCode) return c;
        const newQtys = { ...c.qtys };
        list.forEach((item) => {
          const val = typeof item === "object" && item !== null ? item.value : item;
          delete newQtys[val];
          delete newQtys[String(val)];
          Object.keys(newQtys).forEach((k) => {
            if (Math.abs(parseFloat(k) - val) < 0.0001) delete newQtys[k];
          });
        });
        return { ...c, qtys: newQtys };
      })
    );
    showToast(`Reset custom denoms for ${currencyCode}`);
  }, [customDenomsMap, showToast]);

  // FIX #1: Save Session Snapshot to History with self-contained deep copy of customDenomsMap
  const handleSaveSnapshot = useCallback(() => {
    const isSingleCurrency = combinedByCurrency.length === 1;
    const totalCount = combinedByCurrency.reduce((sum, item) => sum + item.notes, 0);

    const snapshot = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      counters: JSON.parse(JSON.stringify(counters)),
      customDenomsMap: JSON.parse(JSON.stringify(customDenomsMap)),
      isMultiCurrency: combinedByCurrency.length > 1,
      totalsByCurrency: combinedByCurrency.map((item) => ({
        currencyCode: item.currency.code,
        total: item.total,
        notes: item.notes,
        items: item.notes
      })),
      totalNotes: totalCount,
      totalItems: totalCount,
      combinedTotal: isSingleCurrency ? combinedByCurrency[0].total : null
    };

    setHistory((prev) => [snapshot, ...prev].slice(0, 50));
    showToast("Session saved to history");
    setActiveTab("History");
  }, [counters, customDenomsMap, combinedByCurrency, showToast]);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // FIX #5: Complete Clear All Data with Reset to clean defaults
  const handleClearAllData = useCallback(() => {
    clearAllApplicationData();
    const freshCounters = getDefaultCounters();
    const freshSettings = getDefaultSettings();
    setCounters(freshCounters);
    setActiveCounterId(freshCounters[0].id);
    setHistory([]);
    setCustomDenomsMap(getEmptyCustomDenomsObj());
    setSettings(freshSettings);
    setActiveTab("Counter");
    showToast("Cleared all counters, history, and custom data");
  }, [showToast]);

  const requestClearHistory = useCallback(() => {
    if (history.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: "Clear History?",
      message: `Are you sure you want to clear all ${history.length} saved session${history.length === 1 ? '' : 's'}? All saved snapshot records will be permanently deleted from this browser.`,
      confirmText: "Clear History",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: () => {
        setHistory([]);
        showToast("History cleared");
      }
    });
  }, [history.length, showToast]);

  const requestDeleteSession = useCallback((sessionOrId) => {
    const id = typeof sessionOrId === 'object' && sessionOrId !== null ? sessionOrId.id : sessionOrId;
    const session = history.find((s) => s.id === id);
    const dateFormatted = session?.timestamp
      ? new Date(session.timestamp).toLocaleString("en-IN")
      : null;
    const message = dateFormatted
      ? `Are you sure you want to delete the saved session from ${dateFormatted}? This snapshot record will be permanently deleted.`
      : "Are you sure you want to delete this saved session? This snapshot record will be permanently deleted.";

    setConfirmDialog({
      isOpen: true,
      title: "Delete History Session?",
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: () => {
        setHistory((prev) => prev.filter((s) => s.id !== id));
        showToast("Session removed");
      }
    });
  }, [history, showToast]);

  const requestClearAllData = useCallback(() => {
    setConfirmDialog({
      isOpen: true,
      title: "Clear All Application Data?",
      message: "Are you sure you want to delete all data? This will reset all counters, custom denominations, history sessions, and settings on this device.",
      confirmText: "Clear All Data",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: () => {
        handleClearAllData();
      }
    });
  }, [handleClearAllData]);

  // FIX #15: Clear only active counter
  const handleClearActiveCounter = useCallback(() => {
    setCounters((prev) =>
      prev.map((c) =>
        c.id === activeCounterId
          ? {
              ...c,
              qtys: createZeroQuantities(mergedActiveDenoms),
              expectedStr: ""
            }
          : c
      )
    );
    showToast(`Cleared ${activeCounter?.name || "counter"}`);
  }, [activeCounterId, mergedActiveDenoms, activeCounter?.name, showToast]);

  const handleOpenReceiptModal = useCallback(() => {
    setReportDate(new Date());
    setIsReceiptModalOpen(true);
  }, []);

  const handleTabSelect = useCallback((tab) => {
    setActiveTab(tab);
    setNavClickKey((prev) => prev + 1);
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className={`min-h-screen font-sans antialiased ${darkMode ? "bg-[#0b1220] text-slate-100" : "bg-[#fbfcfe] text-slate-900"}`}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabSelect={handleTabSelect}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        darkMode={darkMode}
        clickKey={navClickKey}
      />

      {/* Main View Area */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 sm:pb-28 lg:pb-8">
        {activeTab === "Home" && (
          <HomeTab
            darkMode={darkMode}
            onNavigate={handleTabSelect}
            onSaveSnapshot={handleSaveSnapshot}
            defaultCurrencyCode={defaultCurrencyCode}
            counters={counters}
            combinedByCurrency={combinedByCurrency}
            combinedStats={combinedStats}
            grandWords={grandWords}
          />
        )}

        {activeTab === "Counter" && (
          <CounterTab
            darkMode={darkMode}
            defaultCurrencyCode={defaultCurrencyCode}
            onSelectDefaultCurrency={handleSelectDefaultCurrency}
            counters={counters}
            activeCounterId={activeCounterId}
            activeCounter={activeCounter}
            activeCurrency={activeCurrency}
            mergedActiveDenoms={mergedActiveDenoms}
            customDenomsMap={customDenomsMap}
            showExpectedCashToggle={showExpectedCashToggle}
            combinedByCurrency={combinedByCurrency}
            combinedStats={combinedStats}
            grandWords={grandWords}
            onAddCounter={handleAddCounter}
            onRemoveCounter={handleRemoveCounter}
            onRenameCounter={handleRenameCounter}
            onSwitchCounterCurrency={handleSwitchCounterCurrency}
            onSelectActiveCounter={setActiveCounterId}
            onQtyStep={handleQtyStep}
            onQtyInput={handleQtyInput}
            onExpectedCashChange={handleExpectedCashChange}
            onClearCounter={handleClearActiveCounter}
            onAddCustomDenom={handleAddCustomDenom}
            onRemoveCustomDenom={handleRemoveCustomDenom}
            onResetCustomDenoms={handleResetCustomDenoms}
            onSaveSnapshot={handleSaveSnapshot}
            onExportCSV={() => exportToCSV(counters, combinedByCurrency, showToast, customDenomsMap)}
            onShareWhatsApp={() => setIsWhatsAppModalOpen(true)}
            onViewReceipt={handleOpenReceiptModal}
            isAddCustomOpen={isAddCustomOpen}
            setIsAddCustomOpen={setIsAddCustomOpen}
            customDenomInputVal={customDenomInputVal}
            setCustomDenomInputVal={setCustomDenomInputVal}
            customDenomLabelInputVal={customDenomLabelInputVal}
            setCustomDenomLabelInputVal={setCustomDenomLabelInputVal}
            isDefaultDropdownOpen={isDefaultDropdownOpen}
            setIsDefaultDropdownOpen={setIsDefaultDropdownOpen}
            isActiveCounterDropdownOpen={isActiveCounterDropdownOpen}
            setIsActiveCounterDropdownOpen={setIsActiveCounterDropdownOpen}
            currencySearchQuery={currencySearchQuery}
            setCurrencySearchQuery={setCurrencySearchQuery}
            filteredCurrenciesList={filteredCurrenciesList}
          />
        )}

        {activeTab === "Report" && (
          <ReportTab
            darkMode={darkMode}
            activeCounter={activeCounter}
            activeCurrency={activeCurrency}
            reportDate={reportDate}
            mergedActiveDenoms={mergedActiveDenoms}
            customDenomsMap={customDenomsMap}
            onViewReceipt={handleOpenReceiptModal}
            notifyFn={showToast}
          />
        )}

        {activeTab === "History" && (
          <HistoryTab
            darkMode={darkMode}
            history={history}
            onClearHistory={requestClearHistory}
            onDeleteSession={requestDeleteSession}
            onLoadSession={(session) => {
              if (Array.isArray(session?.counters) && session.counters.length > 0) {
                const sanitizedCounters = validateAndSanitizeCounters(session.counters);
                setCounters(sanitizedCounters);

                // FIX #2 & #3: Restore customDenomsMap from snapshot with sanitization
                if (session.customDenomsMap) {
                  setCustomDenomsMap(validateAndSanitizeCustomDenoms(session.customDenomsMap));
                } else {
                  setCustomDenomsMap(getEmptyCustomDenomsObj());
                }

                setActiveCounterId(sanitizedCounters[0].id);
                showToast(`Loaded ${sanitizedCounters.length} counters from session`);
                setActiveTab("Counter");
              }
            }}
          />
        )}

        {activeTab === "Settings" && (
          <SettingsTab
            darkMode={darkMode}
            onToggleDarkMode={() => setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))}
            defaultCurrencyCode={defaultCurrencyCode}
            onSelectDefaultCurrency={handleSelectDefaultCurrency}
            showExpectedCashToggle={showExpectedCashToggle}
            onToggleExpectedCash={() => setSettings((prev) => ({ ...prev, showExpectedCashToggle: !prev.showExpectedCashToggle }))}
            pwaStatus={pwaStatus}
            pwaRegistered={pwaRegistered}
            deferredInstallPrompt={deferredInstallPrompt}
            onInstallPWA={async () => {
              if (!deferredInstallPrompt) return;
              deferredInstallPrompt.prompt();
              const { outcome } = await deferredInstallPrompt.userChoice;
              if (outcome === "accepted") {
                setDeferredInstallPrompt(null);
                showToast("Currency Counter installed");
              }
            }}
            onClearAllData={requestClearAllData}
          />
        )}

        {activeTab === "About" && (
          <AboutTab darkMode={darkMode} />
        )}
      </main>
      
      {/* Mobile & Tablet Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabSelect={handleTabSelect}
        darkMode={darkMode}
      />

      {/* Global Receipt Preview Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        counter={activeCounter}
        currency={activeCurrency}
        reportDate={reportDate}
        mergedDenoms={mergedActiveDenoms}
        customDenomsMap={customDenomsMap}
        notifyFn={showToast}
      />

      {/* WhatsApp Share Customization Modal */}
      <WhatsAppShareModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        activeCounter={activeCounter}
        activeCurrency={activeCurrency}
        counters={counters}
        combinedByCurrency={combinedByCurrency}
        grandWords={grandWords}
        reportDate={reportDate}
        customDenomsMap={customDenomsMap}
        notifyFn={showToast}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
