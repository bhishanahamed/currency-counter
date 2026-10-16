import React, { useEffect, useRef, useState } from 'react';

export default function AdSlot({ label = "Advertisement", slotId = "1111111111", dark = false }) {
  const containerRef = useRef(null);
  const [adRequested, setAdRequested] = useState(false);

  // Check if a genuine AdSense client ID has been provided via environment variable
  const clientId = (typeof import.meta !== "undefined" && import.meta.env?.VITE_ADSENSE_CLIENT_ID) || "";
  const isConfigured = Boolean(
    clientId &&
    clientId.startsWith("ca-pub-") &&
    !clientId.includes("XXXX")
  );

  useEffect(() => {
    if (!isConfigured) return;

    // Dynamically load Google AdSense script only when a real client ID is configured
    const scriptId = "google-adsense-script";
    let scriptTag = document.getElementById(scriptId);

    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = scriptId;
      scriptTag.async = true;
      scriptTag.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      scriptTag.crossOrigin = "anonymous";
      scriptTag.onerror = () => {
        console.debug("AdSense script load blocked or unavailable");
      };
      document.head.appendChild(scriptTag);
    }

    try {
      if (typeof window !== "undefined") {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        setAdRequested(true);
      }
    } catch (err) {
      console.debug("AdSense push skipped or blocked:", err);
    }
  }, [isConfigured, clientId]);

  return (
    <div
      className={`w-full rounded-xl border border-dashed flex flex-col items-center justify-center py-5 px-4 text-center transition ${
        dark ? "bg-[#1a2332]/60 border-slate-700/80 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
      }`}
      role="region"
      aria-label={label}
    >
      <div className="text-[10px] tracking-widest uppercase opacity-70 mb-1.5 font-semibold">
        {label}
      </div>

      {isConfigured ? (
        <div ref={containerRef} className="w-full max-w-[728px]">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={clientId}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        <div className="py-1.5 text-xs opacity-75 font-mono">
          Ad Slot • {slotId}
        </div>
      )}

      <div className={`mt-1 text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
        Google AdSense {isConfigured ? (adRequested ? "• Active" : "") : "• Unconfigured"}
      </div>
    </div>
  );
}
