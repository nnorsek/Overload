import { useState } from 'react';
import { useExerciseHooks } from "../hooks/ExerciseHooks"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent} from "../components/ui/dropdown-menu"
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter, DialogClose } from "../components/ui/dialog"
import { MoreHorizontal } from "lucide-react"



const EXERCISE_CATEGORIES = ["Chest", "Shoulders", "Arms", "Legs", "Core", "Back"]


const Exercises = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    const [editExercise, setEditExercise] = useState<Exercise | null> (null);
    const [openEditExercise, setOpenEditExercise] = useState<boolean>(false);
    const { loading, error, exercises } = useExerciseHooks();

    const handleSearchChange = () => {
        const search = searchInput.trim().toLowerCase();
    }

    const handleEditExercise = (id: number)=> {
        setEditExercise(exercises.find(exercise => exercise.id === id ?? null));
        setOpenEditExercise(true);
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
                    <div className="flex text-lg rounded-sm px-6 py-3 border hover:cursor-pointer">
                        {category}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {exercises.map((exercise) => (
                    <Card key={exercise.id} className="border hover:border-blue-300 transition-colors duration-200">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{exercise.name}</CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon-sm" className="hover:cursor-pointer hover:bg-slate-100 mb-2"><MoreHorizontal/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-16" onCloseAutoFocus={(e) => e.preventDefault()}>
                                        <DropdownMenuItem>Details</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEditExercise(exercise.id)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </div>
                            <Badge variant="outline" className="hover:bg-slate-200 border-blue-500">{exercise.category}</Badge>
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
            {openEditExercise && (
                <Dialog open={openEditExercise} onOpenChange={setOpenEditExercise}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Exercise</DialogTitle>
                        </DialogHeader>
                    <div className="flex flex-col">
                        <p className="pl-2 text-sm pb-2">Name</p>
                        <input defaultValue={editExercise?.name} className="border px-3 py-2 rounded-lg mb-5" placeholder="Name" />
                        <p className="pl-2 text-sm pb-2">Muscle Group</p>
                        <input defaultValue={editExercise?.muscleGroup} className="border px-3 py-2 rounded-lg mb-5" placeholder="Muscle Group" />
                        <p className="pl-2 text-sm pb-2">Equipment</p>
                        <input defaultValue={editExercise?.equipmentType} className="border px-3 py-2 rounded-lg mb-5" placeholder="Equipment" />
                        <p className="pl-2 text-sm pb-2">Description</p>
                        <textarea defaultValue={editExercise?.description} className="border px-3 py-2 rounded-lg mb-5" placeholder="Description" />
                    </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                                </DialogClose>
                            <Button>Save</Button>
                        </DialogFooter>
                </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default Exercises;