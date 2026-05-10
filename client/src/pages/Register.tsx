import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import InputForm from "../components/InputForm"
import {useState} from "react";
import SelectForm from "../components/SelectForm.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";


type SignUpForm = {
    firstName: string
    middleName: string
    lastName: string
    gender: "male" | "female"
    dob: string
    email: string
    password: string
    confirmPassword: string
    startingWeight: number
    height: number
    dateOfBirth: string
    photoURL?: string
    goal?: string
}

const ClientInfo =
    ["Log workouts & track PRs",
        "Follow trainer programs",
        "Monitor progress over time"]

export default function Register() {
    const navigate = useNavigate()
    const [step, setStep] = useState<number>(0)
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignUpForm>()

    const onSubmit = async (data: SignUpForm) => {
        const { confirmPassword, ...payload } = data
        try {
            console.log(payload)
            const res = await fetch("http://localhost:8080/client/create", {
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

    const nextStep = () => {
        setStep(step + 1)
    }

    const prevStep = () => {
        setStep(step - 1)
    }
    return (
        <div className="flex">
            <div className="h-screen flex flex-col p-20 ml-10 w-[1000px]">
               <div className="w-fit text-xl px-8 font-semibold flex justify-center items-center tracking-wide uppercase rounded-xl py-1 border border-orange-200 bg-orange-100">
                    client signup
               </div>
                <div className="mt-8">
                <h1 className="text-5xl font-semibold">Join as a Client</h1>
                    <p className="text-xl mt-6 font-semibold">Start your fitness journey today</p>
                </div>
                <div className="mt-6">
                    {ClientInfo.map((item) => (
                        <div className="flex py-4 gap-x-2 text-lg">
                            <div className="px-2 py-1 rounded-lg bg-gray-400"><FontAwesomeIcon size={"xs"} icon={faCheck}/></div>
                            {item}
                        </div>
                    ))}
                </div>

                    <hr className="mt-auto mb-3"/>
                    <div className="flex flex-col text-xl">
                        <p>Already have an account? <a className="hover:cursor-pointer underline hover:text-gray-800" href="/signin">Sign in</a></p>
                    </div>

            </div>
            <form className="w-full bg-gray-300 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                {step === 0 && (
                    <div className="flex flex-col justify-center items-center gap-4">
                        <h1 className="mb-2 text-2xl">Sign up as a Trainer or Client</h1>
                        <div className={"flex justify-center w-full gap-x-4 text-lg text-gray-800 font-semibold"}>
                        <button className="px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 hover:cursor-pointer" onClick={nextStep}>
                            Client
                        </button>
                        <button className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 hover:cursor-pointer" onClick={nextStep}>
                            Trainer
                        </button>
                    </div>
                    </div>
                )}
                {step === 1 && (
                <div className="flex flex-col w-full gap-y-5">
                    <h1 className="text-4xl mb-2">Let's get to know you...</h1>
                <InputForm
                    {...register("firstName", { required: "First name is required" })}
                    required={true}
                    type="text"
                    label="First Name"
                    error={errors.firstName?.message}
                />
                <InputForm
                    {...register("middleName")}
                    type="text"
                    label="Middle Name"
                    error={errors.firstName?.message}
                />
                <InputForm
                    {...register("lastName", { required: "Last name is required" })}
                    required={true}
                    type="text"
                    label="Last Name"
                    error={errors.lastName?.message}
                />
                        <InputForm
                            {...register("dateOfBirth", { required: "Date of birth is required" })}
                            required={true}
                            type="date"
                            label="Date of Birth"
                            error={errors.dateOfBirth?.message}
                        />
                            {/* TODO: Fix chevron position */}
                            <SelectForm
                                {...register("gender", { required: "Gender is required" })}
                                options={["Gender", "male", "female"]}
                                error={errors.gender?.message}
                            >
                            </SelectForm>
                    </div>
            )}
                {step === 2 && (
                    <div className="flex flex-col w-full justify-center gap-y-5">
                        <h1 className="text-4xl mb-2">Body Metrics</h1>
                        <InputForm
                            {...register("startingWeight", { required: "Weight is required", min: { value: 1, message: "Invalid weight" } })}
                            required={true}
                            type="number"
                            label="Weight (lbs)"
                            error={errors.startingWeight?.message}
                        />
                        {/* TODO: Change to incremental */}
                        <InputForm
                            {...register("height", { required: "Height is required", min: { value: 1, message: "Invalid height" } })}
                            required={true}
                            type="number"
                            label="Height (in)"
                            error={errors.height?.message}
                        />

                            <InputForm
                                {...register("goal")}
                                type="text"
                                label="Goal (optional)"
                            />

                    </div>
                )}
                {step === 3 && (
                    <div className="flex flex-col w-full justify-center gap-y-5">
                        <h1 className="text-4xl mb-2">Account Information</h1>
                    <InputForm
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                        })}
                        required={true}
                        type="text"
                        label="Email"
                        error={errors.email?.message}
                    />


                <InputForm
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Minimum 8 characters" },
                    })}
                    required={true}
                    type="password"
                    label="Password"
                    error={errors.password?.message}
                />
                <InputForm
                    {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: val => val === watch("password") || "Passwords do not match",
                    })}
                    required={true}
                    type="password"
                    label="Confirm Password"
                    error={errors.confirmPassword?.message}
                />
                    </div>
            )}

                <div className="flex flex-row justify-center w-full mt-2 gap-x-5">
                {(step == 2 || step == 3) && (
                    <button
                        type="button"
                        onClick={() => prevStep()}
                        className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 hover:cursor-pointer transition-colors duration-200 disabled:opacity-50"
                    >
                        Back
                    </button>
                )}

                {(step == 1 || step == 2) && (
                            <button
                                type="button"
                                onClick={() => nextStep()}
                                className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 hover:cursor-pointer transition-colors duration-200 disabled:opacity-50"
                                >
                                Next
                            </button>
                )}
                    {step == 3 && (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-500 border text-white py-2 rounded-lg hover:bg-blue-400 hover:cursor-pointer transition-colors duration-200 disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating account..." : "Sign up"}
                        </button>
                        )}

                </div>
                <p className="text-sm text-gray-500 text-center">
                    Already have an account?{" "}
                    <span className="cursor-pointer underline" onClick={() => navigate("/login")}>
                        Sign in
                    </span>
                </p>


            </form>
        </div>
    )
}
