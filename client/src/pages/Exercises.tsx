import { useState } from 'react';

const EXERCISE_CATEGORIES = ["Chest", "Shoulders", "Arms", "Legs", "Core", "Back"]


const Exercises = () => {
    const [searchInput, setSearchInput] = useState<string>("");


    const handleSearchChange = () => {
        const search = searchInput.trim().toLowerCase();
    }


    return (
        <div className="p-5 ml-10">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold py-5">Exercise Library</h1>
                <p className="text-lg">Create, edit, and explain different exercises your own way</p>
            </div>
            <div className="flex w-full gap-x-4">
                <input className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none" placeholder={"Search..."} onChange={handleSearchChange}/>
                <button className="text-lg px-6 py-2 bg-blue-400 rounded-lg ring-2 ring-transparent hover:ring-blue-600 hover:bg-blue-500 transition-all duration-200 cursor-pointer">Add</button>
            </div>
            <div className="flex gap-x-10 mt-5">
                {EXERCISE_CATEGORIES.map((category) => (
                    <div className="flex text-lg rounded-sm px-6 py-3 border shadow-lg  hover:cursor-pointer">
                        {category}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Exercises;