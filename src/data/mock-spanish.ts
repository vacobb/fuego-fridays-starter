/**
 * Mock data for a Spanish-teaching context.
 * Powers three humorphic patterns:
 *   - "Just Need Your Input"  → lessonPlan (uncertain blocks need teacher confirmation)
 *   - "Got a Sec?"            → classSchedule (open gaps between activities)
 *   - "Where Were We?"        → vocabGaps (words kids struggled with last session)
 */

/* ------------------------------------------------------------------ */
/* "Just Need Your Input" — Lesson Plan                                */
/* ------------------------------------------------------------------ */

export type LessonBlockType = "heading" | "activity" | "note" | "callout";

export interface LessonBlock {
  id: string;
  type: LessonBlockType;
  text: string;
  /**
   * When true the AI drafted this block and isn't confident — render it
   * with the shimmer treatment until the teacher confirms or edits it.
   */
  uncertain?: boolean;
  /** Optional edit the teacher typed in to replace uncertain text. */
  confirmed?: string;
}

export const lessonPlan: LessonBlock[] = [
  {
    id: "lp-1",
    type: "heading",
    text: "Today's Plan — Colors & Animals (Grades K–2)",
  },
  {
    id: "lp-2",
    type: "activity",
    text: "Warm-up (5 min): Greet students in Spanish and review the days of the week song.",
  },
  {
    id: "lp-3",
    type: "activity",
    text: "Vocabulary intro (10 min): Introduce 6 animal words using flashcards — el perro, el gato, el pájaro, el pez, el conejo, la tortuga.",
    uncertain: true,
  },
  {
    id: "lp-4",
    type: "note",
    text: "Use the big illustrated cards, not the laminated ones — kids respond better to the larger images.",
  },
  {
    id: "lp-5",
    type: "activity",
    text: "Color matching game (15 min): Students match color cards to animal pictures and say the phrase aloud, e.g. \"El perro es café.\"",
    uncertain: true,
  },
  {
    id: "lp-6",
    type: "callout",
    text: "Suggested extension: If the group finishes early, try the animal sound round — kids make the sound while saying the Spanish word.",
    uncertain: true,
  },
  {
    id: "lp-7",
    type: "activity",
    text: "Wrap-up (5 min): Quick thumbs-up / thumbs-down vocab check. Ask each student one word.",
  },
];

/* ------------------------------------------------------------------ */
/* "Got a Sec?" — Class Schedule                                       */
/* ------------------------------------------------------------------ */

export type ClassPeriodKind = "class" | "break" | "prep" | "open";

export interface ClassPeriod {
  id: string;
  title: string;
  kind: ClassPeriodKind;
  /** Minutes from start of school day (8 AM = 0). */
  startMinutes: number;
  endMinutes: number;
  /** Grade or group label. */
  group?: string;
  /** True when this slot is genuinely free — the AI can suggest filling it. */
  openSlot?: boolean;
  /** Suggestion the AI pre-loaded for this gap. */
  suggestion?: string;
}

const s = (h: number, m = 0) => (h - 8) * 60 + m; // offset from 8 AM

