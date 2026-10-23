import React, { useEffect, useRef } from 'react';
import { Search, X, Globe, CheckCircle2 } from 'lucide-react';
import FlagIcon from './FlagIcon';

export default function CurrencyPicker({
  isOpen,
  onClose,
  selectedCode,
  onSelect,
  currenciesList = [],
  searchQuery = '',
  setSearchQuery,
  darkMode,
  title = 'Select Currency',
  align = 'right'
}) {
  const searchInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (window.innerWidth < 640 && mobileInputRef.current) {
          mobileInputRef.current.focus();
        } else if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderCurrencyList = (isMobile = false) => {
    if (currenciesList.length === 0) {
      return (
        <div className="py-10 px-4 text-center text-xs opacity-60 font-medium">
          No matching currency found
        </div>
      );
    }

    return currenciesList.map((curr) => {
      const isSelected = selectedCode === curr.code;
      return (
        <button
          key={curr.code}
          type="button"
          onClick={() => {
            onSelect(curr.code);
            onClose();
          }}
          className={`group w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-sm text-left transition-all ${
            isSelected
              ? 'bg-[#16a34a] text-white shadow-sm shadow-emerald-700/25'
              : darkMode
              ? 'hover:bg-[#1a2740] text-slate-200 active:bg-[#203050]'
              : 'hover:bg-slate-100/90 text-slate-800 active:bg-slate-200/80'
          }`}
          role="option"
          aria-selected={isSelected}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <FlagIcon currency={curr} size="md" className="shrink-0" />
            <span className="font-extrabold text-sm shrink-0 min-w-[22px] text-center">
              {curr.symbol}
            </span>
            <span className="font-bold text-sm shrink-0 tracking-tight">
              {curr.code}
            </span>
            <span
              className={`text-xs truncate font-medium ${
                isSelected
                  ? 'text-white/90'
                  : darkMode
                  ? 'text-slate-400 group-hover:text-slate-300'
                  : 'text-slate-500 group-hover:text-slate-700'
              }`}
              title={curr.name}
            >
              {curr.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                isSelected
                  ? 'bg-white/20 text-white border border-white/25 font-semibold'
                  : darkMode
                  ? 'bg-slate-800/90 text-slate-300 border border-slate-700/80 group-hover:border-slate-600'
                  : 'bg-slate-100 text-slate-600 border border-slate-200/80 group-hover:bg-slate-200/60'
              }`}
            >
              <span className="font-bold tabular-nums">{curr.denoms?.length || 0}</span>
              <span className="text-[10px] opacity-80 font-normal">denoms</span>
            </span>
            {isSelected && (
              <CheckCircle2 className="w-4 h-4 text-white shrink-0 drop-shadow-sm" />
            )}
          </div>
        </button>
      );
    });
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. Mobile Drawer View (< 640px) - Guaranteed Zero Overflow */}
      {/* ============================================================== */}
      <div
        className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Bottom Sheet Modal */}
        <div
          className={`relative w-full max-h-[86vh] rounded-t-3xl border-t shadow-2xl flex flex-col overflow-hidden transition-transform animate-in slide-in-from-bottom duration-200 ${
            darkMode ? 'bg-[#0f1a2b] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pull Handle & Header */}
          <div className="pt-2.5 pb-2 px-4 flex flex-col items-center border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mb-3" />
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm tracking-tight">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close currency picker"
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Field */}
          <div
            className={`p-3 border-b flex items-center gap-2.5 ${
              darkMode ? 'border-slate-800 bg-[#0c1424]/60' : 'border-slate-100 bg-slate-50/70'
            }`}
          >
            <Search className="w-4 h-4 shrink-0 text-slate-400" />
            <input
              ref={mobileInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search by currency, name, or symbol..."
              aria-label="Search currency"
              className={`flex-1 bg-transparent outline-none text-sm py-1 font-medium ${
                darkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery && setSearchQuery('')}
                aria-label="Clear currency search"
                className="p-1 rounded-md text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition opacity-60 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Currency List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[50vh]">
            {renderCurrencyList(true)}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. Tablet & Desktop Popover (>= 640px) - Anchored inside card */}
      {/* ============================================================== */}
      <div
        className={`hidden sm:block absolute ${
          align === 'left' ? 'left-0' : 'right-0'
        } mt-2 w-[360px] max-w-[calc(100vw-32px)] rounded-2xl border shadow-[0_20px_45px_rgba(0,0,0,0.18)] z-40 overflow-hidden backdrop-blur-md transition-all ${
          darkMode ? 'bg-[#0f1a2b]/95 border-slate-700' : 'bg-white/95 border-slate-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`p-2.5 border-b flex items-center gap-2.5 ${
            darkMode ? 'border-slate-800 bg-[#0c1424]/60' : 'border-slate-100 bg-slate-50/60'
          }`}
        >
          <Search className="w-4 h-4 shrink-0 text-slate-400" />
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search currency..."
            aria-label="Search currency"
            className={`flex-1 bg-transparent outline-none text-sm py-0.5 font-medium ${
              darkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery && setSearchQuery('')}
              aria-label="Clear currency search"
              className="p-1 rounded-md text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition opacity-60 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="max-h-[340px] overflow-y-auto p-1.5 space-y-1">
          {renderCurrencyList(false)}
        </div>
      </div>
    </>
  );
}
