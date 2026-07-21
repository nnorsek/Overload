import type { EquipmentType, ExerciseCategory, MuscleGroup } from "./Exercise";

type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

type WorkoutExerciseSet = {
  setId: number;
  setOrder: number;
  defaultReps: number;
  defaultWeight: number | null;
}

type WorkoutExercise = {
  workoutExerciseId: number;
  exerciseOrder: number;
  sets: WorkoutExerciseSet[];
  exerciseId: number;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  equipmentType: EquipmentType;
  category: ExerciseCategory;
};

type Workout = {
  workoutId: number;
  trainerId: number;
  name: string;
  description: string;
  difficultyLevel: DifficultyLevel;
  estimatedDuration: number;
  exercises: WorkoutExercise[];
  createdAt: string;
  updatedAt: string;
};

type CreateWorkoutPayload = {
  name: string;
  description: string;
  difficultyLevel: DifficultyLevel;
  estimatedDuration: number | null;
};

export type { Workout, WorkoutExercise, CreateWorkoutPayload, DifficultyLevel, WorkoutExerciseSet };