export const classSchedule: ClassPeriod[] = [
  {
    id: "cls-1",
    title: "Kindergarten Spanish",
    kind: "class",
    startMinutes: s(8, 0),
    endMinutes: s(8, 45),
    group: "K",
  },
  {
    id: "cls-2",
    title: "Open — no class",
    kind: "open",
    startMinutes: s(8, 45),
    endMinutes: s(9, 15),
    openSlot: true,
    suggestion: "Sofia finished early today — want me to generate a bonus \"animal sounds\" worksheet she can work on independently?",
  },
  {
    id: "cls-3",
    title: "1st Grade Spanish",
    kind: "class",
    startMinutes: s(9, 15),
    endMinutes: s(10, 0),
    group: "1st",
  },
  {
    id: "cls-4",
    title: "Morning break",
    kind: "break",
    startMinutes: s(10, 0),
    endMinutes: s(10, 15),
  },
  {
    id: "cls-5",
    title: "2nd Grade Spanish",
    kind: "class",
    startMinutes: s(10, 15),
    endMinutes: s(11, 0),
    group: "2nd",
  },
  {
    id: "cls-6",
    title: "Prep / planning",
    kind: "prep",
    startMinutes: s(11, 0),
    endMinutes: s(11, 45),
  },
  {
    id: "cls-7",
    title: "Open — between groups",
    kind: "open",
    startMinutes: s(11, 45),
    endMinutes: s(12, 15),
    openSlot: true,
    suggestion: "You have 30 minutes before lunch. Want me to draft tomorrow's vocab list for 1st grade based on today's stumbles?",
  },
  {
    id: "cls-8",
    title: "Lunch",
    kind: "break",
    startMinutes: s(12, 15),
    endMinutes: s(13, 0),
  },
  {
    id: "cls-9",
    title: "3rd Grade Spanish",
    kind: "class",
    startMinutes: s(13, 0),
    endMinutes: s(13, 45),
    group: "3rd",
  },
  {
    id: "cls-10",
    title: "Open — end of day",
    kind: "open",
    startMinutes: s(13, 45),
    endMinutes: s(14, 15),
    openSlot: true,
    suggestion: "Last class is done. Want a quick summary of which students struggled most today so you can follow up tomorrow?",
  },
];

/** Format minutes-from-8AM as a readable time label. */
export function formatClassTime(minutes: number): string {
  const totalMinutes = 8 * 60 + minutes;
  const h24 = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

/* ------------------------------------------------------------------ */
/* "Where Were We?" — Vocabulary Gaps                                  */
/* ------------------------------------------------------------------ */

export type ProficiencyLevel = "emerging" | "developing" | "secure";

export interface VocabWord {
  id: string;
  spanish: string;
  english: string;
  /** Emoji to make the card visually scannable for young learners. */
  emoji: string;
  /** How many kids in the class got this wrong last session. */
  missedBy: number;
  totalStudents: number;
  /** Which grade/group this came from. */
  group: string;
  /** Example sentence the AI suggests for re-teaching. */
  exampleSentence: string;
  /** Whether it's been queued into today's plan. */
  addedToToday?: boolean;
}

export const vocabGaps: VocabWord[] = [
  {
    id: "vg-1",
    spanish: "el conejo",
    english: "rabbit",
    emoji: "🐰",
    missedBy: 8,
    totalStudents: 12,
    group: "1st Grade",
    exampleSentence: "El conejo es blanco y pequeño.",
  },
  {
    id: "vg-2",
    spanish: "la tortuga",
    english: "turtle",
    emoji: "🐢",
    missedBy: 7,
    totalStudents: 12,
    group: "1st Grade",
    exampleSentence: "La tortuga camina muy despacio.",
  },
  {
    id: "vg-3",
    spanish: "anaranjado",
    english: "orange (color)",
    emoji: "🟠",
    missedBy: 6,
    totalStudents: 10,
    group: "Kindergarten",
    exampleSentence: "La naranja es anaranjada.",
  },
  {
    id: "vg-4",
    spanish: "el pájaro",
    english: "bird",
    emoji: "🐦",
    missedBy: 5,
    totalStudents: 14,
    group: "2nd Grade",
    exampleSentence: "El pájaro canta en el árbol.",
  },
  {
    id: "vg-5",
    spanish: "morado",
    english: "purple",
    emoji: "🟣",
    missedBy: 9,
    totalStudents: 14,
    group: "2nd Grade",
    exampleSentence: "Las uvas son moradas.",
  },
  {
    id: "vg-6",
    spanish: "el pez",
    english: "fish",
    emoji: "🐟",
    missedBy: 4,
    totalStudents: 10,
    group: "Kindergarten",
    exampleSentence: "El pez nada en el agua.",
  },
];
