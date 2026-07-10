/**
 * StudentDashboard — shows per-student progress across all class groups.
 *
 * Students are sorted by urgency (stuck first, done last). The teacher can
 * mark a student as checked-in, which moves them to the bottom and clears
 * the alert state until their status changes again.
 */

import { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, LayoutGrid, MessageSquare, Users } from "lucide-react";
import { classGroups, STATUS_META, type ClassGroup, type Student, type StudentStatus } from "@/data/mock-students";
import { cn } from "@/lib/utils";

/* ── helpers ──────────────────────────────────────────────────── */

function sortByUrgency(students: Student[]): Student[] {
  return [...students].sort((a, b) => {
    if (a.checkedIn && !b.checkedIn) return 1;
    if (!a.checkedIn && b.checkedIn) return -1;
    return STATUS_META[a.status].priority - STATUS_META[b.status].priority;
  });
}

function needsAttention(s: Student) {
  return (s.status === "stuck" || s.status === "check-in") && !s.checkedIn;
}

/* ── Component ──────────────────────────────────────────────────── */

export function StudentDashboard() {
  const [groups, setGroups] = useState<ClassGroup[]>(classGroups);
  const [activeGroup, setActiveGroup] = useState<string>(classGroups[0].id);
  const [view, setView] = useState<"grid" | "list">("grid");

  const currentGroup = groups.find((g) => g.id === activeGroup)!;
  const sorted = sortByUrgency(currentGroup.students);

  const totalNeedAttention = groups.reduce(
    (n, g) => n + g.students.filter(needsAttention).length,
    0,
  );

  function checkIn(groupId: string, studentId: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              students: g.students.map((s) =>
                s.id === studentId ? { ...s, checkedIn: true } : s,
              ),
            },
      ),
    );
  }

  function resetGroup(groupId: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : { ...g, students: g.students.map((s) => ({ ...s, checkedIn: false })) },
      ),
    );
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-sm sm:p-10">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-fuego-500" />
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Student Dashboard
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Track activity progress and know exactly when to check in.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {totalNeedAttention > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-fuego-200 bg-fuego-50 px-3 py-1 text-xs font-medium text-fuego-700">
              <AlertCircle className="h-3.5 w-3.5" />
              {totalNeedAttention} student{totalNeedAttention !== 1 ? "s" : ""} need attention
            </span>
          )}
          {totalNeedAttention === 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              All students checked in
            </span>
          )}
          {/* View toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              className={cn(
                "flex h-8 w-8 items-center justify-center transition-colors",
                view === "grid" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-secondary",
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              className={cn(
                "flex h-8 w-8 items-center justify-center transition-colors border-l border-border",
                view === "list" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-secondary",
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Class group tabs ── */}
      <div className="mt-6 flex flex-wrap gap-2">
        {groups.map((g) => {
          const groupNeedsAttention = g.students.filter(needsAttention).length;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGroup(g.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                activeGroup === g.id
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-background text-foreground hover:bg-secondary",
              )}
            >
              {g.grade}
              <span className={cn(
                "text-xs",
                activeGroup === g.id ? "text-primary-foreground/70" : "text-muted-foreground",
              )}>
                {g.period.split("–")[0].trim()}
              </span>
              {groupNeedsAttention > 0 && (
                <span className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
                  activeGroup === g.id
                    ? "bg-white text-primary"
                    : "bg-fuego-500 text-white",
                )}>
                  {groupNeedsAttention}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Summary bar ── */}
      <div className="mt-5 flex flex-wrap gap-4">
        {(["stuck", "check-in", "on-track", "done"] as StudentStatus[]).map((status) => {
          const count = currentGroup.students.filter((s) => s.status === status).length;
          const meta = STATUS_META[status];
          return (
            <div key={status} className="flex items-center gap-1.5 text-xs">
              <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
              <span className={cn("font-medium", meta.color)}>{meta.label}</span>
              <span className="text-muted-foreground">· {count}</span>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => resetGroup(currentGroup.id)}
          className="ml-auto text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Reset check-ins
        </button>
      </div>

      {/* ── Student cards ── */}
      <div className={cn(
        "mt-5",
        view === "grid"
          ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          : "flex flex-col gap-2",
      )}>
        {sorted.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            view={view}
            onCheckIn={() => checkIn(currentGroup.id, student.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Student card ───────────────────────────────────────────────── */

function StudentCard({
  student,
  view,
  onCheckIn,
}: {
  student: Student;
  view: "grid" | "list";
  onCheckIn: () => void;
}) {
  const meta = STATUS_META[student.status];
  const urgent = needsAttention(student);

  if (view === "list") {
    return (
      <div className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-all",
        student.checkedIn
          ? "border-border bg-background opacity-60"
          : urgent
            ? student.status === "stuck"
              ? "border-destructive/30 bg-destructive/5"
              : "border-fuego-200 bg-fuego-50/60"
            : "border-border bg-background",
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          student.checkedIn ? "bg-muted text-muted-foreground" :
          student.status === "stuck" ? "bg-destructive/10 text-destructive" :
          student.status === "check-in" ? "bg-fuego-100 text-fuego-700" :
          student.status === "done" ? "bg-emerald-100 text-emerald-700" :
          "bg-secondary text-foreground",
        )}>
          {student.initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{student.name}</span>
            <span className={cn("flex items-center gap-1 text-[11px] font-medium", meta.color)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
              {meta.label}
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">{student.lastActivity}</p>
        </div>

        {/* Progress */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-xs font-medium">{student.progress}%</span>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn("h-full rounded-full transition-all",
                  student.progress === 100 ? "bg-emerald-500" :
                  student.status === "stuck" ? "bg-destructive" :
                  "bg-fuego-500",
                )}
                style={{ width: `${student.progress}%` }}
              />
            </div>
          </div>
          {urgent && !student.checkedIn ? (
            <button
              type="button"
              onClick={onCheckIn}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                student.status === "stuck"
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : "bg-fuego-500 text-white hover:bg-fuego-600",
              )}
            >
              Check in
            </button>
          ) : student.checkedIn ? (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Done
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className={cn(
      "flex flex-col rounded-2xl border p-4 transition-all",
      student.checkedIn
        ? "border-border bg-background opacity-60"
        : urgent
          ? student.status === "stuck"
            ? "border-destructive/30 bg-destructive/5"
            : "border-fuego-200 bg-fuego-50/60"
          : "border-border bg-background",
    )}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
            student.checkedIn ? "bg-muted text-muted-foreground" :
            student.status === "stuck" ? "bg-destructive/10 text-destructive" :
            student.status === "check-in" ? "bg-fuego-100 text-fuego-700" :
            student.status === "done" ? "bg-emerald-100 text-emerald-700" :
            "bg-secondary text-foreground",
          )}>
            {student.initials}
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">{student.name}</p>
            <span className={cn("flex items-center gap-1 mt-0.5 text-[11px] font-medium", meta.color)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
              {meta.label}
            </span>
          </div>
        </div>
        <span className="text-sm font-bold tabular-nums">{student.progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            student.progress === 100 ? "bg-emerald-500" :
            student.status === "stuck" ? "bg-destructive" :
            "bg-fuego-500",
          )}
          style={{ width: `${student.progress}%` }}
        />
      </div>

      {/* Last activity */}
      <div className="mt-3 flex items-start gap-1.5">
        <Clock className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {student.lastActivity}
          <span className="ml-1 text-[10px] opacity-70">· {student.lastSeenMinutesAgo}m ago</span>
        </p>
      </div>

      {/* Optional teacher note */}
      {student.note && (
        <p className="mt-2 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-[11px] italic text-muted-foreground line-clamp-2">
          {student.note}
        </p>
      )}

      {/* CTA */}
      <div className="mt-3">
        {urgent && !student.checkedIn ? (
          <button
            type="button"
            onClick={onCheckIn}
            className={cn(
              "w-full rounded-xl py-2 text-xs font-semibold transition-all",
              student.status === "stuck"
                ? "bg-destructive text-white hover:bg-destructive/90"
                : "bg-fuego-500 text-white hover:bg-fuego-600",
            )}
          >
            Check in with {student.name.split(" ")[0]}
          </button>
        ) : student.checkedIn ? (
          <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Checked in
          </div>
        ) : (
          <div className="py-1.5 text-center text-xs text-muted-foreground">
            No action needed
          </div>
        )}
      </div>
    </div>
  );
}
