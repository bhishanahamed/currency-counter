import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Copy, Check, ExternalLink, Share2, Phone, FileText, CheckSquare, Square, MessageCircle } from 'lucide-react';
import FlagIcon from './FlagIcon';
import {
  buildWhatsAppShareText,
  openWhatsAppUrl
} from '../utils/currencyUtils';

export default function WhatsAppShareModal({
  isOpen,
  onClose,
  activeCounter,
  activeCurrency,
  counters = [],
  combinedByCurrency = [],
  grandWords = "",
  reportDate = new Date(),
  customDenomsMap = {},
  notifyFn
}) {
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  const [scope, setScope] = useState('active'); // 'active' | 'all'
  const [includeBreakdown, setIncludeBreakdown] = useState(true);
  const [includeTally, setIncludeTally] = useState(true);
  const [includeWords, setIncludeWords] = useState(true);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Focus management and escape key listener
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElementRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      if (modalRef.current) modalRef.current.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Generate formatted WhatsApp message based on current options
  const shareText = useMemo(() => {
    return buildWhatsAppShareText({
      counter: activeCounter,
      currency: activeCurrency,
      counters,
      combinedByCurrency,
      grandWords,
      reportDate,
      customDenomsMap,
      options: {
        scope,
        includeBreakdown,
        includeTally,
        includeWords,
        includeTimestamp,
        customNote
      }
    });
  }, [
    activeCounter,
    activeCurrency,
    counters,
    combinedByCurrency,
    grandWords,
    reportDate,
    customDenomsMap,
    scope,
    includeBreakdown,
    includeTally,
    includeWords,
    includeTimestamp,
    customNote
  ]);

  if (!isOpen) return null;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      if (notifyFn) notifyFn("WhatsApp message copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      if (notifyFn) notifyFn("Failed to copy to clipboard");
    }
  };

  const handleShareToWhatsApp = () => {
    openWhatsAppUrl(shareText, phoneNumber);
    if (notifyFn) notifyFn(phoneNumber.trim() ? "Opening WhatsApp chat..." : "Opening WhatsApp...");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-share-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] focus:outline-none"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-600 via-[#25D366] to-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <MessageCircle className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h2 id="whatsapp-share-title" className="text-base sm:text-lg font-bold leading-tight">
                Share to WhatsApp
              </h2>
              <p className="text-xs text-white/90">
                Customize breakdown & send formatted cash report
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close WhatsApp share dialog"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Scope Selector (if multiple counters) */}
          {counters.length > 1 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                What do you want to share?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScope('active')}
                  className={`p-3 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center gap-2.5 ${
                    scope === 'active'
                      ? 'border-[#25D366] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <FlagIcon currency={activeCurrency} size="sm" />
                  <div className="truncate">
                    <span className="block font-bold">{activeCounter?.name || "Active Counter"}</span>
                    <span className="text-[11px] opacity-70">Single counter breakdown</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setScope('all')}
                  className={`p-3 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center gap-2.5 ${
                    scope === 'all'
                      ? 'border-[#25D366] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Share2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <span className="block font-bold">All Counters</span>
                    <span className="text-[11px] opacity-70">{counters.length} counters summary</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Options / Checkboxes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Include In Message
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIncludeBreakdown((prev) => !prev)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs sm:text-sm font-medium transition text-left ${
                  includeBreakdown
                    ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-200'
                    : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                {includeBreakdown ? (
                  <CheckSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Denomination Breakdown (₹500 × ...)</span>
              </button>

              <button
                type="button"
                onClick={() => setIncludeTally((prev) => !prev)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs sm:text-sm font-medium transition text-left ${
                  includeTally
                    ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-200'
                    : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                {includeTally ? (
                  <CheckSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Expected Cash & Difference Tally</span>
              </button>

              <button
                type="button"
                onClick={() => setIncludeWords((prev) => !prev)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs sm:text-sm font-medium transition text-left ${
                  includeWords
                    ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-200'
                    : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                {includeWords ? (
                  <CheckSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Amount in Words</span>
              </button>

              <button
                type="button"
                onClick={() => setIncludeTimestamp((prev) => !prev)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs sm:text-sm font-medium transition text-left ${
                  includeTimestamp
                    ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-200'
                    : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                {includeTimestamp ? (
                  <CheckSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Date & Time Timestamp</span>
              </button>
            </div>
          </div>

          {/* Optional Inputs: Phone & Custom Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="whatsapp-phone-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Recipient WhatsApp Number (Optional)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 focus-within:border-[#25D366] transition">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  id="whatsapp-phone-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9+]/g, ''))}
                  placeholder="e.g. 919876543210"
                  aria-label="Recipient WhatsApp Number"
                  className="w-full bg-transparent text-xs sm:text-sm outline-none font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Leave empty to pick contact or group inside WhatsApp.
              </p>
            </div>

            <div>
              <label htmlFor="whatsapp-note-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Optional Note / Reference
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 focus-within:border-[#25D366] transition">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  id="whatsapp-note-input"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value.slice(0, 50))}
                  maxLength={50}
                  placeholder="e.g. Closing cash tally"
                  aria-label="Optional note"
                  className="w-full bg-transparent text-xs sm:text-sm outline-none font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Shown at top of WhatsApp message.
              </p>
            </div>
          </div>

          {/* Live Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Message Preview
              </label>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? "Copied!" : "Copy message"}</span>
              </button>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#EFEAE2]/60 dark:bg-[#111b21] font-mono text-xs text-slate-800 dark:text-[#E9EDEF] whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto shadow-inner select-all">
              {shareText}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-wrap gap-2.5 justify-end items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition flex items-center gap-1.5"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? "Copied!" : "Copy Text"}</span>
          </button>

          <button
            type="button"
            onClick={handleShareToWhatsApp}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-emerald-600/25 transition flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Open in WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
}
