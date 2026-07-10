/**
 * "Got a Sec?" — Between-Activity Suggestions
 *
 * Shows today's class schedule. When an open slot exists between activities,
 * the AI surfaces a contextual suggestion card. The teacher can accept (adds
 * to plan) or dismiss each suggestion independently.
 */

import { useState } from "react";
import { Check, ChevronRight, Clock4, Sparkles, X } from "lucide-react";
import { classSchedule, formatClassTime } from "@/data/mock-spanish";
import { cn } from "@/lib/utils";

const KIND_STYLE: Record<string, string> = {
  class:  "bg-primary/10 border-primary/20 text-foreground",
  break:  "bg-muted border-border text-muted-foreground",
  prep:   "bg-sky-50 border-sky-200 text-sky-800",
  open:   "bg-fuego-50 border-fuego-200 text-fuego-800",
};

const KIND_LABEL: Record<string, string> = {
  class: "Class",
  break: "Break",
  prep:  "Prep",
  open:  "Open",
};

const DAY_START = 0;          // 8:00 AM in minutes-from-8AM
const DAY_END   = 6 * 60 + 30; // 2:30 PM
const DAY_DURATION = DAY_END - DAY_START;

function toPercent(m: number)                  { return (m / DAY_DURATION) * 100; }
function widthPct(start: number, end: number)  { return ((end - start) / DAY_DURATION) * 100; }

export function GotASec() {
  // Track which open slots have been accepted or dismissed
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  // Which open slot card is currently expanded
  const [active, setActive] = useState<string | null>(
    () => classSchedule.find((p) => p.openSlot)?.id ?? null,
  );

  const openSlots = classSchedule.filter(
    (p) => p.openSlot && !dismissed.has(p.id),
  );

  function accept(id: string) {
    setAccepted((prev) => new Set(prev).add(id));
  }
  function dismiss(id: string) {
    setDismissed((prev) => new Set(prev).add(id));
    if (active === id) {
      // Advance to next open slot
      const next = openSlots.find((p) => p.id !== id);
      setActive(next?.id ?? null);
    }
  }

  const activeSlot = classSchedule.find((p) => p.id === active) ?? null;

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-sm sm:p-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock4 className="h-5 w-5 text-fuego-500" />
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Got a Sec?
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Your class schedule, with AI suggestions for open gaps between activities.
          </p>
        </div>
        {openSlots.length > 0 && (
          <span className="rounded-full border border-fuego-200 bg-fuego-50 px-3 py-1 text-xs font-medium text-fuego-700">
            {openSlots.length} open gap{openSlots.length !== 1 ? "s" : ""} today
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="mt-8">
        {/* Track */}
        <div className="relative h-12 overflow-hidden rounded-xl bg-secondary">
          {classSchedule.map((period) => {
            const w = widthPct(period.startMinutes, period.endMinutes);
            if (w < 0.3) return null;
            const isActive = period.id === active;
            return (
              <button
                key={period.id}
                type="button"
                disabled={!period.openSlot}
                onClick={() => period.openSlot && setActive(period.id)}
                title={`${period.title} · ${formatClassTime(period.startMinutes)}–${formatClassTime(period.endMinutes)}`}
                className={cn(
                  "absolute top-1 bottom-1 overflow-hidden rounded-lg border px-1.5",
                  "flex flex-col items-start justify-center transition-all",
                  KIND_STYLE[period.kind],
                  period.openSlot && !dismissed.has(period.id) && "cursor-pointer hover:brightness-95",
                  isActive && "ring-2 ring-fuego-500 ring-offset-1",
                )}
                style={{ left: `${toPercent(period.startMinutes)}%`, width: `${w}%` }}
              >
                <span className="truncate text-[10px] font-semibold leading-none">
                  {period.group ?? KIND_LABEL[period.kind]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time axis */}
        <div className="relative mt-1.5 h-4">
          {[8, 9, 10, 11, 12, 13, 14].map((h) => {
            const m = (h - 8) * 60;
            if (m > DAY_END) return null;
            return (
              <span
                key={h}
                className="absolute -translate-x-1/2 select-none text-[10px] text-muted-foreground"
                style={{ left: `${toPercent(m)}%` }}
              >
                {h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`}
              </span>
            );
          })}
        </div>
      </div>

      {/* Open slot tab strip */}
      {openSlots.length > 1 && (
        <div className="mt-6 flex gap-2">
          {openSlots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setActive(slot.id)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                active === slot.id
                  ? "border-fuego-300 bg-fuego-50 text-fuego-800"
                  : "border-border bg-background text-muted-foreground hover:bg-secondary",
              )}
            >
              {formatClassTime(slot.startMinutes)}
            </button>
          ))}
        </div>
      )}

      {/* Active suggestion card */}
      {activeSlot && !dismissed.has(activeSlot.id) && (
        <div className="mt-5 rounded-2xl border border-fuego-200 bg-fuego-50 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fuego-500/10">
                <Sparkles className="h-4 w-4 text-fuego-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-fuego-600">
                  {formatClassTime(activeSlot.startMinutes)} –{" "}
                  {formatClassTime(activeSlot.endMinutes)} · Open slot
                </p>
                <p className="mt-1 text-sm leading-relaxed text-fuego-900">
                  {activeSlot.suggestion}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => dismiss(activeSlot.id)}
              aria-label="Dismiss suggestion"
              className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-fuego-400 transition-colors hover:bg-fuego-100 hover:text-fuego-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {accepted.has(activeSlot.id) ? (
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-700">
              <Check className="h-4 w-4" />
              Added to today&rsquo;s plan
            </div>
          ) : (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => accept(activeSlot.id)}
                className={cn(
                  "bg-thermal flex items-center gap-1.5 rounded-lg px-4 py-2",
                  "text-sm font-semibold text-white shadow-sm",
                  "transition-all hover:brightness-105",
                )}
              >
                <ChevronRight className="h-4 w-4" />
                Yes, add it
              </button>
              <button
                type="button"
                onClick={() => dismiss(activeSlot.id)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Not now
              </button>
            </div>
          )}
        </div>
      )}

      {openSlots.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          All suggestions handled. Nice work.
        </p>
      )}
    </div>
  );
}
