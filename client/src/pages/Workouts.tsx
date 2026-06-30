import Wrapper from "../components/Wrapper"
import { useWorkoutHooks } from "../hooks/WorkoutHooks"
import { Input }  from "../components/ui/input"
import { Button } from "@/components/ui/button";

const Workouts = () => {

    const { loading, workouts, error, reload, reloader, handleCreateWorkout, handleEditWorkout, handleDeleteWorkout } = useWorkoutHooks();

    console.log(workouts)

    return (
        <Wrapper>
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold py-5">Workouts</h1>
                <p className="text-lg">Manage and build reusable programs</p>
            </div>
            <div className="flex mt-2 w-1/2">
                <Input type="text" placeholder="Search workout..."/>
            </div>
        </Wrapper>
    )
}

export default Workouts;