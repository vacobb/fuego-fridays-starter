/**
 * "Just Need Your Input" — Lesson Plan Editor
 *
 * The AI drafts today's lesson plan. Blocks marked `uncertain` shimmer until
 * the teacher confirms them (tap to accept) or edits them inline. Once all
 * uncertain blocks are resolved, a decision report is generated and can be
 * printed or sent to Priya.
 */

import { useRef, useState } from "react";
import { Check, Pencil, Printer, Send, Sparkles, X } from "lucide-react";
import { lessonPlan, type LessonBlock } from "@/data/mock-spanish";
import { cn } from "@/lib/utils";

/* The three uncertain block ids from mock data — used to build the report. */
const UNCERTAIN_IDS = lessonPlan
  .filter((b) => b.uncertain)
  .map((b) => b.id);

type SendState = "idle" | "sending" | "sent";

export function JustNeedYourInput() {
  const [blocks, setBlocks] = useState<LessonBlock[]>(lessonPlan);
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");
  const reportRef = useRef<HTMLDivElement>(null);

  const uncertainBlocks = blocks.filter((b) => UNCERTAIN_IDS.includes(b.id));
  const pendingCount = uncertainBlocks.filter((b) => b.uncertain && !b.confirmed).length;
  const allResolved = pendingCount === 0;

  // Build report rows — original text vs final decision
  const reportRows = uncertainBlocks.map((b) => {
    const original = lessonPlan.find((p) => p.id === b.id)!.text;
    const final = b.confirmed ?? b.text;
    const wasEdited = final !== original;
    return { id: b.id, original, final, wasEdited };
  });

  /* ── actions ─────────────────────────────────────────────────── */

  function confirm(id: string) {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, uncertain: false, confirmed: b.confirmed ?? b.text } : b,
      ),
    );
    if (editing === id) setEditing(null);
  }

  function startEdit(block: LessonBlock) {
    setEditing(block.id);
    setEditText(block.confirmed ?? block.text);
  }

  function saveEdit(id: string) {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, uncertain: false, confirmed: editText.trim() || b.text }
          : b,
      ),
    );
    setEditing(null);
  }

  function resetAll() {
    setBlocks(lessonPlan);
    setEditing(null);
    setSendState("idle");
  }

  function handlePrint() {
    window.print();
  }

  function handleSend() {
    setSendState("sending");
    // Simulate network delay
    setTimeout(() => setSendState("sent"), 1400);
  }

  /* ── render ──────────────────────────────────────────────────── */

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-sm sm:p-10">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-fuego-500" />
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Just Need Your Input
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            The AI drafted today&rsquo;s lesson plan. Shimmering sections need
            your sign-off — tap to confirm or edit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {allResolved ? (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <Check className="h-3.5 w-3.5" />
              Plan confirmed
            </span>
          ) : (
            <span className="rounded-full border border-fuego-200 bg-fuego-50 px-3 py-1 text-xs font-medium text-fuego-700">
              {pendingCount} block{pendingCount !== 1 ? "s" : ""} need your input
            </span>
          )}
          <button
            type="button"
            onClick={resetAll}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Lesson plan blocks ──────────────────────────────────── */}
      <div className="mt-8 space-y-3">
        {blocks.map((block) => {
          const isUncertain = block.uncertain && !block.confirmed;
          const isConfirmed = !!block.confirmed;
          const isEditing = editing === block.id;

          if (block.type === "heading") {
            return (
              <h3
                key={block.id}
                className="pt-2 font-display text-base font-semibold tracking-tight first:pt-0"
              >
                {block.text}
              </h3>
            );
          }

          return (
            <div
              key={block.id}
              className={cn(
                "group relative rounded-xl border p-4 transition-all",
                isUncertain
                  ? "border-fuego-200 bg-fuego-50"
                  : block.type === "callout"
                    ? "border-border bg-secondary"
                    : "border-border bg-background",
                isConfirmed && "border-emerald-200 bg-emerald-50/50",
              )}
            >
              {/* Shimmer overlay */}
              {isUncertain && !isEditing && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl fuego-shimmer animate-[shimmer_2s_linear_infinite] opacity-60"
                />
              )}

              {isEditing ? (
                <div className="relative space-y-2">
                  <textarea
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    className={cn(
                      "w-full resize-none rounded-lg border border-input bg-background px-3 py-2",
                      "text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30",
                    )}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(block.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <Check className="h-3 w-3" />
                      Save &amp; confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative flex items-start justify-between gap-3">
                  <p
                    className={cn(
                      "text-sm leading-relaxed",
                      isUncertain ? "text-fuego-900" : "text-foreground",
                      isConfirmed && "text-foreground",
                    )}
                  >
                    {block.confirmed ?? block.text}
                  </p>

                  {isUncertain && !isConfirmed ? (
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEdit(block)}
                        aria-label="Edit this block"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-fuego-200 bg-white text-fuego-600 transition-colors hover:bg-fuego-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => confirm(block.id)}
                        aria-label="Confirm this block"
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-fuego-500 text-white transition-colors hover:bg-fuego-600"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : isConfirmed ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check className="h-3 w-3" />
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Decision report — shown only when all blocks resolved ── */}
      {allResolved && (
        <div className="mt-8">
          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Decision Report
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Printable report area */}
          <div
            ref={reportRef}
            id="lesson-plan-report"
            className="mt-5 rounded-2xl border border-border bg-background p-6 print:border-0 print:p-0"
          >
            {/* Report header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-base font-semibold">
                  Lesson Plan Review — AI Decisions
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}
                  {reportRows.filter((r) => r.wasEdited).length} edited,{" "}
                  {reportRows.filter((r) => !r.wasEdited).length} accepted as-is
                </p>
              </div>
              <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 print:inline-flex">
                Approved
              </span>
            </div>

            {/* Decision rows */}
            <div className="mt-5 space-y-4">
              {reportRows.map((row, i) => (
                <div key={row.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Block {i + 1}
                    </span>
                    {row.wasEdited ? (
                      <span className="flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                        <Pencil className="h-2.5 w-2.5" />
                        Edited
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        <Check className="h-2.5 w-2.5" />
                        Accepted
                      </span>
                    )}
                  </div>

                  {row.wasEdited && (
                    <div className="mt-3">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        AI draft
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-through decoration-muted-foreground/40">
                        {row.original}
                      </p>
                    </div>
                  )}

                  <div className={cn("mt-3", !row.wasEdited && "mt-2")}>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {row.wasEdited ? "Your version" : "Accepted text"}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">
                      {row.final}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* Print */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>

            {/* Send to Priya */}
            {sendState === "sent" ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
                <Check className="h-4 w-4" />
                Sent to Priya
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={sendState === "sending"}
                className={cn(
                  "bg-thermal flex items-center gap-2 rounded-xl px-4 py-2.5",
                  "text-sm font-semibold text-white shadow-sm",
                  "transition-all hover:brightness-105",
                  "disabled:pointer-events-none disabled:opacity-60",
                )}
              >
                <Send className="h-4 w-4" />
                {sendState === "sending" ? "Sending…" : "Send report to Priya"}
              </button>
            )}
          </div>

          {sendState === "sent" && (
            <p className="mt-3 text-xs text-muted-foreground">
              Priya received a copy of the approved lesson plan with your edits highlighted.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
