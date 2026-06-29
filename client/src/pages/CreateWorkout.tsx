import { useNavigate } from "react-router-dom"
import CreateFormPage from "../components/CreateFormPage"
import type {Category, CreateExercisePayload, EquipmentType, MuscleGroup} from "../types/Exercise";

const defaultForm: CreateWorkoutPayload = {
    name: "",
    description: "",
    category: "" as Category,
    equipmentType: "" as EquipmentType,
    muscleGroup: "" as MuscleGroup,
}

export default function CreateWorkout() {
    const navigate = useNavigate();
    const { handleCreateWorkout } = useWorkoutHooks();
    const [form, setForm] = useState<CreateExercisePayload>(defaultForm);

    const set = (field: keyof CreateExercisePayload) => (val: string) =>
        setForm(prev => ({ ...prev, [field]: val }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleCreateExercise(form);
        navigate("/workouts");
    }
    
    return (
        <CreateFormPage
            title="Workouts"
            description="Manage and build reusable programs"
            backLabel="Back to Workouts"
            onBack={() => navigate("/workouts")}
            onSubmit={handleSubmit}
            submitLabel="Create Workout"
            disabled={false}
        >
            <></>
        </CreateFormPage>
    )
}