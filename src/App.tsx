import { useState } from "react";

import { ArrowUpRight, CalendarDays, Check, Clock, Copy, Sparkles, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IdleHelper } from "@/components/IdleHelper";
import { ChaseChat } from "@/components/ChaseChat";
import { JustNeedYourInput } from "@/components/JustNeedYourInput";
import { GotASec } from "@/components/GotASec";
import { WhereWereWe } from "@/components/WhereWereWe";
import { StudentDashboard } from "@/components/StudentDashboard";
import { mockCalendar, formatTime, type CalendarEvent } from "@/data/mock-calendar";
import { cn } from "@/lib/utils";

/** Copy-and-paste starter prompts for Kiro's chat. */
const PROMPTS = [
  "What is humorphism? Show me a few patterns I could build.",
  "What's already in this project that I can build with?",
  "What do you already know about this workshop?",
  "I do ___ at work. Suggest a humorphic pattern and build a first version.",
  "Build the 'Just Need Your Input' pattern for ___.",
  "Replace this landing page with a chat screen that uses the mock data.",
];

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [idleResetKey, setIdleResetKey] = useState(0);

  function handleCloseChat() {
    setChatOpen(false);
    setIdleResetKey((k) => k + 1);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* Masthead */}
      <header className="border-b border-border/60">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-3 items-center px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3 justify-self-start">
            <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              Fuego Fridays
            </span>
            <Badge
              variant="outline"
              className="rounded-full border-border text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
            >
              starter
            </Badge>
          </div>
          <span className="hidden items-center gap-1.5 justify-self-center whitespace-nowrap rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground md:inline-flex">
            <Check className="h-3.5 w-3.5 text-fuego-500" />
            You&rsquo;re live &middot; localhost is running
          </span>
          <a
            href="https://humorphism.com"
            target="_blank"
            rel="noreferrer"
            className="justify-self-end text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            humorphism.com
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-24 sm:px-8">
        {/* Hero */}
        <section className="mt-8 w-full rounded-3xl border border-border/60 bg-card p-8 shadow-sm sm:mt-12 sm:p-12 lg:p-16">
          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Build a front-end for an AI teammate.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground sm:text-xl">
            Pick one humorphic pattern. Build it into an experience that&rsquo;s
            relevant to you, personally or at work.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="https://humorphism.com/foundations/notice"
              target="_blank"
              rel="noreferrer"
              className={cn(
                "bg-thermal inline-flex items-center gap-1.5 rounded-md px-4 py-2.5",
                "text-sm font-bold text-white shadow-sm",
                "transition-all hover:-translate-y-0.5 hover:brightness-105",
              )}
            >
              Browse humorphic patterns
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <span className="inline-flex items-center rounded-md border border-border px-4 py-2.5 text-sm text-muted-foreground">
              The pattern is the constraint. The domain is yours.
            </span>
          </div>
        </section>

        {/* Meeting scheduler */}
        <section className="mt-8">
          <MeetingScheduler />
        </section>

        {/* ── Spanish teacher patterns ─────────────────────────────── */}

        {/* Just Need Your Input — AI-drafted lesson plan with uncertain blocks */}
        <section className="mt-8">
          <JustNeedYourInput />
        </section>

        {/* Got a Sec? — gap-aware suggestions between class periods */}
        <section className="mt-8">
          <GotASec />
        </section>

        {/* Where Were We? — vocabulary gap carousel from last session */}
        <section className="mt-8">
          <WhereWereWe />
        </section>

        {/* Student Dashboard — track progress and know when to check in */}
        <section className="mt-8">
          <StudentDashboard />
        </section>

        {/* ─────────────────────────────────────────────────────────── */}

        {/* Start with Kiro */}
        <section className="mt-20 px-8 sm:px-12 lg:px-16">
          <SectionLabel>Start with Kiro</SectionLabel>
          <p className="mt-4 text-lg leading-relaxed text-foreground sm:text-xl">
            In your Kiro IDE, everything you need to start building is already
            set up. This page, the localhost preview you&rsquo;re looking at now,
            is what you&rsquo;ll change, and Kiro can help you do it. Open
            Kiro&rsquo;s chat (<Kbd>⌘</Kbd>
            <Kbd>L</Kbd> on Mac, <Kbd>Ctrl</Kbd>
            <Kbd>L</Kbd> on Windows), tap a prompt to copy it, and paste it in.
          </p>
          <div className="mt-14">
            <PromptGroup
              label="Suggested prompts to get started"
              prompts={PROMPTS}
            />
          </div>
        </section>

        {/* Vision tip */}
        <section className="mt-10 px-8 sm:px-12 lg:px-16">
          <div className="rounded-lg border border-fuego-500/25 bg-fuego-500/[0.05] p-5">
            <p className="font-display text-lg font-semibold">
              Show Kiro what you mean. Give it your eyes
            </p>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              Kiro&rsquo;s chat accepts images, so you can show it instead of
              describing it. Paste or drag in a screenshot and say &ldquo;build
              this.&rdquo; It works just as well for changes: screenshot what
              Kiro builds on your localhost, point out what&rsquo;s off, and tell
              it what to fix. A picture is faster than words for a UI.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:px-8">
          <span>React 19 · TypeScript · Vite · Tailwind · shadcn/ui</span>
          <span>No backend. Mock everything. The UX is the deliverable.</span>
        </div>
      </footer>

      {/* Idle helper — pops up after 5s of no mouse movement */}
      <IdleHelper
        imageSrc="/helper.jpeg"
        name="Chase"
        idleMs={5000}
        onOpenChat={() => setChatOpen(true)}
        resetKey={idleResetKey}
      />

      {/* Chase chat panel */}
      <ChaseChat
        open={chatOpen}
        onClose={handleCloseChat}
        imageSrc="/helper.jpeg"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Meeting Scheduler                                                    */
