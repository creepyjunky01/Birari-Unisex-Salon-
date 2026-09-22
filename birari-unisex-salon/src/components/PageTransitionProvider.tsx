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

// Total animation time is fast (COVER_MS + REVEAL_MS), and the actual page
// navigation starts partway through the cover animation so it overlaps
// with the visual instead of adding on top of it.
const COVER_MS = 320;
const REVEAL_MS = 320;
const PUSH_AT_MS = 160;
// Hard ceiling: if the new page somehow hasn't finished loading by this
// point after the curtain closes, reveal anyway rather than staying stuck.
const SAFETY_MS = 3500;

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [isPending, startTransition] = useTransition();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearAllTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  useEffect(() => clearAllTimers, []);

  // Once fully covered, wait for the navigation to finish (isPending false)
  // OR the safety timeout, whichever comes first — never both, never stuck.
  useEffect(() => {
    if (phase !== "covered") return;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setPhase("revealing");
      const t = setTimeout(() => setPhase("idle"), REVEAL_MS);
      timersRef.current.push(t);
    };

    const safety = setTimeout(finish, SAFETY_MS);
    timersRef.current.push(safety);

    if (!isPending) {
      finish();
    }

    return () => clearTimeout(safety);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isPending]);

  function navigate(href: string) {
    if (phase !== "idle") return;
    setPhase("covering");

    const pushTimer = setTimeout(() => {
      startTransition(() => {
        router.push(href);
      });
    }, PUSH_AT_MS);
    timersRef.current.push(pushTimer);

    const coverTimer = setTimeout(() => {
      setPhase("covered");
    }, COVER_MS);
    timersRef.current.push(coverTimer);
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
    phase === "covering" ? "duration-[320ms]" : phase === "revealing" ? "duration-[320ms]" : "duration-0";

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
