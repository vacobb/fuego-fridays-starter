/**
 * "Where Were We?" — Vocabulary Gap Carousel
 *
 * Surfaces words kids struggled with in the last session, sorted by miss rate.
 * Each card shows the Spanish word, English translation, an emoji, which group
 * got it wrong, and a suggested example sentence for re-teaching.
 *
 * The teacher can queue a word into today's plan (Accept) or mark it resolved
 * (Dismiss). A progress bar tracks how many have been handled.
 */

import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, RotateCcw, X } from "lucide-react";
import { vocabGaps, type VocabWord } from "@/data/mock-spanish";
import { cn } from "@/lib/utils";

export function WhereWereWe() {
  const [words, setWords] = useState<VocabWord[]>(
    [...vocabGaps].sort((a, b) => b.missedBy / b.totalStudents - a.missedBy / a.totalStudents),
  );
  const [index, setIndex] = useState(0);

  const handled = words.filter((w) => w.addedToToday !== undefined).length;
  const total = words.length;
  const current = words[index];

  function addToToday(id: string) {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, addedToToday: true } : w)),
    );
    advance();
  }

  function dismiss(id: string) {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, addedToToday: false } : w)),
    );
    advance();
  }

  function advance() {
    // Move to the next unhandled word, wrapping if needed
    const nextUnhandled = words.findIndex(
      (w, i) => i !== index && w.addedToToday === undefined,
    );
    if (nextUnhandled !== -1) setIndex(nextUnhandled);
  }

  function reset() {
    setWords([...vocabGaps].sort((a, b) => b.missedBy / b.totalStudents - a.missedBy / a.totalStudents));
    setIndex(0);
  }

  function prev() {
    setIndex((i) => (i - 1 + words.length) % words.length);
  }

  function next() {
    setIndex((i) => (i + 1) % words.length);
  }

  const missRate = Math.round((current.missedBy / current.totalStudents) * 100);
  const allDone = handled === total;

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-sm sm:p-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-fuego-500" />
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Where Were We?
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Words kids struggled with last session — review and queue them for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {handled}/{total} handled
          </span>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset all"
            className="flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-fuego-500 transition-all duration-500"
          style={{ width: `${total > 0 ? (handled / total) * 100 : 0}%` }}
        />
      </div>

      {allDone ? (
        /* All done state */
        <div className="mt-10 flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-7 w-7 text-emerald-600" />
          </div>
          <p className="font-display text-lg font-semibold">All caught up!</p>
          <p className="text-sm text-muted-foreground">
            Every gap word from last session has been reviewed.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            Start over
          </button>
        </div>
      ) : (
        <>
          {/* Card carousel */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous word"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {/* The card */}
            <div
              className={cn(
                "relative flex-1 rounded-2xl border p-6 transition-all",
                current.addedToToday === true
                  ? "border-emerald-200 bg-emerald-50"
                  : current.addedToToday === false
                    ? "border-border bg-secondary opacity-60"
                    : "border-fuego-200 bg-fuego-50",
              )}
            >
              {/* Group badge */}
              <span className="absolute right-4 top-4 rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {current.group}
              </span>

              {/* Emoji + word */}
              <div className="flex items-center gap-4">
                <span className="text-5xl leading-none" role="img" aria-label={current.english}>
                  {current.emoji}
                </span>
                <div>
                  <p className="font-display text-3xl font-bold tracking-tight text-foreground">
                    {current.spanish}
                  </p>
                  <p className="mt-0.5 text-base text-muted-foreground">
                    {current.english}
                  </p>
                </div>
              </div>

              {/* Miss rate bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Missed by {current.missedBy} of {current.totalStudents} students</span>
                  <span
                    className={cn(
                      "font-semibold",
                      missRate >= 60 ? "text-destructive" : missRate >= 40 ? "text-fuego-600" : "text-muted-foreground",
                    )}
                  >
                    {missRate}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-background/60">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      missRate >= 60 ? "bg-destructive" : missRate >= 40 ? "bg-fuego-500" : "bg-muted-foreground",
                    )}
                    style={{ width: `${missRate}%` }}
                  />
                </div>
              </div>

              {/* Example sentence */}
              <div className="mt-4 rounded-lg border border-border bg-background/60 px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Suggested re-teach sentence
                </p>
                <p className="mt-1 text-sm italic text-foreground">
                  &ldquo;{current.exampleSentence}&rdquo;
                </p>
              </div>

              {/* Status badge if already handled */}
              {current.addedToToday === true && (
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                  <Check className="h-4 w-4" />
                  Added to today&rsquo;s plan
                </div>
              )}
              {current.addedToToday === false && (
                <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <X className="h-4 w-4" />
                  Skipped
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next word"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-secondary"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="mt-4 flex justify-center gap-1.5">
            {words.map((w, i) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to ${w.spanish}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index
                    ? "w-5 bg-fuego-500"
                    : w.addedToToday === true
                      ? "w-2 bg-emerald-400"
                      : w.addedToToday === false
                        ? "w-2 bg-border"
                        : "w-2 bg-muted-foreground/30",
                )}
              />
            ))}
          </div>

          {/* Actions */}
          {current.addedToToday === undefined && (
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => dismiss(current.id)}
                className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Skip it
              </button>
              <button
                type="button"
                onClick={() => addToToday(current.id)}
                className={cn(
                  "bg-thermal flex items-center gap-2 rounded-xl px-5 py-2.5",
                  "text-sm font-semibold text-white shadow-sm",
                  "transition-all hover:brightness-105",
                )}
              >
                <Check className="h-4 w-4" />
                Add to today
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
