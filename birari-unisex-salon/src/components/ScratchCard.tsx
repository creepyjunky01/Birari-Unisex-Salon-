"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircleIcon } from "@/components/icons";

type Props = {
  offerTitle: string;
  offerDescription: string | null;
  registrationId: string;
  alreadyRedeemed: boolean;
  token: string;
  onRevealed: () => void;
};

const REVEAL_THRESHOLD = 0.45;

export default function ScratchCard({
  offerTitle,
  offerDescription,
  registrationId,
  alreadyRedeemed,
  token,
  onRevealed
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [revealed, setRevealed] = useState(alreadyRedeemed);
  const scratchingRef = useRef(false);
  const reportedRef = useRef(alreadyRedeemed);

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#c9a227";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(11,11,12,0.85)";
    ctx.font = "600 13px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Scratch here", width / 2, height / 2);

    function getPos(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function scratchAt(x: number, y: number) {
      ctx!.globalCompositeOperation = "destination-out";
      ctx!.beginPath();
      ctx!.arc(x, y, 22, 0, Math.PI * 2);
      ctx!.fill();
    }

    function checkRevealPercentage() {
      const imageData = ctx!.getImageData(0, 0, width, height).data;
      let cleared = 0;
      for (let i = 3; i < imageData.length; i += 4 * 8) {
        if (imageData[i] === 0) cleared++;
      }
      const total = imageData.length / (4 * 8);
      return cleared / total;
    }

    function handlePointerDown(e: PointerEvent) {
      scratchingRef.current = true;
      const { x, y } = getPos(e);
      scratchAt(x, y);
    }
    function handlePointerMove(e: PointerEvent) {
      if (!scratchingRef.current) return;
      const { x, y } = getPos(e);
      scratchAt(x, y);
      if (checkRevealPercentage() > REVEAL_THRESHOLD) {
        finishReveal();
      }
    }
    function handlePointerUp() {
      scratchingRef.current = false;
    }

    function finishReveal() {
      setRevealed(true);
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [revealed]);

  useEffect(() => {
    if (!revealed || reportedRef.current) return;
    reportedRef.current = true;

    fetch("/api/scratch/reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then(() => onRevealed())
      .catch(() => {
        // Non-fatal: the offer is still shown to the customer even if the
        // status update fails; admin can reconcile from the dashboard.
        onRevealed();
      });
  }, [revealed, token, onRevealed]);

  return (
    <div className="relative mx-auto h-40 w-full max-w-xs overflow-hidden rounded-2xl border border-gold-300/60 bg-gradient-to-br from-ink to-black">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-cream">
        <CheckCircleIcon className="mb-1 h-5 w-5 text-gold-300" />
        <p className="font-display text-2xl font-bold text-gold-200">{offerTitle}</p>
        {offerDescription && <p className="mt-1 text-xs text-white/60">{offerDescription}</p>}
        <p className="mt-2 text-[10px] uppercase tracking-widest text-white/40">
          {registrationId}
        </p>
      </div>

      {!revealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-pointer touch-none"
          aria-label="Scratch card overlay — scratch to reveal your offer"
        />
      )}
    </div>
  );
}
