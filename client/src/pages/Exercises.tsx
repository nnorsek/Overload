import { useState } from 'react';
import type { Exercise, Category, MuscleGroup, CreateExercisePayload } from "../types/Exercise";
import { useExerciseHooks } from "../hooks/ExerciseHooks"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent} from "../components/ui/dropdown-menu"
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter, DialogClose } from "../components/ui/dialog"
import { MoreHorizontal } from "lucide-react"



const EXERCISE_CATEGORIES = ["Chest", "Shoulders", "Biceps" , "Triceps", "Legs", "Core", "Back"]

const Exercises = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    const [editExercise, setEditExercise] = useState<Exercise | null>(null);
    const [openEditExercise, setOpenEditExercise] = useState<boolean>(false);
    const { loading, error, exercises, handleEditExercise, handleDeleteExercise } = useExerciseHooks();
    const [filter, setFilter] = useState<EXERCISE_CATEGORIES | "ALL">("ALL");

    const handleSearchChange = (input: string) => {
        setSearchInput(input);
    }

    const visibleExercises = exercises.filter(e => filter === "ALL" || e.muscleGroup === filter.toUpperCase())
        .filter(e => e.name.toLowerCase().includes(searchInput.trim().toLowerCase()));


    const handleOpenEditExercise = (id: number) => {
        setEditExercise(exercises.find(exercise => exercise.exerciseId === id) ?? null);
        setOpenEditExercise(true);
    }

    const handleSaveEdit = async (id: number) => {
        if (id == null) return;
        await handleEditExercise(id, editExercise!);
        setOpenEditExercise(false);
    }

    const handleCreate = async (payload: CreateExercisePayload) => {

    }

    return (
        <div className="p-5 ml-10">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold py-5">Exercise Library</h1>
                <p className="text-lg">Create, edit, and explain different exercises your own way</p>
            </div>
            <div className="flex gap-x-28 mt-8">
                <input className="w-128 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none" placeholder={"Search..."} onChange={(e) => handleSearchChange(e.target.value)}/>
                <button className="flex text-lg px-6 py-2 bg-blue-400 rounded-lg ring-2 ring-transparent hover:ring-blue-600 hover:bg-blue-500 transition-all duration-200 cursor-pointer">Add</button>
            </div>
            <div className="flex gap-x-10 mt-5">
                <div onClick={() => setFilter("ALL")} className={`flex text-lg rounded-sm px-6 py-3 border hover:cursor-pointer hover:border-blue-500 ${filter === "ALL" ? "bg-blue-500 text-white" : ""}`}>
                    All
                </div>
                {EXERCISE_CATEGORIES.map((category) => (
                    <div key={category} onClick={() => setFilter(category)} className={`flex text-lg rounded-sm px-6 py-3 border hover:cursor-pointer hover:border-blue-500 ${filter === category ? "bg-blue-500 text-white" : ""}`}>
                        {category}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {visibleExercises.map((exercise) => (
                    <Card key={exercise.exerciseId} className="border hover:border-blue-300 transition-colors duration-200">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{exercise.name}</CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon-sm" className="hover:cursor-pointer hover:bg-slate-100 mb-2"><MoreHorizontal/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-16" onCloseAutoFocus={(e) => e.preventDefault()}>
                                        <DropdownMenuItem>Details</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleOpenEditExercise(exercise.exerciseId)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteExercise(exercise.exerciseId)} variant="destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="hover:bg-slate-200 border-blue-500">{exercise.category}</Badge>
                                {exercise.originalExerciseId != null && (
                                    <Badge variant="outline" className="border-green-500 text-green-600">Customized</Badge>
                                )}
                            </div>
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
                        <input value={editExercise?.name ?? ""} onChange={(e) => setEditExercise(prev => prev ? { ...prev, name: e.target.value} : prev)} className="border px-3 py-2 rounded-lg mb-5" placeholder="Name" />
                        <p className="pl-2 text-sm pb-2">Muscle Group</p>
                        <input value={editExercise?.muscleGroup ?? ""} onChange={(e) => setEditExercise(prev => prev ? { ...prev, muscleGroup: e.target.value} : prev)} className="border px-3 py-2 rounded-lg mb-5" placeholder="Muscle Group" />
                        <p className="pl-2 text-sm pb-2">Equipment</p>
                        <input value={editExercise?.equipmentType ?? ""} onChange={(e) => setEditExercise(prev => prev ? { ...prev, equipmentType: e.target.value} : prev)} className="border px-3 py-2 rounded-lg mb-5" placeholder="Equipment" />
                        <p className="pl-2 text-sm pb-2">Description</p>
                        <textarea value={editExercise?.description ?? ""} onChange={(e) => setEditExercise(prev => prev ? { ...prev, description: e.target.value} : prev)} className="border px-3 py-2 rounded-lg mb-5" placeholder="Description" />
                    </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                                </DialogClose>
                            <Button onClick={() => handleSaveEdit(editExercise?.exerciseId)}>Save</Button>
                        </DialogFooter>
                </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default Exercises;