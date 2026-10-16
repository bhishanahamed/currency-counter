import React from 'react';
import { History as HistoryIcon, Calculator, Trash } from 'lucide-react';
import FlagIcon from '../FlagIcon';
import {
  formatCurrencyAmount,
  amountInWords,
  getCurrencyObj,
  calculateCounterTotals
} from '../../utils/currencyUtils';

export default function HistoryTab({
  darkMode,
  history,
  onClearHistory,
  onDeleteSession,
  onLoadSession
}) {
  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className={`rounded-2xl p-6 border flex items-center justify-between ${
        darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl grid place-items-center ${
            darkMode ? "bg-[#1a2740]" : "bg-slate-900 text-white"
          }`}>
            <HistoryIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">History</h1>
            <div className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {history.length} saved session{history.length === 1 ? '' : 's'} in localStorage
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            aria-label="Clear all saved history sessions"
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
              darkMode ? "border-slate-700 hover:bg-red-900/20 text-slate-300" : "border-slate-200 hover:bg-red-50 text-slate-600"
            }`}
          >
            Clear History
          </button>
        )}
      </div>

      {/* History Items or Empty State */}
      {history.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center ${
          darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
        }`}>
          <div className={`w-12 h-12 mx-auto rounded-full grid place-items-center mb-3 ${
            darkMode ? "bg-[#1a2740]" : "bg-slate-100"
          }`}>
            <Calculator className="w-6 h-6" />
          </div>
          <div className="font-semibold">No history yet</div>
          <div className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Save snapshots from Counter tab to see them persisted here.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((session) => {
            const totalsByCurrency = (() => {
              const map = new Map();
              (session.counters || []).forEach((c) => {
                const stats = calculateCounterTotals(c);
                const code = c.currencyCode || "INR";
                const currency = getCurrencyObj(code);
                const existing = map.get(code);
                if (existing) {
                  existing.total += stats.total;
                  existing.notes += stats.notes;
                } else {
                  map.set(code, {
                    total: stats.total,
                    notes: stats.notes,
                    currency
                  });
                }
              });
              const items = Array.from(map.values());
              const CURRENCY_ORDER = ["INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "AED", "SAR", "SGD"];
              return items.sort((a, b) => {
                const idxA = CURRENCY_ORDER.indexOf(a.currency.code);
                const idxB = CURRENCY_ORDER.indexOf(b.currency.code);
                if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                return a.currency.code.localeCompare(b.currency.code);
              });
            })();

            const wordsSummary = totalsByCurrency
              .map((item) => `${item.currency.code}: ${amountInWords(item.total, item.currency.code)}`)
              .join(" • ");

            return (
              <div
                key={session.id}
                className={`rounded-2xl p-4 border ${
                  darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-[14px] flex flex-wrap gap-2">
                      {totalsByCurrency.map((item) => (
                        <span key={item.currency.code} className="inline-flex items-center gap-1.5">
                          <FlagIcon currency={item.currency} size="sm" />
                          <span>{item.currency.symbol}{formatCurrencyAmount(item.total, item.currency.code)}</span>
                        </span>
                      ))}
                    </div>
                    <div className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {new Date(session.timestamp).toLocaleString("en-IN")} • {session.totalItems ?? session.totalNotes} items • {session.counters.length} counters
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteSession(session.id)}
                    aria-label={`Delete session from ${new Date(session.timestamp).toLocaleDateString()}`}
                    className={`w-8 h-8 rounded-lg grid place-items-center border transition ${
                      darkMode ? "border-slate-700 hover:bg-red-900/20" : "border-slate-200 hover:bg-red-50"
                    }`}
                    title="Delete Session"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {session.counters.map((c) => {
                    const stats = calculateCounterTotals(c);
                    const currencyObj = getCurrencyObj(c.currencyCode || "INR");
                    return (
                      <span
                        key={c.id}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1.5 ${
                          darkMode ? "bg-[#0f1a2b] border-slate-700" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <FlagIcon currency={currencyObj} size="sm" />
                        <span>{c.name}: {currencyObj.symbol}{formatCurrencyAmount(stats.total, currencyObj.code)}</span>
                      </span>
                    );
                  })}
                </div>

                <div className="mt-3 flex gap-2 items-center">
                  <button
                    onClick={() => onLoadSession(session)}
                    aria-label="Load this session into Counter tab"
                    className="px-3 py-1.5 rounded-lg bg-[#16a34a] text-white text-xs font-semibold hover:bg-[#15803d] transition"
                  >
                    Load
                  </button>
                  <span className={`text-[11px] px-2 py-1 rounded-full truncate max-w-[200px] ${
                    darkMode ? "bg-[#1a2740] text-slate-400" : "bg-slate-100 text-slate-600"
                  }`}>
                    {wordsSummary.slice(0, 90)}...
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
