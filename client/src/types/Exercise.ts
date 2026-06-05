type Exercise = {
    exerciseId: number,
    name: string,
    equipmentType: string,
    muscleGroup: MuscleGroup,
    description: string,
    category: Category,
    trainerId: number | null,
    originalExerciseId: number | null,
}
type CreateExercisePayload = {
    name: string,
    description: string,
    category: Category,
    equipmentType: string,
    muscleGroup: MuscleGroup
}

type Category =  "STRENGTH" | "CARDIO" | "FLEXIBILITY" | "BALANCE" | "POWER" | "ENDURANCE" | "MOBILITY" | "CORE"
type MuscleGroup = "CHEST" | "BACK" | "BICEPS" | "LEGS" | "SHOULDERS" | "TRICEPS" | "CORE"

export {
    Exercise,
    Category,
    MuscleGroup,
    CreateExercisePayload
}