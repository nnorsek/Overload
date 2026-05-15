import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import InputForm from "../components/InputForm"
import {useState} from "react";
import SelectForm from "../components/SelectForm.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faCheck} from "@fortawesome/free-solid-svg-icons";


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
    goal?: string
}

type SignUpClientResponse = {
    clientId: string
    firstName: string
    lastName: string
    email: string
    startingWeight: number
    height: number
    gender: "male" | "female"
    token: string
}
type SignUpTrainerResponse = {
    trainerId: string
    firstName: string
    lastName: string
    email: string
    gender: string
    token: string
}
type Role = "CLIENT" | "TRAINER" | "ADMIN" | "";

const ClientInfo =
    ["Log workouts & track PRs",
        "Follow trainer programs",
        "Monitor progress over time"]



export default function Register() {
    const navigate = useNavigate()
    const [step, setStep] = useState<number>(1)
    const [error, setError] = useState<string | null>(null)
    const [role, setRole] = useState<Role>("")
    const {
        register,
        handleSubmit,
        watch,
        setError: setFieldError,
        formState: { errors, isSubmitting },
    } = useForm<SignUpForm>({ mode: "onBlur"})

    const totalSteps = role === "CLIENT" ? 4 : role === "TRAINER" ? 3 : 4
    const btnBase = `flex flex-col px-6 py-8 rounded-lg justify-center gap-y-4 items-center w-[250px] h-[200] border-2 hover:cursor-pointer transition hover:-translate-y-2`
    const selectedClass = `bg-blue-500/40 border-gray-200`
    const unselectedClass = `bg-transparent border-gray-400 hover:border-gray-200`

    const watchedStepTwo = watch(["firstName", "lastName", "gender", "dateOfBirth"])
    const isStepTwoValid = watchedStepTwo.every(v => !!v) &&
        !errors.firstName && !errors.lastName && !errors.gender && !errors.dateOfBirth

    const watchedStepThree = watch(["startingWeight", "height"])
    const isStepThreeValid = watchedStepThree.every(v => !!v) &&
        !errors.height && !errors.startingWeight

    const watchedStepFour = watch(["password", "confirmPassword", "email"])
    const isStepFourValid = watchedStepFour.every(v => !!v) &&
        !errors.email && !errors.password && !errors.confirmPassword

    const displayRole = role == "CLIENT" ? "client" : "trainer"

    const onSubmit = async (data: SignUpForm) => {
        const { confirmPassword, ...payload } = data
        try {
            const res = await fetch(`http://localhost:8080/${displayRole}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) {
                const errorData = await res.json()
                if (res.status === 409) {
                    setFieldError("email", { type: "server", message: errorData.message })
                } else if (res.status === 400) {
                    Object.entries(errorData).forEach(([field, message]) => {
                        setFieldError(field as keyof SignUpForm, { type: "server", message: message as string})
                    })
                }
                return
            }

            const data = await res.json() as SignUpClientResponse | SignUpTrainerResponse
            localStorage.setItem("token", data.token)
            navigate("/")
        } catch (err: any) {
                setError(err.message)
            }
        }

    console.log("error", error)
    const nextStep = () => {
        setStep(step + 1)
    }

    const prevStep = () => {
        setStep(step - 1)
    }

    return (
        <div className="flex">
            <div className={`flex flex-col w-[1000px] ${role == "CLIENT" ? "bg-white" : "bg-[#040F16]"}`}>
                <div className="h-screen flex flex-col p-20 ml-10">
               <div className={`w-fit text-xl px-8 font-semibold flex justify-center items-center tracking-wide uppercase rounded-xl py-1 border
                ${role == "CLIENT" ? "border-orange-200 bg-orange-100" : "bg-[#72DDF7] border-white"}`}>
                   {`${displayRole} signup`}
               </div>
                <div className="mt-8">
                <h1 className={`text-5xl font-semibold ${role == "CLIENT" ? "text-black" : "text-white"}`}>{`Join as a ${displayRole}`}</h1>
                    <p className={`text-xl mt-6 font-semibold ${role == "CLIENT" ? "text-black" : "text-white"}`}>Start your fitness journey today</p>
                </div>
                <div className="mt-6">
                    {ClientInfo.map((item) => (
                        <div className={`flex py-4 gap-x-2 text-lg ${role == "CLIENT" ? "text-black" : "text-white"}`}>
                            <div className="px-2 py-1 rounded-lg bg-gray-400"><FontAwesomeIcon size={"xs"} icon={faCheck}/></div>
                            {item}
                        </div>
                    ))}
                </div>

                    <hr className={`mt-auto mb-3 ${role == "CLIENT" ? "text-black" : "text-white"}`}/>
                    <div className={`flex flex-col text-xl ${role == "CLIENT" ? "text-black" : "text-white"}`}>
                        <p>Already have an account? <a className="hover:cursor-pointer underline hover:text-gray-800" href="/login">Log in</a></p>
                    </div>
                </div>
            </div>
            <form className="w-full bg-[#262B40] flex flex-col gap-4 p-25" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-1.5 mb-7">
                    <p className="text-lg font-medium tracking-widest uppercase text-[#5171A5]">
                        Step {step} of {totalSteps}
                    </p>
                    <div className="flex gap-1.5">
                        {Array.from({ length: totalSteps }, (_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                    i < step ? 'bg-[#5171A5]' : 'bg-white/10'
                                }`}
                            />
                        ))}
                    </div>
                </div>
                {step === 1 && (
                    <div className="flex flex-col mt-20">
                        <p className="text-3xl text-gray-200 mb-4">Get Started</p>
                        <h1 className="text-5xl text-gray-200">Who are you signing up as?</h1>
                        <div className="mt-10 flex gap-x-12">
                            <button type="button" className={`${btnBase} ${role === "CLIENT" ? selectedClass : unselectedClass}`} onClick={() => setRole("CLIENT")}>
                                <h1 className="text-2xl text-white font-semibold">Client</h1>
                                <p className="text-white">Track workouts & follow trainer's programs</p>
                            </button>
                            <button type="button" className={`${btnBase} ${role === "TRAINER" ? selectedClass : unselectedClass}`} onClick={() => setRole("TRAINER")}>
                                <h1 className="text-2xl text-white font-semibold">Trainer</h1>
                                <p className="text-white px-2">Build programs & manage clients</p>
                            </button>
                        </div>
                        <button onClick={() => nextStep()} type="button" disabled={!role} className="w-64 mt-20 px-6 py-3 text-2xl border-2 border-gray-500 rounded-lg transition-all duration-200 ease-in-out bg-transparent hover:border-white hover:cursor-pointer text-white">
                            Continue <FontAwesomeIcon icon={faArrowRight}/>
                        </button>
                    </div>
                )}
                {step === 2 && (
                <div className="flex flex-col w-full gap-y-5">
                    <h1 className="text-4xl text-white mb-4">Let's get to know you...</h1>
                <InputForm
                    {...register("firstName", { required: "First name is required" ,
                        pattern: { value: /^[A-Za-z\s'-]+$/, message: "Name cannot contain numbers" }
                    })}
                    required={true}
                    type="text"
                    textColor={"text-white"}
                    label="First Name"
                    error={errors.firstName?.message}
                />
                <InputForm
                    {...register("middleName", {
                        pattern: { value: /^[A-Za-z\s'-]+$/, message: "Name cannot contain numbers" }
                    })}
                    type="text"
                    label="Middle Name"
                    textColor={"text-white"}
                />
                <InputForm
                    {...register("lastName", { required: "Last name is required",
                        pattern: { value: /^[A-Za-z\s'-]+$/, message: "Name cannot contain numbers" }
                    })}
                    required={true}
                    type="text"
                    textColor={"text-white"}
                    label="Last Name"
                    error={errors.lastName?.message}
                />
                        <InputForm
                            {...register("dateOfBirth", { required: "Date of birth is required",
                            validate: val => {
                                const date = new Date(val)
                                const today = new Date()
                                const minAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
                                const maxAge = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())
                                if (date > today) return "Date of birth cannot be in the future"
                                if (date < minAge) return "Enter a valid date of birth"
                                if (date > maxAge) return "You must be at least 13 years old"
                            }})}
                            required={true}
                            max={new Date().toISOString().split("T")[0]}
                            type="date"
                            textColor={"text-white"}
                            label="Date of Birth"
                            error={errors.dateOfBirth?.message}
                        />
                            <SelectForm
                                {...register("gender", { required: "Gender is required" })}
                                label={"Select a gender"}
                                required={true}
                                options={["Male", "Female"]}
                                error={errors.gender?.message}
                            >
                            </SelectForm>
                    </div>
            )}
                {step === 3 && role === "CLIENT" && (
                    <div className="flex flex-col w-full justify-center gap-y-5">
                        <h1 className="text-4xl mb-2 text-white">Body Metrics</h1>
                        <InputForm
                            {...register("startingWeight", { required: "Weight is required", min: { value: 60, message: "Invalid weight" } })}
                            required={true}
                            type="number"
                            textColor={"text-white"}
                            label="Weight (lbs)"
                            error={errors.startingWeight?.message}
                        />
                        <InputForm
                            {...register("height", { required: "Height is required", min: { value: 60, message: "Invalid height" } })}
                            required={true}
                            type="number"
                            textColor={"text-white"}
                            label="Height (in)"
                            error={errors.height?.message}
                        />



                    </div>
                )}
                {(step === 4 || (step === 3 && role === "TRAINER")) && (
                    <div className="flex flex-col w-full justify-center gap-y-5">
                        <h1 className="text-4xl mb-2 text-white">Account Information</h1>
                    <InputForm
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                        })}
                        required={true}
                        type="text"
                        textColor={"text-white"}
                        label="Email"
                        error={errors.email?.message}
                    />


                <div className="text-sm text-gray-400 bg-white/5 rounded-lg px-4 py-3 leading-relaxed">
                    <p className="font-medium text-gray-300 mb-1">Password must:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                        <li>Be at least 8 characters long</li>
                        <li>Contain at least one uppercase letter</li>
                        <li>Contain at least one number</li>
                        <li>Contain at least one special character (e.g. ! @ # $)</li>
                    </ul>
                </div>
                <InputForm
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Minimum 8 characters" },
                    })}
                    required={true}
                    type="password"
                    label="Password"
                    textColor={"text-white"}
                    error={errors.password?.message}
                />
                <InputForm
                    {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: val => val === watch("password") || "Passwords do not match",
                    })}
                    required={true}
                    textColor={"text-white"}
                    type="password"
                    label="Confirm Password"
                    error={errors.confirmPassword?.message}
                />
                {role === "CLIENT" && (
                <InputForm
                    {...register("goal")}
                    type="text"
                    textColor={"text-white"}
                    label="Goal (optional)"
                />)}</div>
            )}

                <div className="flex flex-row justify-center w-full mt-2 gap-x-5">
                {(step == 2 || step == 3 || step == 4) && (
                    <button
                        type="button"
                        onClick={() => prevStep()}
                        className="w-full bg-[#5171A5] text-white py-2 rounded-lg hover:bg-[#5171A5]/80 hover:cursor-pointer transition-colors duration-200 disabled:opacity-50"
                    >
                        Back
                    </button>
                )}

                {(step == 2 || (step == 3 && role === "CLIENT")) && (
                            <button
                                disabled={step === 2 ? !isStepTwoValid : step === 3 ? !isStepThreeValid : false}
                                type="button"
                                onClick={() => nextStep()}
                                className={`w-full bg-[#5171A5] text-white py-2 rounded-lg hover:bg-[#5171A5]/80 ${step === 2 && !isStepTwoValid ? "hover:cursor-not-allowed" : step === 3 && !isStepThreeValid ? "hover:cursor-not-allowed" : "hover:cursor-pointer"} transition-colors duration-200 disabled:opacity-50`}
                                >
                                Next
                            </button>
                )}
                    {(step == 4 || (step == 3 && role === "TRAINER")) && (
                        <button
                            type="submit"
                            disabled={isSubmitting || !isStepFourValid}
                            className={`w-full border-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white py-2 rounded-lg ${isStepFourValid ? "hover:cursor-pointer" : "hover:cursor-not-allowed"} transition-all duration-200 disabled:opacity-50`}
                        >
                            {isSubmitting ? "Creating account..." : "Sign up"}
                        </button>
                        )}

                </div>


            </form>
        </div>
    )
}
