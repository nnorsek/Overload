import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateExercisePayload, Category, MuscleGroup, EquipmentType } from "../types/Exercise";
import { useExerciseHooks } from "../hooks/ExerciseHooks";
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "../components/ui/select";
import { MUSCLE_GROUP_OPTIONS, CATEGORY_OPTIONS, EQUIPMENT_OPTIONS } from "../constants/exerciseOptions";
import { ArrowLeft } from "lucide-react";

const defaultForm: CreateExercisePayload = {
    name: "",
    description: "",
    category: "" as Category,
    equipmentType: "" as EquipmentType,
    muscleGroup: "" as MuscleGroup,
}

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{label}</label>
        {children}
    </div>
)

const CreateExercise = () => {
    const navigate = useNavigate();
    const { handleCreateExercise } = useExerciseHooks();
    const [form, setForm] = useState<CreateExercisePayload>(defaultForm);

    const set = (field: keyof CreateExercisePayload) => (val: string) =>
        setForm(prev => ({ ...prev, [field]: val }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleCreateExercise(form);
        navigate("/exercises");
    }

    return (
        <div className="min-h-screen p-8">
            <button
                onClick={() => navigate("/exercises")}
                className="flex items-center gap-2 text-sm hover:text-blue-500 cursor-pointer mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Exercises
            </button>

            <div className="max-w-xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">Create Exercise</h1>
                    <p className="text-muted-foreground mt-2">Add a new exercise to your library with all the details your clients need</p>
                </div>

                <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <FormField label="Name">
                            <input
                                value={form.name}
                                onChange={(e) => set("name")(e.target.value)}
                                placeholder="e.g. Barbell Back Squat"
                                className="border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none rounded-lg px-3 py-2 text-sm transition-all"
                            />
                        </FormField>

                        <FormField label="Muscle Group">
                            <Select value={form.muscleGroup} onValueChange={set("muscleGroup")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a muscle group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {MUSCLE_GROUP_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Equipment">
                            <Select value={form.equipmentType} onValueChange={set("equipmentType")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select equipment" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {EQUIPMENT_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Category">
                            <Select value={form.category} onValueChange={set("category")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {CATEGORY_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Description">
                            <textarea
                                value={form.description}
                                onChange={(e) => set("description")(e.target.value)}
                                placeholder="Describe the exercise, cues, and any important notes..."
                                rows={4}
                                className="border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none rounded-lg px-3 py-2 text-sm transition-all resize-none"
                            />
                        </FormField>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => navigate("/exercises")}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                                Create Exercise
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateExercise;
