type Exercise = {
  exerciseId: number;
  name: string;
  equipmentType: EquipmentType;
  muscleGroup: MuscleGroup;
  description: string;
  category: ExerciseCategory;
  trainerId: number | null;
  originalExerciseId: number | null;
};
type CreateExercisePayload = {
  name: string;
  description: string;
  category: ExerciseCategory;
  equipmentType: string;
  muscleGroup: MuscleGroup;
};

type EquipmentType =
  | "BARBELL"
  | "DUMBBELL"
  | "KETTLEBELL"
  | "CABLE"
  | "BODY_WEIGHT"
  | "MACHINE"
  | "RESISTANCE_BAND";
type ExerciseCategory =
  | "STRENGTH"
  | "CARDIO"
  | "FLEXIBILITY"
  | "BALANCE"
  | "POWER"
  | "ENDURANCE"
  | "MOBILITY"
  | "CORE";
type MuscleGroup =
  | "CHEST"
  | "BACK"
  | "BICEPS"
  | "LEGS"
  | "SHOULDERS"
  | "TRICEPS"
  | "CORE";

export type {
  Exercise,
  ExerciseCategory,
  MuscleGroup,
  CreateExercisePayload,
  EquipmentType,
};
