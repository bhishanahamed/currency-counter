import React from 'react';
import { Banknote, Globe, Shield } from 'lucide-react';
import FlagIcon from '../FlagIcon';
import { DEFAULT_CURRENCIES } from '../../data/currencies';
import { formatCurrencyAmount, getCurrencyObj, calculateCounterTotals } from '../../utils/currencyUtils';

export default function HomeTab({
  darkMode,
  onNavigate,
  onSaveSnapshot,
  defaultCurrencyCode,
  counters,
  combinedByCurrency,
  combinedStats,
  grandWords
}) {
  const allCurrenciesList = Object.values(DEFAULT_CURRENCIES);
  const defaultCurrency = getCurrencyObj(defaultCurrencyCode);

  return (
    <div className="space-y-6">
      {/* Hero Container */}
      <div className={`rounded-[20px] p-6 sm:p-8 border ${darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"}`}>
        <div className="flex flex-wrap items-start justify-between gap-6">

          {/* Hero Left Content */}
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center gap-3 mb-3">
              <img src="/icon.svg" alt="Currency Counter" className="w-10 h-10 object-contain drop-shadow-sm flex-shrink-0" />
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-50 text-emerald-700"}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>LIVE COUNTING</span>
              </div>
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-bold tracking-tight leading-[1.1]">
              Count Smarter.<br />
              10 Currencies.
            </h1>
            <p className={`mt-3 text-[14px] leading-6 max-w-[520px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Multi-counter tally for shops, banks, and cashiers. Supporting {allCurrenciesList.length} major currencies with custom and decimal denominations. All data stays persisted on your device.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("Counter")}
                className="px-5 py-2.5 rounded-lg bg-[#16a34a] text-white font-semibold text-sm hover:bg-[#15803d] transition"
              >
                Start Counting
              </button>
              <button
                onClick={onSaveSnapshot}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm border transition ${darkMode ? "border-slate-700 bg-[#1a2538] hover:bg-[#22334f]" : "border-slate-200 bg-white hover:bg-slate-50"}`}
              >
                Save Snapshot
              </button>
            </div>

            {/* Currency Pill Badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              {allCurrenciesList.slice(0, 6).map((c) => (
                <span
                  key={c.code}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${darkMode ? "bg-[#1a2740] border-slate-700" : "bg-slate-50 border-slate-200"}`}
                >
                  <FlagIcon currency={c} size="sm" />
                  <span>{c.code}</span>
                </span>
              ))}
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${darkMode ? "bg-[#1a2740] border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                +{allCurrenciesList.length - 6} more
              </span>
            </div>
          </div>

          {/* Hero Right Widget */}
          <div className={`w-full sm:w-[360px] rounded-2xl p-5 border ${darkMode ? "bg-[#0f1a2b] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
            <div className={`text-xs font-semibold tracking-widest ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {combinedByCurrency.length > 1 ? "COMBINED • PER CURRENCY" : "COMBINED TOTAL"}
            </div>

            {combinedByCurrency.length <= 1 ? (
              <>
                <div className="mt-2 flex items-baseline gap-2">
                  <FlagIcon
                    currency={combinedByCurrency[0]?.currency || defaultCurrency}
                    size="lg"
                  />
                  <div className="text-[32px] font-extrabold tracking-tight">
                    {combinedByCurrency[0]?.currency.symbol || defaultCurrency.symbol}{" "}
                    {formatCurrencyAmount(combinedByCurrency[0]?.total || 0, combinedByCurrency[0]?.currency.code || defaultCurrencyCode)}
                  </div>
                </div>
                <div className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  {combinedStats.notes} items • {grandWords}
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-2">
                {combinedByCurrency.map((item) => (
                  <div
                    key={item.currency.code}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 border ${darkMode ? "bg-[#16233a] border-slate-800" : "bg-white border-slate-200"}`}
                  >
                    <div className="flex items-center gap-2">
                      <FlagIcon currency={item.currency} size="md" />
                      <span className="text-[13px] font-bold">{item.currency.code}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] font-extrabold">
                        {item.currency.symbol} {formatCurrencyAmount(item.total, item.currency.code)}
                      </div>
                      <div className="text-[11px] opacity-60">{item.notes} items</div>
                    </div>
                  </div>
                ))}
                <div className={`text-xs mt-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {combinedStats.notes} total items across {counters.length} counters
                </div>
              </div>
            )}

            {/* Individual Counter Summaries */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {counters.map((c) => {
                const stats = calculateCounterTotals(c);
                const currency = getCurrencyObj(c.currencyCode);
                return (
                  <div
                    key={c.id}
                    className={`rounded-xl px-3 py-2.5 border ${darkMode ? "bg-[#16233a] border-slate-800" : "bg-white border-slate-200"}`}
                  >
                    <div className="text-[11px] font-semibold truncate opacity-70 flex items-center gap-1">
                      <FlagIcon currency={currency} size="sm" />
                      <span className="truncate">{c.name}</span>
                    </div>
                    <div className="text-[15px] font-bold mt-1">
                      {currency.symbol} {formatCurrencyAmount(stats.total, c.currencyCode)}
                    </div>
                    <div className="text-[11px] opacity-60">
                      {stats.notes} items • {currency.code}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`rounded-2xl p-5 border ${darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Banknote className="w-4 h-4" />
            <span>Denominations</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {defaultCurrency.denoms.map((d) => (
              <span
                key={d}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${darkMode ? "bg-[#1a2740] border-slate-700" : "bg-slate-50 border-slate-200"}`}
              >
                {defaultCurrency.symbol}{formatCurrencyAmount(d, defaultCurrency.code)}
              </span>
            ))}
          </div>
          <div className={`mt-3 text-xs flex items-center gap-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            <FlagIcon currency={defaultCurrency} size="sm" />
            <span>{defaultCurrency.code} • {defaultCurrency.name}</span>
          </div>
        </div>

        <div className={`rounded-2xl p-5 border ${darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Globe className="w-4 h-4" />
            <span>Multi-Currency</span>
          </div>
          <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {allCurrenciesList.length} currencies supported. Each counter can have its own currency. Combined view groups by currency safely without improper conversion.
          </p>
        </div>

        <div className={`rounded-2xl p-5 border ${darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Shield className="w-4 h-4" />
            <span>Privacy First</span>
          </div>
          <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            No data leaves your device. Counters, history, and custom denominations are securely saved in your browser localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}
