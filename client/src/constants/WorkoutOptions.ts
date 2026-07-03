import type { DifficultyLevel } from "@/types/Workout";

const DIFFICULTY_LEVEL_OPTIONS: { label: string; value: DifficultyLevel }[] = [
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
  { label: "Expert", value: "EXPERT" },
];

export { DIFFICULTY_LEVEL_OPTIONS };
