import React from 'react';
import { Info } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[60] no-print pointer-events-none">
      <div className="px-4 py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold shadow-xl border border-black/10 flex items-center gap-2 animate-pulse">
        <Info className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
        <span>{message}</span>
      </div>
    </div>
  );
}
