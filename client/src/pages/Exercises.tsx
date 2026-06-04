import { useState } from 'react';
import { useExerciseHooks } from "../hooks/ExerciseHooks"
const EXERCISE_CATEGORIES = ["Chest", "Shoulders", "Arms", "Legs", "Core", "Back"]
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"

const Exercises = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    const { loading, error, exercises } = useExerciseHooks();

    const handleSearchChange = () => {
        const search = searchInput.trim().toLowerCase();
    }

    return (
        <div className="p-5 ml-10">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold py-5">Exercise Library</h1>
                <p className="text-lg">Create, edit, and explain different exercises your own way</p>
            </div>
            <div className="flex gap-x-28 mt-8">
                <input className="w-128 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none" placeholder={"Search..."} onChange={handleSearchChange}/>
                <button className="flex text-lg px-6 py-2 bg-blue-400 rounded-lg ring-2 ring-transparent hover:ring-blue-600 hover:bg-blue-500 transition-all duration-200 cursor-pointer">Add</button>
            </div>
            <div className="flex gap-x-10 mt-5">
                {EXERCISE_CATEGORIES.map((category) => (
                    <div className="flex text-lg rounded-sm px-6 py-3 border shadow-lg  hover:cursor-pointer">
                        {category}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {exercises.map((exercise) => (
                    <Card key={exercise.id} className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle>{exercise.name}</CardTitle>
                            <CardDescription>{exercise.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Muscle Group</span>
                                <span className="font-medium">{exercise.muscleGroup}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Equipment</span>
                                <span className="font-medium">{exercise.equipmentType}</span>
                            </div>
                            {exercise.description && (
                                <p className="text-sm text-muted-foreground mt-2 border-t pt-2">{exercise.description}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    )
}

export default Exercises;