/* ------------------------------------------------------------------ */

/** Colleagues with their own mock busy blocks. */
const COLLEAGUES = [
  {
    name: "Priya",
    initials: "PR",
    color: "bg-violet-100 text-violet-700",
    busy: [
      { start: 9 * 60,       end: 9 * 60 + 15 },  // standup
      { start: 10 * 60,      end: 11 * 60 },        // design review
      { start: 11 * 60,      end: 11 * 60 + 30 },   // launch sync
      { start: 13 * 60,      end: 14 * 60 },         // catch-up
      { start: 16 * 60,      end: 16 * 60 + 30 },   // 1:1
    ],
  },
  {
    name: "Marcus",
    initials: "MA",
    color: "bg-sky-100 text-sky-700",
    busy: [
      { start: 9 * 60,       end: 9 * 60 + 15 },
      { start: 9 * 60 + 30,  end: 10 * 60 + 30 },   // sprint planning
      { start: 11 * 60,      end: 12 * 60 },
      { start: 15 * 60,      end: 16 * 60 },
    ],
  },
  {
    name: "Dana",
    initials: "DA",
    color: "bg-emerald-100 text-emerald-700",
    busy: [
      { start: 9 * 60,        end: 9 * 60 + 15 },
      { start: 10 * 60 + 30,  end: 11 * 60 + 30 },  // stakeholder sync
      { start: 14 * 60 + 30,  end: 15 * 60 + 30 },  // demos
      { start: 16 * 60,       end: 16 * 60 + 30 },
    ],
  },
] as const;

const DAY_START = 9 * 60;
const DAY_END = 17 * 60;
const DAY_DURATION = DAY_END - DAY_START;
const HOUR_MARKERS = Array.from({ length: 9 }, (_, i) => 9 + i); // 9–17

function toPercent(minutes: number) {
  return ((minutes - DAY_START) / DAY_DURATION) * 100;
}
function widthPercent(start: number, end: number) {
  return ((end - start) / DAY_DURATION) * 100;
}

