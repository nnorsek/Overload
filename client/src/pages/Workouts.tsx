import Wrapper from "../components/Wrapper";
import { useWorkoutHooks } from "../hooks/WorkoutHooks";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
      <div className="flex mt-2 w-1/2 gap-x-4">
        <Input
          type="text"
          placeholder="Search workout..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button size="lg">Create Workout</Button>
      </div>
    </Wrapper>
  );
};

export default Workouts;
