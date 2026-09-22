"use client";

import { createContext, useContext, useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ScissorsIcon from "@/components/ScissorsIcon";

type Phase = "idle" | "covering" | "covered" | "revealing";

type TransitionContextValue = {
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransitionNav() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("useTransitionNav must be used within PageTransitionProvider");
  }
  return ctx;
}

const COVER_MS = 550;
const REVEAL_MS = 550;

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [isPending, startTransition] = useTransition();
  const coverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase === "covered" && !isPending) {
      setPhase("revealing");
      revealTimerRef.current = setTimeout(() => setPhase("idle"), REVEAL_MS);
    }
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, phase]);

  useEffect(() => {
    return () => {
      if (coverTimerRef.current) clearTimeout(coverTimerRef.current);
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  function navigate(href: string) {
    if (phase !== "idle") return;
    setPhase("covering");
    coverTimerRef.current = setTimeout(() => {
      setPhase("covered");
      startTransition(() => {
        router.push(href);
      });
    }, COVER_MS);
  }

  const transformClass =
    phase === "idle"
      ? "-translate-y-full"
      : phase === "covering"
        ? "translate-y-0"
        : phase === "covered"
          ? "translate-y-0"
          : "translate-y-full";

  const durationClass =
    phase === "covering" || phase === "revealing" ? "duration-[550ms]" : "duration-0";

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[110vh] bg-ink transition-transform ease-[cubic-bezier(0.65,0,0.35,1)] ${transformClass} ${durationClass}`}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-gold-400/70" />
        <div className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center">
          <ScissorsIcon
            className={`h-9 w-9 text-gold-400 drop-shadow-lg ${
              phase !== "idle" ? "animate-birari-snip" : ""
            }`}
          />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