function overlaps(
  busy: readonly { start: number; end: number }[],
  start: number,
  end: number,
) {
  return busy.some((b) => start < b.end && end > b.start);
}

/** Finds the earliest mutual 30-min open slot. */
function findBestSlot(
  yourEvents: CalendarEvent[],
  colleagueBusy: readonly { start: number; end: number }[],
): { start: number; end: number } | null {
  for (let start = DAY_START; start < DAY_END - 30; start += 30) {
    const end = start + 30;
    const yourConflict = yourEvents.some(
      (e) =>
        !e.openSlot &&
        e.kind !== "deadline" &&
        start < e.endMinutes &&
        end > e.startMinutes,
    );
    if (yourConflict) continue;
    if (overlaps(colleagueBusy, start, end)) continue;
    return { start, end };
  }
  return null;
}

const EVENT_STYLE: Record<string, string> = {
  meeting:  "bg-primary/10 border-primary/20 text-foreground",
  focus:    "bg-fuego-50 border-fuego-200 text-fuego-800",
  deadline: "bg-destructive/10 border-destructive/20 text-destructive",
  break:    "bg-muted border-border text-muted-foreground",
};

function MeetingScheduler() {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<{ start: number; end: number } | null | "thinking">(null);

  const colleague = COLLEAGUES.find((c) => c.name === selected) ?? null;

  function handleFind() {
    if (!colleague) return;
    setResult("thinking");
    setTimeout(() => {
      setResult(findBestSlot(mockCalendar, colleague.busy));
    }, 800);
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-sm sm:p-10">
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-fuego-500" />
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Today&rsquo;s Calendar
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a colleague — the AI finds the best open 30-min window you both have.
          </p>
        </div>

        {/* Colleague picker */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Meet with:</span>
          <div className="flex gap-1.5">
            {COLLEAGUES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => { setSelected(c.name); setResult(null); }}
                aria-pressed={selected === c.name}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                  "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected === c.name
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:bg-secondary",
                )}
              >
                <Avatar size="sm" className="h-4 w-4">
                  <AvatarFallback className={cn("text-[9px]", c.color)}>
                    {c.initials}
                  </AvatarFallback>
                </Avatar>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-8 space-y-2">
        <TimelineRow
          label="You"
          initials="YO"
          avatarColor="bg-fuego-100 text-fuego-700"
          events={mockCalendar}
          highlight={result !== "thinking" ? result : null}
        />

        {colleague && (
          <TimelineRow
            label={colleague.name}
            initials={colleague.initials}
            avatarColor={colleague.color}
            busyBlocks={colleague.busy}
            highlight={result !== "thinking" ? result : null}
          />
        )}

        {/* Hour axis */}
        <div className="relative ml-[5.5rem] h-5">
          {HOUR_MARKERS.map((h) => (
            <span
              key={h}
              className="absolute -translate-x-1/2 select-none text-[10px] text-muted-foreground"
              style={{ left: `${toPercent(h * 60)}%` }}
            >
              {h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-3">
        {(["meeting", "focus", "break", "deadline"] as const).map((kind) => (
          <span key={kind} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("h-2.5 w-2.5 rounded-sm border", EVENT_STYLE[kind])} />
            {{ meeting: "Meeting", focus: "Open slot", break: "Break", deadline: "Deadline" }[kind]}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-sm border-2 border-fuego-500 bg-fuego-500/20" />
          Best time
        </span>
      </div>

      {/* CTA + result */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button
          onClick={handleFind}
          disabled={!selected || result === "thinking"}
          className="bg-thermal text-white shadow-sm transition-all hover:-translate-y-0.5 hover:brightness-105 disabled:pointer-events-none disabled:opacity-60"
        >
          <Sparkles className="h-4 w-4" />
          {result === "thinking" ? "Finding best time…" : "Find best time"}
        </Button>

        {!selected && (
          <span className="text-sm text-muted-foreground">Select a colleague to get started.</span>
        )}
        {selected && result === null && (
          <span className="text-sm text-muted-foreground">
            Click to find the first free 30-min window you both have.
          </span>
        )}
        {result && result !== "thinking" && (
          <div className="flex items-center gap-2.5 rounded-xl border border-fuego-200 bg-fuego-50 px-4 py-2.5">
            <Clock className="h-4 w-4 shrink-0 text-fuego-500" />
            <div>
              <p className="text-sm font-semibold text-fuego-900">
                {formatTime(result.start)} – {formatTime(result.end)}
              </p>
              <p className="text-xs text-fuego-700">
                First open window for you &amp; {selected}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -- Timeline row --------------------------------------------------------- */

function TimelineRow({
  label,
  initials,
  avatarColor,
  events,
  busyBlocks,
  highlight,
}: {
  label: string;
  initials: string;
  avatarColor: string;
  events?: CalendarEvent[];
  busyBlocks?: readonly { start: number; end: number }[];
  highlight: { start: number; end: number } | null;
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <div className="flex w-20 shrink-0 items-center gap-1.5">
        <Avatar size="sm">
          <AvatarFallback className={cn("text-[10px]", avatarColor)}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-xs font-medium">{label}</span>
      </div>

      {/* Track */}
      <div className="relative h-10 flex-1 overflow-hidden rounded-lg bg-secondary">
        {/* Hour grid lines */}
        {HOUR_MARKERS.map((h) => (
          <div
            key={h}
            className="absolute top-0 h-full w-px bg-border/70"
            style={{ left: `${toPercent(h * 60)}%` }}
          />
        ))}

        {/* Your events */}
        {events?.map((e) => {
          const w = widthPercent(e.startMinutes, e.endMinutes);
          if (w < 0.5) return null;
          return (
            <div
              key={e.id}
              title={`${e.title} · ${formatTime(e.startMinutes)}–${formatTime(e.endMinutes)}`}
              className={cn(
                "absolute top-1 bottom-1 overflow-hidden rounded border px-1",
                "flex items-center",
                EVENT_STYLE[e.kind],
              )}
              style={{
                left: `${toPercent(e.startMinutes)}%`,
                width: `${w}%`,
              }}
            >
              <span className="truncate text-[10px] font-medium leading-none">
                {e.title}
              </span>
            </div>
          );
        })}

        {/* Colleague busy blocks */}
        {busyBlocks?.map((b, i) => (
          <div
            key={i}
            className="absolute top-1 bottom-1 rounded border border-primary/20 bg-primary/10"
            style={{
              left: `${toPercent(b.start)}%`,
              width: `${widthPercent(b.start, b.end)}%`,
            }}
          />
        ))}

        {/* Highlight: best slot */}
        {highlight && (
          <div
            className="absolute top-0 bottom-0 rounded-lg border-2 border-fuego-500 bg-fuego-500/20 animate-pulse"
            style={{
              left: `${toPercent(highlight.start)}%`,
              width: `${widthPercent(highlight.start, highlight.end)}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page helpers                                                         */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </h2>
  );
}

function PromptGroup({ label, prompts }: { label: string; prompts: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </h3>
      <ul className="mt-3 divide-y divide-border border-y border-border">
        {prompts.map((prompt) => (
          <PromptRow key={prompt} text={prompt} />
        ))}
      </ul>
    </div>
  );
}

function PromptRow({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be blocked; fail quietly.
    }
  }

  return (
    <li>
      <button
        type="button"
        onClick={handleCopy}
        className="group flex w-full items-center justify-between gap-4 py-3.5 text-left"
        aria-label={`Copy prompt: ${text}`}
      >
        <span className="text-lg leading-relaxed text-foreground sm:text-xl">{text}</span>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1.5 text-xs font-medium transition-colors",
            copied ? "text-fuego-600" : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
    </li>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-secondary px-1 font-sans text-[11px] font-medium text-muted-foreground">
      {children}
    </kbd>
  );
}
