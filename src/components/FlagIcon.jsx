import React, { useState } from 'react';

export default function FlagIcon({ currency, size = "md", className = "", withCodeBadge = false }) {
  const [hasError, setHasError] = useState(false);

  const dimensionClasses = size === "sm"
    ? "w-5 h-[15px]"
    : size === "lg"
    ? "w-7 h-5"
    : size === "xl"
    ? "w-8 h-6"
    : "w-7 h-5";

  const flagSource = currency.flagSrc || currency.flagUrl;

  if (hasError || !flagSource) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-sm bg-slate-200 dark:bg-slate-700 text-[10px] font-bold leading-none border border-black/10 shadow-sm ${dimensionClasses} ${className}`}
        title={currency.code}
      >
        {currency.flagCode ? currency.flagCode.toUpperCase() : currency.code.slice(0, 2)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <img
        src={flagSource}
        alt={`${currency.code} flag`}
        className={`w-7 h-5 object-cover rounded-sm border border-black/10 shadow-sm ${dimensionClasses} ${className}`}
        style={{ objectFit: "cover" }}
        loading="eager"
        decoding="sync"
        onError={() => setHasError(true)}
      />
      {withCodeBadge && (
        <span className="inline-flex items-center justify-center rounded-[3px] bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[8px] font-bold leading-none px-1 h-[14px] border border-black/10">
          {currency.code.slice(0, 2)}
        </span>
      )}
    </span>
  );
}
