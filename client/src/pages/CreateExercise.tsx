import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateExercisePayload, Category, MuscleGroup, EquipmentType } from "../types/Exercise";
import { useExerciseHooks } from "../hooks/ExerciseHooks";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "../components/ui/select";
import { MUSCLE_GROUP_OPTIONS, CATEGORY_OPTIONS, EQUIPMENT_OPTIONS } from "../constants/exerciseOptions";
import CreateFormPage from "../components/CreateFormPage";

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
        <CreateFormPage
            title="Create Exercise"
            description="Add a new exercise to your library with all the details your clients need"
            backLabel="Back to Exercises"
            onBack={() => navigate("/exercises")}
            onSubmit={handleSubmit}
            submitLabel="Create Exercise"
            disabled={blankFields}
        >
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
        </CreateFormPage>
    )
}

export default CreateExercise;
