import React from 'react';
import { Moon, Sun, Smartphone, Trash2 } from 'lucide-react';
import FlagIcon from '../FlagIcon';
import { DEFAULT_CURRENCIES } from '../../data/currencies';
import { formatCurrencyAmount, getCurrencyObj } from '../../utils/currencyUtils';

export default function SettingsTab({
  darkMode,
  onToggleDarkMode,
  defaultCurrencyCode,
  onSelectDefaultCurrency,
  showExpectedCashToggle,
  onToggleExpectedCash,
  pwaStatus,
  pwaRegistered,
  deferredInstallPrompt,
  onInstallPWA,
  onClearAllData
}) {
  const allCurrenciesList = Object.values(DEFAULT_CURRENCIES);
  const defaultCurrency = getCurrencyObj(defaultCurrencyCode);

  // Compute accurate PWA badge state
  const status = pwaStatus || (pwaRegistered ? "ready" : "registering");
  let pwaBadgeClass = "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
  let pwaBadgeText = "Registering Service Worker...";

  if (status === "ready") {
    pwaBadgeClass = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";
    pwaBadgeText = "Service Worker Ready";
  } else if (status === "failed") {
    pwaBadgeClass = "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";
    pwaBadgeText = "Service Worker Offline / Registration Failed";
  } else if (status === "unsupported") {
    pwaBadgeClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    pwaBadgeText = "Service Worker Not Supported";
  }

  return (
    <div className="space-y-6 max-w-[760px]">
      {/* Appearance Section */}
      <div className={`rounded-2xl border p-6 ${
        darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="font-bold text-[16px] flex items-center gap-2">
          <Moon className="w-4 h-4" />
          <h2 className="font-bold text-[16px]">Appearance</h2>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">Dark Mode</div>
            <div className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Navbar stays active, background switches to dark theme
            </div>
          </div>

          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className={`w-12 h-7 rounded-full p-1 transition flex items-center ${
              darkMode ? "bg-[#16a34a] justify-end" : "bg-slate-200 justify-start"
            }`}
          >
            <span className="w-5 h-5 bg-white rounded-full shadow grid place-items-center">
              {darkMode ? <Moon className="w-3 h-3 text-slate-900" /> : <Sun className="w-3 h-3 text-amber-600" />}
            </span>
          </button>
        </div>
      </div>

      {/* Currency Settings Section */}
      <div className={`rounded-2xl border p-6 ${
        darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <h2 className="font-bold text-[16px]">Currency Settings</h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Default Currency Card */}
          <div className={`rounded-xl p-4 border ${
            darkMode ? "bg-[#0f1a2b] border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="text-xs font-semibold opacity-60">DEFAULT FOR NEW COUNTERS</div>
            <div className="mt-1 font-semibold flex items-center gap-2">
              <FlagIcon currency={defaultCurrency} size="lg" />
              <span>{defaultCurrency.name} ({defaultCurrency.code})</span>
            </div>
            <div className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Denominations: {defaultCurrency.denoms.map((d) => `${defaultCurrency.symbol}${formatCurrencyAmount(d, defaultCurrency.code)}`).join(", ")}
            </div>
          </div>

          {/* Expected Cash Toggle Card */}
          <div className={`rounded-xl p-4 border ${
            darkMode ? "bg-[#0f1a2b] border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="text-xs font-semibold opacity-60">EXPECTED CASH TOGGLE</div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-medium">Show Expected vs Counted</span>
              <button
                onClick={onToggleExpectedCash}
                aria-label="Toggle expected cash comparison view"
                className={`w-11 h-6 rounded-full p-1 flex items-center transition ${
                  showExpectedCashToggle ? "bg-[#16a34a] justify-end" : "bg-slate-300 justify-start"
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>
            <div className={`mt-3 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {allCurrenciesList.length} currencies • Per-counter currency enabled
            </div>
          </div>
        </div>

        {/* Currency Selector Grid */}
        <div className="mt-4">
          <div className="text-xs font-semibold opacity-70 mb-2">SELECT DEFAULT CURRENCY FOR NEW COUNTERS</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {allCurrenciesList.map((curr) => {
              const isSelected = defaultCurrencyCode === curr.code;
              return (
                <div
                  key={curr.code}
                  onClick={() => onSelectDefaultCurrency(curr.code)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Set default currency to ${curr.name} (${curr.code})`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectDefaultCurrency(curr.code);
                    }
                  }}
                  className={`rounded-xl border p-2.5 text-center cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md select-none ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500/30"
                      : darkMode
                      ? "bg-[#0f1a2b] border-slate-800 hover:border-slate-600 hover:bg-[#16233a]"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex justify-center">
                    <FlagIcon currency={curr} size="xl" />
                  </div>
                  <div className="text-[12px] font-bold mt-2">{curr.code}</div>
                  <div className="text-[11px] opacity-60">{curr.symbol}</div>
                  <div className="text-[9px] mt-1 opacity-50 truncate">{curr.flagCode.toUpperCase()}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PWA Section */}
      <div className={`rounded-2xl border p-6 ${
        darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <img
            src="/icon.svg"
            alt="Currency Counter Logo"
            className="w-12 h-12 rounded-xl object-contain shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 flex-shrink-0"
          />
          <div>
            <div className="font-bold text-[16px] flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-bold text-[16px]">PWA Status & App Install</h2>
            </div>
            <div className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Install Currency Counter on your device for fast offline tallying
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm flex flex-wrap gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pwaBadgeClass}`}>
            {pwaBadgeText}
          </span>

          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            deferredInstallPrompt
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : darkMode
              ? "bg-[#1a2740] text-slate-400"
              : "bg-slate-100 text-slate-600"
          }`}>
            {deferredInstallPrompt ? "Install Prompt Available" : "Install banner will show when eligible"}
          </span>
        </div>

        {deferredInstallPrompt && (
          <button
            onClick={onInstallPWA}
            aria-label="Install Currency Counter App"
            className="mt-4 px-4 py-2.5 rounded-lg bg-[#16a34a] text-white text-sm font-semibold hover:bg-[#15803d] transition flex items-center gap-2 shadow-sm"
          >
            <img src="/icon.svg" alt="" className="w-4 h-4 object-contain" />
            <span>Install App</span>
          </button>
        )}
      </div>

      {/* Danger Zone */}
      <div className={`rounded-2xl border p-6 ${
        darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <h2 className="font-bold text-[16px] text-red-600">Danger Zone</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={onClearAllData}
            aria-label="Clear All Application Data"
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-red-700 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>
          <span className={`text-xs self-center ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Completely resets all counters, history, custom denominations, and settings on this device.
          </span>
        </div>
      </div>
    </div>
  );
}
