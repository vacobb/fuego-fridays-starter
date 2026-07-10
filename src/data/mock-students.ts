/**
 * Mock student progress data for the Student Dashboard.
 * Groups students by class period. Each student has a completion
 * percentage for today's activity and a status the teacher can use
 * to decide when to check in.
 */

export type StudentStatus = "on-track" | "check-in" | "stuck" | "done";

export interface Student {
  id: string;
  name: string;
  initials: string;
  /** 0–100 percent of today's activity completed */
  progress: number;
  status: StudentStatus;
  /** What they were last seen doing */
  lastActivity: string;
  /** Minutes since last activity update */
  lastSeenMinutesAgo: number;
  /** Optional note the teacher has added */
  note?: string;
  checkedIn?: boolean;
}

export interface ClassGroup {
  id: string;
  grade: string;
  period: string;
  students: Student[];
}

export const classGroups: ClassGroup[] = [
  {
    id: "group-k",
    grade: "Kindergarten",
    period: "8:00 – 8:45 AM",
    students: [
      {
        id: "k-1",
        name: "Sofia",
        initials: "SO",
        progress: 100,
        status: "done",
        lastActivity: "Finished color matching game",
        lastSeenMinutesAgo: 3,
      },
      {
        id: "k-2",
        name: "Liam",
        initials: "LI",
        progress: 75,
        status: "on-track",
        lastActivity: "Working on animal flashcards",
        lastSeenMinutesAgo: 1,
      },
      {
        id: "k-3",
        name: "Amara",
        initials: "AM",
        progress: 40,
        status: "check-in",
        lastActivity: "Paused on vocabulary intro",
        lastSeenMinutesAgo: 8,
      },
      {
        id: "k-4",
        name: "Caleb",
        initials: "CA",
        progress: 20,
        status: "stuck",
        lastActivity: "Has not moved past warm-up",
        lastSeenMinutesAgo: 14,
      },
      {
        id: "k-5",
        name: "Mia",
        initials: "MI",
        progress: 90,
        status: "on-track",
        lastActivity: "Almost done with wrap-up check",
        lastSeenMinutesAgo: 2,
      },
    ],
  },
  {
    id: "group-1",
    grade: "1st Grade",
    period: "9:15 – 10:00 AM",
    students: [
      {
        id: "1-1",
        name: "Priya",
        initials: "PR",
        progress: 85,
        status: "on-track",
        lastActivity: "Color matching — almost done",
        lastSeenMinutesAgo: 2,
      },
      {
        id: "1-2",
        name: "Jackson",
        initials: "JA",
        progress: 60,
        status: "on-track",
        lastActivity: "Flashcard round in progress",
        lastSeenMinutesAgo: 4,
      },
      {
        id: "1-3",
        name: "Yuki",
        initials: "YU",
        progress: 30,
        status: "check-in",
        lastActivity: "Stopped at animal vocabulary",
        lastSeenMinutesAgo: 11,
        note: "Struggled with 'el conejo' last session",
      },
      {
        id: "1-4",
        name: "Ethan",
        initials: "ET",
        progress: 100,
        status: "done",
        lastActivity: "Completed all activities",
        lastSeenMinutesAgo: 1,
      },
      {
        id: "1-5",
        name: "Luna",
        initials: "LU",
        progress: 10,
        status: "stuck",
        lastActivity: "No activity recorded after warm-up",
        lastSeenMinutesAgo: 20,
        note: "Was absent last Tuesday — may need extra support",
      },
    ],
  },
  {
    id: "group-2",
    grade: "2nd Grade",
    period: "10:15 – 11:00 AM",
    students: [
      {
        id: "2-1",
        name: "Noah",
        initials: "NO",
        progress: 95,
        status: "done",
        lastActivity: "Wrap-up complete",
        lastSeenMinutesAgo: 2,
      },
      {
        id: "2-2",
        name: "Isla",
        initials: "IS",
        progress: 70,
        status: "on-track",
        lastActivity: "Working through color game",
        lastSeenMinutesAgo: 3,
      },
      {
        id: "2-3",
        name: "Marcus",
        initials: "MA",
        progress: 50,
        status: "check-in",
        lastActivity: "Paused mid-activity",
        lastSeenMinutesAgo: 9,
      },
      {
        id: "2-4",
        name: "Zara",
        initials: "ZA",
        progress: 15,
        status: "stuck",
        lastActivity: "Stuck on morado / anaranjado",
        lastSeenMinutesAgo: 18,
        note: "Color words are consistently hard for her",
      },
      {
        id: "2-5",
        name: "Oliver",
        initials: "OL",
        progress: 80,
        status: "on-track",
        lastActivity: "Flashcards done, starting game",
        lastSeenMinutesAgo: 1,
      },
    ],
  },
];

export const STATUS_META: Record<
  StudentStatus,
  { label: string; color: string; dot: string; priority: number }
> = {
  stuck:      { label: "Stuck",       color: "text-destructive",   dot: "bg-destructive",   priority: 0 },
  "check-in": { label: "Check in",    color: "text-fuego-600",     dot: "bg-fuego-500",     priority: 1 },
  "on-track": { label: "On track",    color: "text-muted-foreground", dot: "bg-emerald-400", priority: 2 },
  done:       { label: "Done",        color: "text-emerald-600",   dot: "bg-emerald-500",   priority: 3 },
};
