import Wrapper from "../components/Wrapper";
import { useWorkoutHooks } from "../hooks/WorkoutHooks";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Workout, DifficultyLevel } from "@/types/Workout";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DIFFICULTY_LEVEL_OPTIONS } from "../constants/WorkoutOptions";
import { Textarea } from "@/components/ui/textarea";

const Workouts = () => {
  const [search, setSearch] = useState<string>("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [openEditWorkout, setOpenEditWorkout] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [editWorkout, setEditWorkout] = useState<Workout | null>(null);
  const {
    loading,
    submitting,
    workouts,
    handleDeleteWorkout,
    handleEditWorkout,
  } = useWorkoutHooks();
  const originalWorkout = useRef<Workout | null>(null);

  const visableWorkouts = workouts.filter((w) =>
    w.name.toLowerCase().includes(search?.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    setDeleteError(null);
    const result = await handleDeleteWorkout(id);
    if (result.error) setDeleteError(result.error);
  };

  const handleOpenEditWorkout = (id: number) => {
    const found = workouts.find((workout) => workout.workoutId === id) ?? null;
    setEditWorkout(found);
    setEditError(null);
    setOpenEditWorkout(true);
    originalWorkout.current = found;
  };

  const handleSaveEdit = async (id: number) => {
    if (!editWorkout) return;
    setEditError(null);
    const result = await handleEditWorkout(id, {
      name: editWorkout.name,
      description: editWorkout.description,
      difficultyLevel: editWorkout.difficultyLevel,
      estimatedDuration: editWorkout.estimatedDuration,
    });
    if (result.error) {
      setEditError(result.error);
    } else {
      setOpenEditWorkout(false);
    }
  };

  const editIsUnchanged =
    originalWorkout.current?.name === editWorkout?.name &&
    originalWorkout.current?.difficultyLevel === editWorkout?.difficultyLevel &&
    originalWorkout.current?.estimatedDuration ===
      editWorkout?.estimatedDuration &&
    originalWorkout.current?.description === editWorkout?.description;

  return (
    <Wrapper>
      <div className="flex flex-col ml-3">
        <h1 className="text-3xl font-bold py-5">Workouts</h1>
        <p className="text-lg">Manage and build reusable programs</p>
      </div>
      <div className="flex mt-6 w-1/2 gap-x-4">
        <Input
          type="text"
          className="py-5"
          placeholder="Search workout..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button size="lg" onClick={() => navigate("/workouts/create")}>
          Create Workout
        </Button>
      </div>
      {deleteError && (
        <p className="text-sm text-destructive mt-4">{deleteError}</p>
      )}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-52" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {visableWorkouts.map((workout) => (
            <Card
              key={workout.workoutId}
              className="border hover:border-blue-500 transition-colors duration-200 flex flex-col gap-2"
            >
              <CardHeader className="gap-0.5">
                <div className="flex justify-between">
                  <CardTitle>{workout.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hover:cursor-pointer hover:bg-slate-200 mb-2"
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-38"
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/workouts/${workout.workoutId}/exercises`)
                        }
                      >
                        Add Exercises
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenEditWorkout(workout.workoutId)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(workout.workoutId)}
                        variant="destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge
                  variant="outline"
                  className="hover:bg-slate-200 border-blue-500"
                >
                  {workout.difficultyLevel}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 flex-1 mt-2">
                {workout.exercises.slice(0, 5).map((ex) => (
                  <div
                    key={ex.workoutExerciseId}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground truncate max-w-[65%]">
                      {ex.exerciseName}
                    </span>
                    <span className="font-medium shrink-0">
                      {ex.defaultSets} x {ex.defaultReps}
                    </span>
                  </div>
                ))}
                {workout.exercises.length > 5 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    +{workout.exercises.length - 5} more
                  </p>
                )}
                <div className="border-t flex justify-between text-xs text-muted-foreground pt-3 mt-auto">
                  <span>{workout.estimatedDuration} min</span>
                  <span>{workout.exercises.length} exercises</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {openEditWorkout && editWorkout && (
        <Dialog open={openEditWorkout} onOpenChange={setOpenEditWorkout}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Workout</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  value={editWorkout.name}
                  onChange={(e) =>
                    setEditWorkout((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                  placeholder="e.g. Back Day"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                  value={editWorkout.description}
                  onChange={(e) =>
                    setEditWorkout((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev
                    )
                  }
                  placeholder="Describe the workout..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Difficulty Level</Label>
                <Select
                  value={editWorkout.difficultyLevel}
                  onValueChange={(val) =>
                    setEditWorkout((prev) =>
                      prev
                        ? { ...prev, difficultyLevel: val as DifficultyLevel }
                        : prev
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {DIFFICULTY_LEVEL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Estimated Duration (min)</Label>
                <Input
                  type="number"
                  min={1}
                  value={editWorkout.estimatedDuration}
                  onChange={(e) =>
                    setEditWorkout((prev) =>
                      prev
                        ? { ...prev, estimatedDuration: Number(e.target.value) }
                        : prev
                    )
                  }
                  placeholder="60"
                />
              </div>
            </div>
            {editError && (
              <p className="text-sm text-destructive">{editError}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                disabled={editIsUnchanged || submitting}
                onClick={() => handleSaveEdit(editWorkout.workoutId)}
              >
                {submitting && <Spinner className="mr-1.5" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Wrapper>
  );
};

export default Workouts;
