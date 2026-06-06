import type { MuscleGroup, Category, EquipmentType } from "../types/Exercise";

const MUSCLE_GROUP_OPTIONS: { label: string; value: MuscleGroup }[] = [
    { label: "Chest", value: "CHEST" },
    { label: "Shoulders", value: "SHOULDERS" },
    { label: "Back", value: "BACK" },
    { label: "Biceps", value: "BICEPS" },
    { label: "Triceps", value: "TRICEPS" },
    { label: "Legs", value: "LEGS" },
    { label: "Core", value: "CORE" },
]

const CATEGORY_OPTIONS: { label: string; value: Category }[] = [
    { label: "Strength", value: "STRENGTH" },
    { label: "Cardio", value: "CARDIO" },
    { label: "Flexibility", value: "FLEXIBILITY" },
    { label: "Balance", value: "BALANCE" },
    { label: "Power", value: "POWER" },
    { label: "Endurance", value: "ENDURANCE" },
    { label: "Mobility", value: "MOBILITY" },
    { label: "Core", value: "CORE" },
]
const EQUIPMENT_OPTIONS: { label: string, value: EquipmentType} = [
    { label: "Barbell", value: "BARBELL" },
    { label: "Dumbbell", value: "DUMBBELL" },
    { label: "Kettlebell", value: "KETTLEBELL" },
    { label: "Cable", value: "CABLE" },
    { label: "Body Weight", value: "BODY_WEIGHT" },
    { label: "Machine", value: "MACHINE" },
    { label: "Resistance Band", value: "RESISTANCE_BAND" }
]
export { MUSCLE_GROUP_OPTIONS, CATEGORY_OPTIONS, EQUIPMENT_OPTIONS }
