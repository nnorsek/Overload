import type { EquipmentType, ExerciseCategory, MuscleGroup } from "./Exercise";

type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

type WorkoutExercise = {
    workoutExerciseId: number;
    exerciseOrder: number;
    defaultSets: number;
    defaultReps: number;
    defaultWeight: number | null;
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

type WorkoutPayload = {
    name: string;
    description: string;
    difficultyLevel: DifficultyLevel;
    estimatedDuration: number;
};

export type { Workout, WorkoutExercise, WorkoutPayload, DifficultyLevel };
