import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateExercisePayload, Category, MuscleGroup, EquipmentType } from "../types/Exercise";
import { useExerciseHooks } from "../hooks/ExerciseHooks";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
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

    const blankFields = form.name === "" || form.category === "" || form.description === "" || form.muscleGroup === "" || form.equipmentType === "";

    return (
        <div className="min-h-screen p-8">
            <Button
                onClick={() => navigate("/exercises")}
                className="mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Exercises
            </Button>

            <div className="max-w-xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">Create Exercise</h1>
                    <p className="text-muted-foreground mt-2">Add a new exercise to your library with all the details your clients need</p>
                </div>

                <div className="bg-form border border-border rounded-2xl shadow p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => set("name")(e.target.value)}
                                placeholder="e.g. Barbell Back Squat"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="muscleGroup">Muscle Group</Label>
                            <Select value={form.muscleGroup} onValueChange={set("muscleGroup")}>
                                <SelectTrigger id="muscleGroup" className="w-full">
                                    <SelectValue placeholder="Select a muscle group" />
                                </SelectTrigger>
                                <SelectContent position={"popper"}>
                                    <SelectGroup>
                                        {MUSCLE_GROUP_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="equipment">Equipment</Label>
                            <Select value={form.equipmentType} onValueChange={set("equipmentType")}>
                                <SelectTrigger id="equipment" className="w-full">
                                    <SelectValue placeholder="Select equipment" />
                                </SelectTrigger>
                                <SelectContent position={"popper"}>
                                    <SelectGroup>
                                        {EQUIPMENT_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="category">Category</Label>
                            <Select value={form.category} onValueChange={set("category")}>
                                <SelectTrigger id="category" className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent position={"popper"}>
                                    <SelectGroup>
                                        {CATEGORY_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={form.description}
                                onChange={(e) => set("description")(e.target.value)}
                                placeholder="Describe the exercise, cues, and any important notes..."
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => navigate("/exercises")}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={blankFields} className="bg-blue-500 hover:bg-blue-600 text-white">
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
