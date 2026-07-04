import { useNavigate } from "react-router-dom";
import CreateFormPage from "../components/CreateFormPage";
import type { CreateWorkoutPayload, DifficultyLevel } from "@/types/Workout";
import { useWorkoutHooks } from "@/hooks/WorkoutHooks";
import { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIFFICULTY_LEVEL_OPTIONS } from "../constants/WorkoutOptions";

const defaultForm: CreateWorkoutPayload = {
  name: "",
  description: "",
  difficultyLevel: "" as DifficultyLevel,
  estimatedDuration: null,
};

export default function CreateWorkout() {
  const navigate = useNavigate();
  const { handleCreateWorkout, submitting } = useWorkoutHooks();
  const [form, setForm] = useState<CreateWorkoutPayload>(defaultForm);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (field: keyof CreateWorkoutPayload) => (val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const result = await handleCreateWorkout(form);
    if (result.workoutId) navigate(`/workouts/${result.workoutId}/exercises`);
    else if (result.error) setSubmitError(result.error);
  };

  const blankFields =
    form.name === "" ||
    form.description === "" ||
    form.difficultyLevel === null ||
    form.estimatedDuration === null;

  return (
    <CreateFormPage
      title="Workouts"
      description="Manage and build reusable programs"
      backLabel="Back to Workouts"
      onBack={() => navigate("/workouts")}
      onSubmit={handleSubmit}
      submitLabel="Next step"
      disabled={blankFields}
      submitting={submitting}
      error={submitError}
    >
      <div className="flex flex-col gap-y-4">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => set("name")(e.target.value)}
          placeholder="e.g. Back Day"
        />
        <div className="flex flex-col gap-4 mt-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
            placeholder="Describe the workout, plan, and any important notes..."
          />
        </div>
        <div className="flex flex-col gap-4 mt-2">
          <Label htmlFor="description">Difficulty Level</Label>
          <Select
            value={form.difficultyLevel}
            onValueChange={set("difficultyLevel")}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent position={"popper"}>
              <SelectGroup>
                {DIFFICULTY_LEVEL_OPTIONS.map((opt: any) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-4 mt-2">
          <Label htmlFor="estimatedDuration">Estimated Duration (min)</Label>
          <Input
            type="number"
            min={1}
            max={60 * 24}
            id="estimatedDuration"
            value={
              form.estimatedDuration === null ? "" : form.estimatedDuration
            }
            onChange={(e) => set("estimatedDuration")(e.target.value)}
            placeholder="60 (min)"
          />
        </div>
      </div>
    </CreateFormPage>
  );
}
