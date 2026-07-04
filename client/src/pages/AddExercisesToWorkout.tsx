import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import { useExerciseHooks } from "../hooks/ExerciseHooks";
import type { Workout } from "../types/Workout";
import type {
  EquipmentType,
  Exercise,
  ExerciseCategory,
  MuscleGroup,
} from "../types/Exercise";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Check, ChevronLeft, GripVertical } from "lucide-react";
import { MUSCLE_GROUP_OPTIONS } from "../constants/ExerciseOptions";
import { useWorkoutHooks } from "@/hooks/WorkoutHooks";
import type { WorkoutExercisePayload } from "@/hooks/WorkoutHooks";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Label } from "@/components/ui/label";

type LocalExercise = {
  exerciseId: number;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  equipmentType: EquipmentType;
  category: ExerciseCategory;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number | null;
};

type SortableCardProps = {
  ex: LocalExercise;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    field: "defaultSets" | "defaultReps" | "defaultWeight",
    value: string
  ) => void;
};

function SortableExerciseCard({
  ex,
  index,
  onRemove,
  onUpdate,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ex.exerciseId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="shrink-0 p-0 mr-2">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing pt-1 shrink-0 touch-none"
            tabIndex={-1}
          >
            <GripVertical className="w-5 h-5" />
          </button>
          <span className="text-muted-foreground text-sm font-mono w-5 pt-1 shrink-0 select-none">
            {index + 1}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {ex.exerciseName}
                </p>
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-xs border-blue-500 bg-accent uppercase px-1.5"
                  >
                    {ex.muscleGroup}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs px-1.5 bg-accent uppercase border-green-400"
                  >
                    {ex.category}
                  </Badge>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Sets
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={ex.defaultSets ?? ""}
                  onChange={(e) =>
                    onUpdate(index, "defaultSets", e.target.value)
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Reps
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={ex.defaultReps ?? ""}
                  onChange={(e) =>
                    onUpdate(index, "defaultReps", e.target.value)
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Weight (lbs)
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={ex.defaultWeight ?? ""}
                  placeholder="Optional"
                  onChange={(e) =>
                    onUpdate(index, "defaultWeight", e.target.value)
                  }
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const AddExercisesToWorkout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exercises, loading: exercisesLoading } = useExerciseHooks();
  const { handleGetWorkoutById, handleSaveWorkoutExercises, submitting } =
    useWorkoutHooks();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<LocalExercise[]>([]);
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("ALL");
  const [saveError, setSaveError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    if (!id) return;
    handleGetWorkoutById(id).then((w) => {
      if (!w) return;
      setWorkout(w);
      setWorkoutExercises(
        [...w.exercises]
          .sort((a, b) => a.exerciseOrder - b.exerciseOrder)
          .map((ex) => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            muscleGroup: ex.muscleGroup,
            equipmentType: ex.equipmentType,
            category: ex.category,
            defaultSets: ex.defaultSets,
            defaultReps: ex.defaultReps,
            defaultWeight: ex.defaultWeight,
          }))
      );
    });
  }, [id]);

  const addedIds = new Set(workoutExercises.map((e) => e.exerciseId));

  const visibleExercises = exercises
    .filter((e) => muscleFilter === "ALL" || e.muscleGroup === muscleFilter)
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase().trim()));

  const addExercise = (exercise: Exercise) => {
    if (addedIds.has(exercise.exerciseId)) return;
    setWorkoutExercises((prev) => [
      ...prev,
      {
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.name,
        muscleGroup: exercise.muscleGroup,
        equipmentType: exercise.equipmentType,
        category: exercise.category,
        defaultSets: 3,
        defaultReps: 10,
        defaultWeight: null,
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setWorkoutExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const updateField = (
    index: number,
    field: "defaultSets" | "defaultReps" | "defaultWeight",
    value: string
  ) => {
    setWorkoutExercises((prev) =>
      prev.map((ex, i) =>
        i === index
          ? { ...ex, [field]: value === "" ? null : Number(value) }
          : ex
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setWorkoutExercises((prev) => {
      const oldIndex = prev.findIndex((e) => e.exerciseId === active.id);
      const newIndex = prev.findIndex((e) => e.exerciseId === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSave = async () => {
    if (!id) return;
    setSaveError(null);
    const payload: WorkoutExercisePayload[] = workoutExercises.map((ex, i) => ({
      exerciseId: ex.exerciseId,
      exerciseOrder: i + 1,
      defaultSets: ex.defaultSets,
      defaultReps: ex.defaultReps,
      defaultWeight: ex.defaultWeight,
    }));
    const result = await handleSaveWorkoutExercises(id, payload);
    if (result.error) {
      setSaveError(result.error);
    } else {
      navigate("/workouts");
    }
  };

  return (
    <Wrapper>
      <Button size="sm" className="mb-6" onClick={() => navigate("/workouts")}>
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Workouts
      </Button>

      <div className="mb-6 ml-2">
        <h1 className="text-3xl font-bold">{workout?.name ?? "Loading..."}</h1>
        <p className="text-muted-foreground mt-1">
          Add and organize exercises for this workout
        </p>
      </div>

      <div className="flex gap-6 h-[calc(100svh-220px)] overflow-hidden">
        {/* Left panel — exercise library */}
        <div className="w-2/5 flex flex-col gap-3 min-h-0">
          <h2 className="text-base font-semibold shrink-0 mt-3 ml-2">
            Exercise Library
          </h2>

          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shrink-0 mt-2"
          />

          <div className="flex flex-wrap gap-2 shrink-0 ml-2">
            <Badge
              variant="outline"
              onClick={() => setMuscleFilter("ALL")}
              className={`px-3 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
                muscleFilter === "ALL"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-border hover:border-blue-500"
              }`}
            >
              All
            </Badge>
            {MUSCLE_GROUP_OPTIONS.map((opt) => (
              <Badge
                variant="outline"
                key={opt.value}
                onClick={() => setMuscleFilter(opt.value)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
                  muscleFilter === opt.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-border hover:border-blue-500"
                }`}
              >
                {opt.label}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pr-1">
            {exercisesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 mr-2" />
              ))
            ) : (
              <>
                {visibleExercises.map((exercise) => {
                  const isAdded = addedIds.has(exercise.exerciseId);
                  return (
                    <Card
                      key={exercise.exerciseId}
                      onClick={() => addExercise(exercise)}
                      className={`transition-colors justify-center py-10 mr-2 border ${
                        isAdded
                          ? "opacity-70 cursor-default"
                          : "hover:border-blue-500 cursor-pointer"
                      }`}
                    >
                      <CardContent className="p-3 flex items-center justify-between gap-2">
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="font-medium text-sm truncate">
                            {exercise.name}
                          </span>
                          <div className="flex gap-1.5 flex-wrap">
                            <Badge
                              variant="outline"
                              className="text-xs border-blue-500 bg-accent py-0 px-1.5"
                            >
                              {exercise.muscleGroup}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs py-0 px-1.5 bg-accent border-green-400"
                            >
                              {exercise.equipmentType}
                            </Badge>
                          </div>
                        </div>
                        {isAdded ? (
                          <Check className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                {visibleExercises.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center pt-8">
                    No exercises found
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <Separator orientation="vertical" className="shrink-0" />

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between shrink-0 mb-2">
            <h2 className="text-base font-semibold">
              Exercises{" "}
              <span className="text-muted-foreground font-normal text-sm">
                ({workoutExercises.length})
              </span>
            </h2>
            <div className="flex items-center gap-3">
              {saveError && (
                <p className="text-sm text-destructive">{saveError}</p>
              )}
              <Button
                onClick={handleSave}
                disabled={submitting || workoutExercises.length === 0}
              >
                {submitting && <Spinner className="mr-1.5" />}
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {workoutExercises.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-lg gap-2">
              <Plus className="w-8 h-8 opacity-30" />
              <p className="text-sm">Click an exercise on the left to add it</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={workoutExercises.map((e) => e.exerciseId)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1 min-h-0 mt-2">
                  {workoutExercises.map((ex, index) => (
                    <SortableExerciseCard
                      key={ex.exerciseId}
                      ex={ex}
                      index={index}
                      onRemove={removeExercise}
                      onUpdate={updateField}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default AddExercisesToWorkout;
