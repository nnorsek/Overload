import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import InputForm from "../components/InputForm"

type SignUpForm = {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    gender: "male" | "female"
    weight: number
    height: number
    dateOfBirth: string
    photoURL?: string
    goal?: string
    trainerId?: number
}
// TODO: Update to linear sign up
export default function Register() {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignUpForm>()

    const onSubmit = async (data: SignUpForm) => {
        const { confirmPassword, ...payload } = data
        try {
            const res = await fetch("http://localhost:8080/trainer/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) return
            navigate("/login")
        } catch {
            // handle network error
        }
    }

    return (
        <div className="flex h-screen justify-center items-center">
            <form className="flex flex-col items-center w-80 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-2xl font-bold mb-2">Create account</h1>

                <InputForm
                    {...register("firstName", { required: "First name is required" })}
                    type="text"
                    label="First Name"
                    error={errors.firstName?.message}
                />
                <InputForm
                    {...register("lastName", { required: "Last name is required" })}
                    type="text"
                    label="Last Name"
                    error={errors.lastName?.message}
                />
                <InputForm
                    {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                    })}
                    type="text"
                    label="Email"
                    error={errors.email?.message}
                />
                <InputForm
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Minimum 8 characters" },
                    })}
                    type="password"
                    label="Password"
                    error={errors.password?.message}
                />
                <InputForm
                    {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: val => val === watch("password") || "Passwords do not match",
                    })}
                    type="password"
                    label="Confirm Password"
                    error={errors.confirmPassword?.message}
                />

                {/* Gender */}
                <div className="w-full">
                    <select
                        {...register("gender", { required: "Gender is required" })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-500 text-gray-600 ${
                            errors.gender ? "border-red-400" : "border-gray-300"
                        }`}
                    >
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
                </div>

                <InputForm
                    {...register("weight", { required: "Weight is required", min: { value: 1, message: "Invalid weight" } })}
                    type="number"
                    label="Weight (lbs)"
                    error={errors.weight?.message}
                />
                <InputForm
                    {...register("height", { required: "Height is required", min: { value: 1, message: "Invalid height" } })}
                    type="number"
                    label="Height (in)"
                    error={errors.height?.message}
                />
                <InputForm
                    {...register("dateOfBirth", { required: "Date of birth is required" })}
                    type="date"
                    label="Date of Birth"
                    error={errors.dateOfBirth?.message}
                />
                <InputForm
                    {...register("goal")}
                    type="text"
                    label="Goal (optional)"
                />
                <InputForm
                    {...register("trainerId")}
                    type="text"
                    label="Trainer ID (optional)"
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
                >
                    {isSubmitting ? "Creating account..." : "Sign up"}
                </button>

                <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <span className="cursor-pointer underline" onClick={() => navigate("/login")}>
                        Sign in
                    </span>
                </p>
            </form>
        </div>
    )
}
