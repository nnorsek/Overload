import Wrapper from "../components/Wrapper";
import { useWorkoutHooks } from "../hooks/WorkoutHooks";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const Workouts = () => {
  const [search, setSearch] = useState<string>("");

  const {
    loading,
    workouts,
    error,
    reload,
    reloader,
    handleCreateWorkout,
    handleEditWorkout,
    handleDeleteWorkout,
  } = useWorkoutHooks();

  const visableWorkouts = workouts.filter((w) =>
    w.name.toLowerCase().includes(search?.toLowerCase()),
  );

  console.log(visableWorkouts);

  return (
    <Wrapper>
      <div className="flex flex-col">
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
        <Button size="lg">Create Workout</Button>
      </div>
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
                    className="w-16"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <DropdownMenuItem>Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("detail")}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => console.log("delete")}
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
    </Wrapper>
  );
};

export default Workouts;
