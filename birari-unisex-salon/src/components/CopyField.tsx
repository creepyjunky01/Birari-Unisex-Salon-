"use client";

import { useState } from "react";
import { CopyIcon, CheckCircleIcon } from "@/components/icons";

export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — fail silently, value is still visible.
    }
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-black/10 bg-cream px-4 py-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-black/40">
          {label}
        </p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className="flex items-center gap-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-gold-700 transition-colors hover:bg-gold-50"
      >
        {copied ? (
          <>
            <CheckCircleIcon className="h-3.5 w-3.5" /> Copied
          </>
        ) : (
          <>
            <CopyIcon className="h-3.5 w-3.5" /> Copy
          </>
        )}
      </button>
    </div>
  );
}
