
const EXERCISE_CATEGORIES = ["Chest", "Shoulders", "Arms", "Legs", "Core", "Back"]


const Exercises = () => {

    return (
        <div className="p-5">
            <div className="flex flex-col ml-20">
                <h1 className="text-3xl font-bold py-10">Exercise Library</h1>
                <p className="text-lg">Create, edit, and explain different exercises your own way</p>
            </div>
            <div className="flex gap-x-10 justify-center">
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