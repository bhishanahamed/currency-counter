import React from 'react';
import {
  Globe, ChevronDown, Search, CheckCircle2, Plus, Trash2, Minus,
  AlertCircle, Receipt as ReceiptIcon, Save, X, Store, Pencil, Tag
} from 'lucide-react';
import FlagIcon from '../FlagIcon';
import CurrencyPicker from '../CurrencyPicker';
import { DEFAULT_CURRENCIES } from '../../data/currencies';
import {
  formatCurrencyAmount,
  amountInWords,
  getCurrencyObj,
  calculateCounterTotals,
  getCustomDenomLabel,
  normalizeMoney,
  MAX_CUSTOM_DENOM_LABEL_LENGTH
} from '../../utils/currencyUtils';

export default function CounterTab({
  darkMode,
  defaultCurrencyCode,
  onSelectDefaultCurrency,
  counters,
  activeCounterId,
  activeCounter,
  activeCurrency,
  mergedActiveDenoms,
  customDenomsMap,
  showExpectedCashToggle,
  combinedByCurrency,
  combinedStats,
  grandWords,
  onAddCounter,
  onRemoveCounter,
  onRenameCounter,
  onSwitchCounterCurrency,
  onSelectActiveCounter,
  onQtyStep,
  onQtyInput,
  onExpectedCashChange,
  onClearCounter,
  onAddCustomDenom,
  onRemoveCustomDenom,
  onResetCustomDenoms,
  onSaveSnapshot,
  onExportCSV,
  onShareWhatsApp,
  onViewReceipt,
  // Custom Denom Form State
  isAddCustomOpen,
  setIsAddCustomOpen,
  customDenomInputVal,
  setCustomDenomInputVal,
  customDenomLabelInputVal,
  setCustomDenomLabelInputVal,
  // Currency Dropdown Popups State
  isDefaultDropdownOpen,
  setIsDefaultDropdownOpen,
  isActiveCounterDropdownOpen,
  setIsActiveCounterDropdownOpen,
  currencySearchQuery,
  setCurrencySearchQuery,
  filteredCurrenciesList
}) {
  const activeCounterStats = calculateCounterTotals(activeCounter);
  const denomsToUse = mergedActiveDenoms || [];
  const hasDecimalDenoms = denomsToUse.some((d) => d % 1 !== 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Default Currency Dropdown */}
      <div
        data-currency-dropdown="true"
        className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-4 ${
          darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl grid place-items-center ${darkMode ? "bg-[#1a2740]" : "bg-slate-900 text-white"}`}>
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[13px] font-bold">Default Currency</div>
            <div className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Default for new counters • {Object.keys(DEFAULT_CURRENCIES).length} supported
            </div>
          </div>
        </div>

        <div data-currency-dropdown="true" className="relative">
          <button
            onClick={() => {
              setIsDefaultDropdownOpen((prev) => !prev);
              setCurrencySearchQuery("");
            }}
            aria-label="Select default currency for new counters"
            className={`min-w-[190px] flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
              darkMode ? "bg-[#0f1a2b] border-slate-700 hover:border-slate-600" : "bg-slate-50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FlagIcon currency={getCurrencyObj(defaultCurrencyCode)} size="md" />
              <span className="font-extrabold">{getCurrencyObj(defaultCurrencyCode).symbol}</span>
              <span>{defaultCurrencyCode}</span>
              <span className="hidden sm:inline text-xs font-medium opacity-60 truncate max-w-[110px]">
                {getCurrencyObj(defaultCurrencyCode).name}
              </span>
            </span>
            <ChevronDown className={`w-4 h-4 transition ${isDefaultDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <CurrencyPicker
            isOpen={isDefaultDropdownOpen}
            onClose={() => setIsDefaultDropdownOpen(false)}
            selectedCode={defaultCurrencyCode}
            onSelect={(code) => onSelectDefaultCurrency(code)}
            currenciesList={filteredCurrenciesList}
            searchQuery={currencySearchQuery}
            setSearchQuery={setCurrencySearchQuery}
            darkMode={darkMode}
            title="Select Default Currency"
            align="right"
          />
        </div>
      </div>

      {/* Counters Pill Tabs Row */}
      <div className="flex flex-wrap items-center gap-2">
        {counters.map((c) => {
          const currencyObj = getCurrencyObj(c.currencyCode);
          const stats = calculateCounterTotals(c);
          const isActive = activeCounterId === c.id;

          return (
            <div key={c.id} className="flex items-center gap-1">
              <button
                onClick={() => onSelectActiveCounter(c.id)}
                aria-label={`Select counter ${c.name}`}
                className={`px-3.5 py-2.5 rounded-full text-sm font-semibold border transition flex items-center gap-2 ${
                  isActive
                    ? "bg-[#16a34a] text-white border-[#16a34a] shadow-[0_4px_12px_rgba(22,163,74,0.25)]"
                    : darkMode
                    ? "bg-[#1a2538] border-slate-700 text-slate-300 hover:bg-[#22334f]"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <FlagIcon currency={currencyObj} size="sm" />
                <span className="max-w-[100px] sm:max-w-[130px] truncate">{c.name}</span>
                {isActive && (
                  <Pencil className="w-3 h-3 text-white/80 shrink-0" title="Active counter (editable below)" />
                )}
                <span className={`text-[10px] tracking-widest px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-white/20" : darkMode ? "bg-slate-700" : "bg-slate-100"
                }`}>
                  {currencyObj.code}
                </span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20" : darkMode ? "bg-slate-800" : "bg-slate-50"
                }`}>
                  {currencyObj.symbol}{formatCurrencyAmount(stats.total, c.currencyCode)}
                </span>
              </button>

              {counters.length > 1 && (
                <button
                  onClick={() => onRemoveCounter(c.id)}
                  className={`w-7 h-7 rounded-full grid place-items-center border ${
                    darkMode ? "border-slate-700 hover:bg-red-900/20" : "border-slate-200 hover:bg-red-50"
                  }`}
                  aria-label={`Remove counter ${c.name}`}
                  title="Remove Counter"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={onAddCounter}
          aria-label="Add new counter"
          className={`px-3.5 py-2.5 rounded-full text-sm font-semibold border border-dashed flex items-center gap-1.5 ${
            darkMode ? "border-slate-600 text-slate-300 hover:bg-[#1a2538]" : "border-slate-300 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Counter</span>
        </button>
      </div>

      {/* Active Counter & Store Name Customization Header Bar */}
      <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
        darkMode ? "bg-[#121b2c] border-slate-800 shadow-lg shadow-black/20" : "bg-white border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
      }`}>
        {/* Top Header Label & Preset Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Counter / Store Name
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Customizable
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Customize this name for your shop, cashier, or drawer (e.g. Supermarket, Till 1)
              </p>
            </div>
          </div>

          {/* Quick Preset Chips for easy 1-click identification */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">Presets:</span>
            {["Supermarket", "Cashier 1", "Till 1", "Retail Shop", "Petrol Pump"].map((preset) => {
              const isCurrent = activeCounter?.name === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onRenameCounter(activeCounterId, preset)}
                  aria-label={`Set name to ${preset}`}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
                    isCurrent
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : darkMode
                      ? "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-slate-800"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-500/50 hover:text-emerald-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{preset}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Name Input & Currency Selector Row */}
        <div className="mt-3.5 flex flex-wrap items-center gap-3">
          {/* Prominent Name Input with Pencil Icon */}
          <div className="flex-1 min-w-[220px] sm:min-w-[260px] max-w-[380px] relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Pencil className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <input
              id="active-counter-name-input"
              value={activeCounter?.name || ""}
              onChange={(e) => onRenameCounter(activeCounterId, e.target.value)}
              aria-label="Customize Counter or Store Name"
              placeholder="e.g. Supermarket, Cashier 1, Till"
              maxLength={30}
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-bold border transition outline-none shadow-sm ${
                darkMode
                  ? "bg-[#0f1a2b] border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              }`}
            />
          </div>

        {/* Currency Switcher for Active Counter */}
        <div data-currency-dropdown="true" className="relative">
          <button
            onClick={() => {
              setIsActiveCounterDropdownOpen((prev) => !prev);
              setCurrencySearchQuery("");
            }}
            aria-label={`Switch currency for ${activeCounter?.name || "active counter"}`}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold ${
              darkMode ? "bg-[#0f1a2b] border-slate-700" : "bg-slate-50 border-slate-200"
            }`}
          >
            <FlagIcon currency={activeCurrency} size="md" />
            <span className="font-bold">{activeCurrency.code}</span>
            <span className="opacity-60 font-medium">{activeCurrency.symbol}</span>
            <ChevronDown className={`w-3.5 h-3.5 ${isActiveCounterDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <CurrencyPicker
            isOpen={isActiveCounterDropdownOpen}
            onClose={() => setIsActiveCounterDropdownOpen(false)}
            selectedCode={activeCounter?.currencyCode || "INR"}
            onSelect={(code) => onSwitchCounterCurrency(activeCounterId, code)}
            currenciesList={filteredCurrenciesList}
            searchQuery={currencySearchQuery}
            setSearchQuery={setCurrencySearchQuery}
            darkMode={darkMode}
            title={`Switch Currency (${activeCounter?.name || "Counter"})`}
            align="right"
          />
        </div>

        <div className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap shrink-0 flex items-center gap-1.5 ${darkMode ? "bg-[#1a2740] border-slate-700" : "bg-slate-50 border-slate-200"}`}>
          <span className="font-bold">
            {activeCurrency.symbol}{formatCurrencyAmount(activeCounterStats.total, activeCounter?.currencyCode, hasDecimalDenoms)}
          </span>
          <span className="opacity-60">
            {" • "}{activeCounterStats.notes} items • {denomsToUse.length} denoms
          </span>
        </div>
      </div>
    </div>

      {/* Main Tallying Table */}
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"}`}>
        {/* Table Header */}
        <div className={`grid grid-cols-[96px_1fr_120px_120px] sm:grid-cols-[120px_1fr_150px_160px] gap-2 px-4 py-3 text-[11px] font-semibold tracking-widest uppercase border-b ${
          darkMode ? "bg-[#0f1a2b] border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
        }`}>
          <div className="flex items-center gap-1.5">
            <FlagIcon currency={activeCurrency} size="sm" />
            <span>Denom</span>
          </div>
          <div>Qty</div>
          <div className="text-center">Count</div>
          <div className="text-right">Value</div>
        </div>

        {/* Denomination Rows */}
        {denomsToUse.map((denom) => {
          const qty = activeCounter?.qtys?.[denom] || 0;
          const lineTotal = normalizeMoney(qty * denom);
          const isCustom = (customDenomsMap[activeCurrency.code] || []).some(
            (cItem) => {
              const val = typeof cItem === 'object' && cItem !== null ? cItem.value : cItem;
              return Math.abs(val - denom) < 0.0001;
            }
          );
          const customLabel = isCustom ? getCustomDenomLabel(activeCurrency.code, denom, customDenomsMap) : "";

          return (
            <div
              key={denom}
              className={`grid grid-cols-[96px_1fr_120px_120px] sm:grid-cols-[120px_1fr_150px_160px] gap-2 px-4 py-3 items-center border-b last:border-0 ${
                darkMode ? "border-slate-800" : "border-slate-100"
              } ${qty > 0 ? (darkMode ? "bg-[#16233a]/60" : "bg-emerald-50/50") : ""} ${
                isCustom ? (darkMode ? "border-l-2 border-l-amber-500/60" : "border-l-2 border-l-amber-400") : ""
              }`}
            >
              {/* Denom Label */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg grid place-items-center text-[11px] font-bold ${
                  isCustom
                    ? darkMode
                      ? "bg-amber-900/40 text-amber-300"
                      : "bg-amber-100 text-amber-800"
                    : darkMode
                    ? "bg-[#1a2740] text-emerald-300"
                    : "bg-slate-900 text-white"
                }`}>
                  {activeCurrency.symbol}
                </div>
                <div className="font-bold text-sm flex flex-col">
                  <span>{activeCurrency.symbol}{formatCurrencyAmount(denom, activeCurrency.code, hasDecimalDenoms)}</span>
                  {isCustom && (
                    <span className="text-[9px] font-semibold tracking-widest text-amber-600 dark:text-amber-400 truncate max-w-[90px]" title={customLabel || "Custom"}>
                      {customLabel ? customLabel.toUpperCase() : "CUSTOM"}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => onQtyStep(denom, -1)}
                  aria-label={`Decrease quantity of ${activeCurrency.symbol}${denom}`}
                  className={`w-7 h-7 rounded-lg border grid place-items-center text-xs transition ${
                    darkMode ? "border-slate-700 bg-[#1a2538] hover:bg-[#22334f]" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <input
                  inputMode="numeric"
                  value={qty === 0 ? "" : String(qty)}
                  placeholder="0"
                  maxLength={7}
                  aria-label={`Quantity of ${activeCurrency.symbol}${denom}`}
                  onChange={(e) => onQtyInput(denom, e.target.value)}
                  className={`w-[66px] sm:w-[82px] px-1.5 py-1 rounded-lg border text-center text-sm font-semibold ${
                    darkMode ? "bg-[#0f1a2b] border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}
                />

                <button
                  onClick={() => onQtyStep(denom, 1)}
                  aria-label={`Increase quantity of ${activeCurrency.symbol}${denom}`}
                  className={`w-7 h-7 rounded-lg border grid place-items-center transition ${
                    darkMode ? "border-slate-700 bg-[#1a2538] hover:bg-[#22334f]" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                {/* Quick Add Buttons */}
                <div className="flex gap-1 ml-1">
                  <button
                    onClick={() => onQtyStep(denom, 5)}
                    aria-label={`Add 5 to ${activeCurrency.symbol}${denom}`}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border transition ${
                      darkMode ? "border-slate-700 bg-[#1a2740] hover:bg-[#22334f]" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    +5
                  </button>
                  <button
                    onClick={() => onQtyStep(denom, 10)}
                    aria-label={`Add 10 to ${activeCurrency.symbol}${denom}`}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border transition ${
                      darkMode ? "border-slate-700 bg-[#1a2740] hover:bg-[#22334f]" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    +10
                  </button>
                </div>

                {isCustom && (
                  <button
                    onClick={() => onRemoveCustomDenom(activeCurrency.code, denom)}
                    className="ml-1 w-6 h-6 rounded-full grid place-items-center bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 border border-red-200 dark:border-red-800"
                    aria-label={`Remove custom denomination ${activeCurrency.symbol}${denom}`}
                    title="Remove custom denomination"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Count Column */}
              <div className="text-center text-sm font-medium">
                {qty} ×
              </div>

              {/* Line Total Column */}
              <div className="text-right font-bold text-sm flex items-center justify-end gap-2">
                <span>{activeCurrency.symbol} {formatCurrencyAmount(lineTotal, activeCurrency.code, hasDecimalDenoms)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Denominations Section */}
      <div className={`rounded-2xl border p-4 ${
        darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
      }`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">➕ Custom Denominations</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
              darkMode ? "bg-[#1a2740] border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
            }`}>
              {customDenomsMap[activeCurrency.code]?.length || 0} / 50 for {activeCurrency.code}
            </span>
          </div>

          <button
            onClick={() => setIsAddCustomOpen((prev) => !prev)}
            aria-label="Toggle custom denomination form"
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold border flex items-center gap-1.5 transition ${
              isAddCustomOpen
                ? "bg-[#16a34a] text-white border-[#16a34a]"
                : darkMode
                ? "bg-[#1a2740] border-slate-700 hover:bg-[#22334f]"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{isAddCustomOpen ? "Cancel" : "Add Custom Denom"}</span>
          </button>
        </div>

        {isAddCustomOpen && (
          <div className={`mt-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 p-3 rounded-xl border ${
            darkMode ? "bg-[#0f1a2b] border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <div>
              <label htmlFor="custom-denom-value-input" className="text-[11px] font-semibold tracking-widest opacity-60">
                VALUE • e.g. 2000, 0.50, 0.25
              </label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-bold">{activeCurrency.symbol}</span>
                <input
                  id="custom-denom-value-input"
                  value={customDenomInputVal}
                  onChange={(e) => {
                    let v = e.target.value.replace(/[^0-9.]/g, '');
                    const parts = v.split('.');
                    if (parts.length > 2) {
                      v = parts[0] + '.' + parts.slice(1).join('');
                    }
                    if (v.length > 9) v = v.slice(0, 9);
                    setCustomDenomInputVal(v);
                  }}
                  maxLength={9}
                  placeholder="2000 or 0.50"
                  inputMode="decimal"
                  aria-label="Custom denomination value"
                  className={`flex-1 px-3 py-2.5 rounded-xl border text-sm font-semibold outline-none ${
                    darkMode ? "bg-[#121b2c] border-slate-700 focus:border-emerald-600" : "bg-white border-slate-200 focus:border-emerald-500"
                  }`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="custom-denom-label-input" className="text-[11px] font-semibold tracking-widest opacity-60">
                LABEL (optional)
              </label>
              <input
                id="custom-denom-label-input"
                value={customDenomLabelInputVal}
                onChange={(e) => setCustomDenomLabelInputVal(e.target.value)}
                maxLength={MAX_CUSTOM_DENOM_LABEL_LENGTH}
                placeholder="Old note, coin, etc"
                aria-label="Custom denomination label"
                className={`mt-1 w-full px-3 py-2.5 rounded-xl border text-sm font-medium outline-none ${
                  darkMode ? "bg-[#121b2c] border-slate-700 focus:border-emerald-600" : "bg-white border-slate-200 focus:border-emerald-500"
                }`}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={onAddCustomDenom}
                aria-label="Submit custom denomination"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#16a34a] text-white text-sm font-bold hover:bg-[#15803d] transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            <div className={`sm:col-span-3 text-[11px] leading-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Tip: Add notes like ₹2000, $2 bill, or coins like 0.25, 0.50. Saved in localStorage with custom label. Up to 50 custom denominations per currency.
            </div>
          </div>
        )}

        {(customDenomsMap[activeCurrency.code]?.length || 0) > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(customDenomsMap[activeCurrency.code] || []).map((item) => {
              const val = typeof item === 'object' && item !== null ? item.value : item;
              const label = typeof item === 'object' && item !== null ? item.label : "";
              const qty = activeCounter?.qtys?.[val] || 0;

              return (
                <span
                  key={val}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    darkMode ? "bg-[#1a2740] border-amber-800/50 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}
                >
                  <span>
                    {activeCurrency.symbol}{formatCurrencyAmount(val, activeCurrency.code, hasDecimalDenoms)}
                    {label ? ` (${label})` : ""} [{qty}]
                  </span>
                  <button
                    onClick={() => onRemoveCustomDenom(activeCurrency.code, val)}
                    aria-label={`Remove custom denomination ${activeCurrency.symbol}${val}`}
                    className="ml-1 w-4 h-4 rounded-full bg-black/10 grid place-items-center hover:bg-black/20"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <button
              onClick={() => onResetCustomDenoms(activeCurrency.code)}
              aria-label={`Reset custom denominations for ${activeCurrency.code}`}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                darkMode ? "border-slate-700 bg-[#1a2538] text-slate-300" : "border-slate-200 bg-white text-slate-600"
              } hover:bg-red-50 dark:hover:bg-red-950/20 transition`}
            >
              Reset to Default
            </button>
          </div>
        )}
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Counter Grand Total Card */}
        <div className={`lg:col-span-2 rounded-2xl p-5 sm:p-6 border ${
          darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className={`text-[11px] tracking-widest font-semibold flex items-center gap-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                <FlagIcon currency={activeCurrency} size="sm" />
                <span className="flex items-center gap-1.5 flex-wrap">
                  <span>TOTAL</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Store className="w-3.5 h-3.5" />
                    {activeCounter?.name || "Counter 1"}
                  </span>
                  <span>•</span>
                  <span>{activeCurrency.code}</span>
                </span>
              </div>
              <div className="mt-1 text-[30px] sm:text-[32px] font-extrabold tracking-tight flex items-center gap-2">
                <FlagIcon currency={activeCurrency} size="xl" />
                <span>{activeCurrency.symbol} {formatCurrencyAmount(activeCounterStats.total, activeCurrency.code, hasDecimalDenoms)}</span>
              </div>
              <div className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {amountInWords(activeCounterStats.total, activeCurrency.code)}
              </div>
            </div>

            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              darkMode ? "bg-[#1a2740] text-slate-300" : "bg-slate-100 text-slate-600"
            }`}>
              <FlagIcon currency={activeCurrency} size="sm" />
              <span>{activeCounterStats.notes} items</span>
            </div>
          </div>

          {/* Expected vs Counted Comparison */}
          {showExpectedCashToggle && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`rounded-xl p-3.5 border ${darkMode ? "bg-[#0f1a2b] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <label htmlFor="expected-cash-input" className="text-[11px] font-semibold tracking-widest opacity-60 block">
                  EXPECTED CASH • {activeCurrency.code}
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-bold min-w-[24px]">{activeCurrency.symbol}</span>
                  <input
                    id="expected-cash-input"
                    value={activeCounter?.expectedStr || ""}
                    onChange={(e) => onExpectedCashChange(e.target.value)}
                    maxLength={14}
                    inputMode="decimal"
                    placeholder="e.g. 25000"
                    aria-label={`Expected cash in ${activeCurrency.code}`}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm font-semibold outline-none ${
                      darkMode ? "bg-[#121b2c] border-slate-700 focus:border-emerald-600" : "bg-white border-slate-200 focus:border-emerald-500"
                    }`}
                  />
                </div>
              </div>

              <div className={`rounded-xl p-3.5 border flex flex-col justify-center min-w-0 overflow-hidden ${
                activeCounterStats.diff === 0
                  ? darkMode ? "bg-emerald-900/20 border-emerald-800" : "bg-emerald-50 border-emerald-200"
                  : activeCounterStats.diff > 0
                  ? darkMode ? "bg-amber-900/20 border-amber-800" : "bg-amber-50 border-amber-200"
                  : darkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
              }`}>
                <div className="text-[11px] font-semibold tracking-widest opacity-60">
                  DIFFERENCE • {activeCurrency.code}
                </div>
                <div className="mt-1 flex items-center gap-2 font-bold text-base sm:text-[18px] min-w-0">
                  {activeCounterStats.diff === 0 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0" />
                  )}
                  <span
                    className="truncate min-w-0"
                    title={`${activeCounterStats.diff > 0 ? "+" : ""}${activeCurrency.symbol} ${formatCurrencyAmount(activeCounterStats.diff, activeCurrency.code, hasDecimalDenoms)}`}
                  >
                    {activeCounterStats.diff > 0 ? "+" : ""}
                    {activeCurrency.symbol} {formatCurrencyAmount(activeCounterStats.diff, activeCurrency.code, hasDecimalDenoms)}
                  </span>
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {activeCounterStats.diff === 0 ? "Matched" : activeCounterStats.diff > 0 ? "Excess" : "Short"}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Buttons */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={onViewReceipt}
              aria-label="View Receipt"
              className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-black dark:hover:bg-slate-100 transition shadow-sm"
            >
              <ReceiptIcon className="w-4 h-4" />
              <span>View Receipt</span>
            </button>

            <button
              onClick={onSaveSnapshot}
              aria-label="Save to History"
              className="px-4 py-2 rounded-lg bg-[#16a34a] text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-[#15803d] transition"
            >
              <Save className="w-4 h-4" />
              <span>Save to History</span>
            </button>

            <button
              onClick={onExportCSV}
              aria-label="Export CSV"
              className={`px-4 py-2 rounded-lg border text-sm font-semibold flex items-center gap-1.5 transition ${
                darkMode ? "border-slate-700 bg-[#1a2538] hover:bg-[#22334f]" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>Export CSV</span>
            </button>

            <button
              onClick={onShareWhatsApp}
              aria-label="Share summary to WhatsApp"
              className={`px-4 py-2 rounded-lg border text-sm font-semibold flex items-center gap-1.5 transition ${
                darkMode ? "border-slate-700 bg-[#1a2538] hover:bg-[#22334f] text-emerald-300" : "border-slate-200 bg-white hover:bg-slate-50 text-emerald-700"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.548 4.106 1.51 5.832L0 24l6.335-1.652A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.894 17.38c-.246.697-1.44 1.28-2.006 1.365-.47.07-.985.1-3.182-.677-2.688-1.103-4.412-3.717-4.546-3.888-.134-.17-1.09-1.447-1.09-2.76s.69-1.957.935-2.226c.246-.27.54-.337.72-.337h.52c.167 0 .39-.063.593.452.203.514.7 1.78.762 1.91.062.13.103.28.02.45-.082.17-.124.27-.247.42-.124.15-.26.315-.37.424-.123.12-.25.25-.108.49.143.24.635 1.05 1.363 1.7 0.935 0.834 1.723 1.093 1.97 1.213.246.12.39.1.534-.06.144-.16.614-.714.778-.96.164-.246.328-.205.552-.123.225.082 1.424.672 1.668.793.245.122.408.182.47.285.062.103.062.595-.184 1.292z" />
              </svg>
              <span>WhatsApp Share</span>
            </button>

            <button
              onClick={onClearCounter}
              aria-label={`Clear quantities for ${activeCounter?.name || "current counter"}`}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition ${
                darkMode ? "border-slate-700 bg-[#1a2538] hover:bg-[#22334f]" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              Clear This Counter
            </button>
          </div>
        </div>

        {/* Combined All Counters Card */}
        <div className={`rounded-2xl p-5 border ${
          darkMode ? "bg-[#121b2c] border-slate-800" : "bg-white border-slate-200"
        }`}>
          <div className={`text-[11px] font-semibold tracking-widest flex items-center gap-1.5 ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            <span>
              {combinedByCurrency.length > 1
                ? `COMBINED TOTAL • ${combinedByCurrency.length} CURRENCIES`
                : "COMBINED TOTAL • ALL COUNTERS"}
            </span>
          </div>

          {combinedByCurrency.length <= 1 ? (
            <>
              <div className="mt-3 text-[26px] font-extrabold tracking-tight flex items-center gap-2">
                <FlagIcon currency={combinedByCurrency[0]?.currency || getCurrencyObj(defaultCurrencyCode)} size="lg" />
                <span>
                  {combinedByCurrency[0]?.currency.symbol || getCurrencyObj(defaultCurrencyCode).symbol}{" "}
                  {formatCurrencyAmount(combinedByCurrency[0]?.total || 0, combinedByCurrency[0]?.currency.code || defaultCurrencyCode, hasDecimalDenoms)}
                </span>
              </div>
              <div className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {combinedStats.notes} items across {counters.length} counter{counters.length === 1 ? '' : 's'} • {combinedByCurrency[0]?.currency.code || defaultCurrencyCode}
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-2">
              {combinedByCurrency.map((item) => (
                <div
                  key={item.currency.code}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 border ${
                    darkMode ? "bg-[#0f1a2b] border-slate-800" : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <FlagIcon currency={item.currency} size="sm" />
                    <span className="font-bold">{item.currency.code}</span>
                  </span>
                  <span className="text-right">
                    <div className="font-bold text-[14px]">
                      {item.currency.symbol} {formatCurrencyAmount(item.total, item.currency.code)}
                    </div>
                    <div className="text-[11px] opacity-60">{item.notes} items</div>
                  </span>
                </div>
              ))}
              <div className={`text-xs mt-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {combinedStats.notes} total items • {counters.length} counters • per-currency breakdown
              </div>
            </div>
          )}

          {/* List of Individual Counters */}
          <div className="mt-4 space-y-2">
            {counters.map((c) => {
              const stats = calculateCounterTotals(c);
              const currencyObj = getCurrencyObj(c.currencyCode);
              return (
                <div
                  key={c.id}
                  className={`flex items-center justify-between text-sm p-2.5 rounded-xl border ${
                    darkMode ? "bg-[#0f1a2b] border-slate-800" : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <span className="font-medium truncate flex items-center gap-1.5">
                    <FlagIcon currency={currencyObj} size="sm" />
                    <span className="truncate">{c.name}</span>
                    <span className="text-[10px] opacity-60 font-semibold">{currencyObj.code}</span>
                  </span>
                  <span className="font-bold">
                    {currencyObj.symbol}{formatCurrencyAmount(stats.total, c.currencyCode)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={`mt-4 text-xs leading-5 p-3 rounded-xl border ${
            darkMode ? "bg-[#0f1a2b] border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
          }`}>
            {grandWords}
          </div>
        </div>
      </div>
    </div>
  );
}
