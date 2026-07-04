import { useState, useRef } from "react";
import type {
  Exercise,
  MuscleGroup,
  EquipmentType,
  ExerciseCategory,
} from "../types/Exercise";
import { useExerciseHooks } from "../hooks/ExerciseHooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Skeleton } from "../components/ui/skeleton";
import { Spinner } from "../components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectGroup,
  SelectItem,
  SelectContent,
  SelectValue,
} from "../components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  CATEGORY_OPTIONS,
  MUSCLE_GROUP_OPTIONS,
  EQUIPMENT_OPTIONS,
} from "../constants/ExerciseOptions";
import Wrapper from "../components/Wrapper";

const Exercises = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [editExercise, setEditExercise] = useState<Exercise | null>(null);
  const [openEditExercise, setOpenEditExercise] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const {
    loading,
    submitting,
    exercises,
    handleEditExercise,
    handleDeleteExercise,
  } = useExerciseHooks();
  const [filter, setFilter] = useState<MuscleGroup | "ALL">("ALL");
  const navigate = useNavigate();
  const originalExercise = useRef<Exercise | null>(null);

  const visibleExercises = exercises
    .filter((e) => filter === "ALL" || e.muscleGroup === filter)
    .filter((e) =>
      e.name.toLowerCase().includes(searchInput.trim().toLowerCase())
    );

  const handleOpenEditExercise = (id: number) => {
    const found =
      exercises.find((exercise) => exercise.exerciseId === id) ?? null;
    setEditExercise(found);
    setEditError(null);
    setOpenEditExercise(true);
    originalExercise.current = found;
  };

  const handleSaveEdit = async (id: number) => {
    if (id == null) return;
    setEditError(null);
    const result = await handleEditExercise(id, editExercise!);
    if (result.error) {
      setEditError(result.error);
    } else {
      setOpenEditExercise(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteError(null);
    const result = await handleDeleteExercise(id);
    if (result.error) setDeleteError(result.error);
  };

  const editIsUnchanged =
    originalExercise.current?.name === editExercise?.name &&
    originalExercise.current?.muscleGroup === editExercise?.muscleGroup &&
    originalExercise.current?.equipmentType === editExercise?.equipmentType &&
    originalExercise.current?.category === editExercise?.category &&
    originalExercise.current?.description === editExercise?.description;

  return (
    <Wrapper>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold py-5">Exercise Library</h1>
        <p className="text-lg">
          Create, edit, and explain different exercises your own way
        </p>
      </div>
      <div className="flex gap-x-8 mt-8">
        <Input
          type="text"
          className="py-5 w-1/3"
          placeholder="Search exercises..."
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate("/exercises/create")}
        >
          Create Exercise
        </Button>
      </div>
      <div className="flex flex-wrap gap-x-5 mt-5">
        <Badge
          onClick={() => setFilter("ALL")}
          className={`flex shadow rounded-sm text-center p-4 border hover:cursor-pointer hover:border-blue-500 ${
            filter === "ALL"
              ? "bg-blue-500 text-white"
              : "bg-card text-secondary-foreground"
          }`}
        >
          All
        </Badge>
        {MUSCLE_GROUP_OPTIONS.map((opt) => (
          <Badge
            key={opt.value}
            onClick={() => setFilter(opt.value as MuscleGroup)}
            className={`flex shadow rounded-sm text-center p-4 border hover:cursor-pointer hover:border-blue-500 ${
              filter === opt.value
                ? "bg-blue-500 text-white"
                : "bg-card text-secondary-foreground"
            }`}
          >
            {opt.label}
          </Badge>
        ))}
      </div>
      {deleteError && (
        <p className="text-sm text-destructive mt-4">{deleteError}</p>
      )}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {visibleExercises.map((exercise) => (
            <Card
              key={exercise.exerciseId}
              className="border hover:border-blue-500 transition-colors duration-200"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{exercise.name}</CardTitle>
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
                      className="w-16"
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <DropdownMenuItem>Details</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleOpenEditExercise(exercise.exerciseId)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(exercise.exerciseId)}
                        variant="destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="hover:bg-slate-200 border-blue-500"
                  >
                    {exercise.category}
                  </Badge>
                  {exercise.originalExerciseId != null && (
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-600"
                    >
                      Customized
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Muscle Group</span>
                  <span className="font-medium">
                    {
                      MUSCLE_GROUP_OPTIONS.find(
                        (e) => e.value === exercise.muscleGroup
                      )?.label
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Equipment</span>
                  <span className="font-medium">
                    {
                      EQUIPMENT_OPTIONS.find(
                        (e) => e.value === exercise.equipmentType
                      )?.label
                    }
                  </span>
                </div>
                {exercise.description && (
                  <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                    {exercise.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {openEditExercise && (
        <Dialog open={openEditExercise} onOpenChange={setOpenEditExercise}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Exercise</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col">
              <p className="pl-2 text-sm pb-2">Name</p>
              <Input
                value={editExercise?.name ?? ""}
                onChange={(e) =>
                  setEditExercise((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
                className="border px-3 py-2 rounded-lg mb-5"
                placeholder="Name"
              />
              <p className="pl-2 text-sm pb-2">Muscle Group</p>
              <Select
                value={editExercise?.muscleGroup}
                onValueChange={(val) =>
                  setEditExercise((prev) =>
                    prev ? { ...prev, muscleGroup: val as MuscleGroup } : prev
                  )
                }
              >
                <SelectTrigger className="w-full mb-5">
                  <SelectValue placeholder="Select a muscle group" />
                </SelectTrigger>
                <SelectContent position={"popper"}>
                  <SelectGroup>
                    {MUSCLE_GROUP_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="pl-2 text-sm pb-2">Equipment Type</p>
              <Select
                value={editExercise?.equipmentType}
                onValueChange={(val) =>
                  setEditExercise((prev) =>
                    prev
                      ? { ...prev, equipmentType: val as EquipmentType }
                      : prev
                  )
                }
              >
                <SelectTrigger className="w-full mb-5">
                  <SelectValue placeholder="Select equipment type" />
                </SelectTrigger>
                <SelectContent position={"popper"}>
                  <SelectGroup>
                    {EQUIPMENT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="pl-2 text-sm pb-2">Category</p>
              <Select
                value={editExercise?.category}
                onValueChange={(val) =>
                  setEditExercise((prev) =>
                    prev ? { ...prev, category: val as ExerciseCategory } : prev
                  )
                }
              >
                <SelectTrigger className="w-full mb-5">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent position={"popper"}>
                  <SelectGroup>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="pl-2 text-sm pb-2">Description</p>
              <Textarea
                value={editExercise?.description ?? ""}
                onChange={(e) =>
                  setEditExercise((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev
                  )
                }
                className="mb-5"
                placeholder="Description"
              />
            </div>
            {editError && (
              <p className="text-sm text-destructive px-1 -mt-2">{editError}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                disabled={editIsUnchanged || submitting}
                onClick={() =>
                  editExercise && handleSaveEdit(editExercise.exerciseId)
                }
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

export default Exercises;
