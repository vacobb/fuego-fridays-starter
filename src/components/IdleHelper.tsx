/**
 * IdleHelper — pops up after idleMs of no mouse movement and asks if the
 * user needs help. Dismisses only when the user explicitly closes it —
 * moving the mouse or clicking while the popup is open does NOT close it.
 * After dismissal the timer re-arms so it will pop up again after another
 * idle period.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const IDLE_MS = 15_000;

interface IdleHelperProps {
  imageSrc: string;
  name?: string;
  idleMs?: number;
  /** Called when the user clicks "Yes, help me". */
  onOpenChat?: () => void;
  /** Increment to force a reset from outside (e.g. when chat closes). */
  resetKey?: number;
}

export function IdleHelper({
  imageSrc,
  name = "Chase",
  idleMs = IDLE_MS,
  onOpenChat,
  resetKey = 0,
}: IdleHelperProps) {
  const [visible, setVisible] = useState(false);

  const visibleRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  visibleRef.current = visible;

  const armTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(true), idleMs);
  }, [idleMs]);

  // When resetKey increments (e.g. chat closed), hide and re-arm
  useEffect(() => {
    if (resetKey === 0) return;
    setVisible(false);
    armTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const handleActivity = useCallback(
    (e: Event) => {
      // While the popup is visible, ignore events inside it so the user
      // can interact with the buttons freely.
      if (visibleRef.current) {
        const target = e.target as Node | null;
        if (popupRef.current?.contains(target)) return;
        // Activity outside the popup — leave it visible, don't reset timer.
        return;
      }
      // Popup not showing — reset the idle countdown.
      armTimer();
    },
    [armTimer],
  );

  useEffect(() => {
    armTimer();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("pointerdown", handleActivity);
    window.addEventListener("scroll", handleActivity, { passive: true });
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [armTimer, handleActivity]);

  function handleDismiss() {
    setVisible(false);
    // Re-arm so it comes back after another idle period
    armTimer();
  }

  function handleNeedHelp() {
    setVisible(false);
    onOpenChat?.();
    // Re-arm — if the user closes the chat and goes idle again, Chase checks in
    armTimer();
  }

  if (!visible) return null;

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="false"
      aria-label={`${name} is offering help`}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "animate-in slide-in-from-bottom-4 fade-in duration-300",
      )}
    >
      <div className="flex w-72 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <img
            src={imageSrc}
            alt={`${name}, your AI helper`}
            className="h-full w-full object-cover object-top"
          />
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            className={cn(
              "absolute right-2 top-2 flex h-7 w-7 items-center justify-center",
              "rounded-full bg-black/40 text-white backdrop-blur-sm",
              "transition-colors hover:bg-black/60",
            )}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-4">
          <p className="font-display text-base font-semibold leading-snug">
            Need a hand?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            You&rsquo;ve been idle for a bit. {name} noticed — want some help?
          </p>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleNeedHelp}
              className={cn(
                "bg-thermal flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2",
                "text-sm font-semibold text-white shadow-sm",
                "transition-all hover:brightness-105",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Yes, help me
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className={cn(
                "flex-1 rounded-lg border border-border px-3 py-2",
                "text-sm font-medium text-muted-foreground",
                "transition-colors hover:bg-secondary hover:text-foreground",
              )}
            >
              I&rsquo;m good
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
