import React from 'react';
import { Globe, Layers, Shield, Mail, Info } from 'lucide-react';
import FlagIcon from '../FlagIcon';
import { DEFAULT_CURRENCIES } from '../../data/currencies';

export default function AboutTab({ darkMode }) {
  const allCurrenciesList = Object.values(DEFAULT_CURRENCIES);

  return (
    <div className="space-y-6 max-w-[760px]">
      {/* About Us Card */}
      <div className={`rounded-2xl border p-6 sm:p-8 ${
        darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <img
            src="/icon.svg"
            alt="Currency Counter Logo"
            className="w-10 h-10 object-contain rounded-xl p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]" />
              <h1 className="font-bold text-[18px]">About Us • Multi-Currency</h1>
            </div>
            <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Currency Counter Application</div>
          </div>
        </div>

        <h2 className="mt-4 text-[24px] font-extrabold leading-tight">
          Count Smarter. 10 Currencies.
        </h2>

        <p className={`mt-3 text-[14px] leading-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Currency Counter is built for shops, kirana stores, petrol pumps, banks, cashiers and anyone who handles cash daily. Supports {allCurrenciesList.length} major currencies — INR, USD, EUR, GBP, JPY, AUD, CAD, AED, SAR, SGD — with per-counter currency selection, custom denominations, expected cash auditing, and smart combined totals grouped by currency.
        </p>

        {/* Highlight Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`p-4 rounded-xl border ${darkMode ? "bg-[#0f1a2b] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
            <Globe className="w-5 h-5" />
            <div className="mt-2 font-semibold text-sm">10 Currencies</div>
            <div className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Flag + symbol + denoms
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${darkMode ? "bg-[#0f1a2b] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
            <Layers className="w-5 h-5" />
            <div className="mt-2 font-semibold text-sm">Multi-Counter</div>
            <div className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Till, drawer, safe separate + per-counter currency
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${darkMode ? "bg-[#0f1a2b] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
            <Shield className="w-5 h-5" />
            <div className="mt-2 font-semibold text-sm">Local Only</div>
            <div className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Saved to your browser
            </div>
          </div>
        </div>

        {/* Currency Badges */}
        <div className="mt-6 flex flex-wrap gap-2">
          {allCurrenciesList.map((c) => (
            <span
              key={c.code}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                darkMode ? "bg-[#0f1a2b] border-slate-700" : "bg-slate-50 border-slate-200"
              }`}
            >
              <FlagIcon currency={c} size="sm" />
              <span>{c.code} {c.symbol} • {c.denoms.length} denoms</span>
            </span>
          ))}
        </div>
      </div>

      {/* Contact Card */}
      <div className={`rounded-2xl border p-6 ${
        darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="font-bold flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <h2 className="font-bold">Contact</h2>
        </div>

        <div className="mt-3 text-sm">
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
            darkMode ? "bg-[#0f1a2b] border-slate-700" : "bg-slate-50 border-slate-200"
          }`}>
            <Mail className="w-4 h-4" />
            <a href="mailto:contact@currencycounter.in" className="font-semibold hover:underline">
              contact@currencycounter.in
            </a>
          </div>

          <p className={`mt-3 text-xs leading-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            We respond within 24-48 hours for feedback, feature requests, and business inquiries.
          </p>
        </div>
      </div>

      {/* Privacy Summary Card */}
      <div className={`rounded-2xl border p-6 ${
        darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="font-bold flex items-center gap-2">
          <Info className="w-4 h-4" />
          <h2 className="font-bold">Privacy Summary</h2>
        </div>

        <ul className={`mt-3 text-[13px] leading-6 list-disc pl-5 space-y-1 ${
          darkMode ? "text-slate-400" : "text-slate-600"
        }`}>
          <li>
            <strong>No data leaves device:</strong> All cash calculations happen locally in JavaScript.
          </li>
          <li>
            <strong>Offline storage:</strong> Counters, custom denominations, settings, and history are stored directly in browser localStorage.
          </li>
          <li>
            <strong>PWA Support:</strong> Service worker enables offline access anytime.
          </li>
        </ul>
      </div>
    </div>
  );
}
