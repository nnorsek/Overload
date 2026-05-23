import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faCheck, faStar} from "@fortawesome/free-solid-svg-icons";
import InputForm from "../components/InputForm";
import SelectForm from "../components/SelectForm";
import type { DisplayRole } from "../types/StartUp";
import { useAuth } from "../context/AuthContext"

type LoginForm = {
    role: DisplayRole,
    email: string,
    password: string
}

type LoginResponse = {
    role: string,
    email: string,
    token: string,
    id: string
}

const features = [
    { icon: faCheck, title: "Workout tracking", desc: "Log every set, rep, and PR" },
    { icon: faClock, title: "Progress over time", desc: "Visualize your gains weekly" },
    { icon: faStar, title: "Trainer programs", desc: "Follow structured plans" },
];

const Login = () => {
    const [loginForm, setLoginForm] = useState<LoginForm>({ role: "client", email: "", password: ""});
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({ ...prev, [e.target.name]: e.target.value}));
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLoginForm(prev => ({ ...prev, role: e.target.value as DisplayRole }))
    }

    const SubmitLogin = async () => {
       const {role, ...payload} = loginForm
        console.log(payload)
        console.log(loginForm.role)
        try {
            const res = await fetch(`http://localhost:8080/${loginForm.role}/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                if (res.status === 401) {
                    setError("Invalid email or password")
                } else if (res.status === 500) {
                    setError("Something went wrong, please try again")
                }
                return;
            }
            const data = await res.json() as LoginResponse;
            login({
                role: data.role,
                email: data.email,
                id: data.id,
                token: data.token
            })
            navigate("/")
            console.log(data)
        } catch {
           setError("Something went wrong, please try again")
        }
    }


    return (
        <div className="flex h-screen">

            <div className="flex w-1/2 flex-col justify-center items-center bg-[#212121]">
                <p className="text-red-500 text-lg px-2 py-1 rounded font-bold">{error}</p>
                <form className="flex flex-col items-center justify-center" onSubmit={(e) => { e.preventDefault(); SubmitLogin();}}>
                <h1 className="text-2xl text-white font-bold mb-6">Login</h1>

                <div className="flex flex-col w-80 gap-4">
                    <div className="relative flex bg-gray-100 rounded-full p-1 w-fit mx-auto mb-6">
                        <div className={`absolute top-1 bottom-1 rounded-full bg-gray-400/50 border border-gray-400 shadow-sm
                                         transition-all duration-200 ease-in-out
                                         ${loginForm.role === "client" ? "left-1 right-1/2" : "left-1/2 right-1"}`}
                        />
                        <button
                            type="button"
                            onClick={() => setLoginForm(prev => ({ ...prev, role: "client" }))}
                            className={`relative z-10 px-6 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 hover:cursor-pointer
                                ${loginForm.role === "client" ? "text-black" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Client
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginForm(prev => ({ ...prev, role: "trainer" }))}
                            className={`relative z-10 px-6 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 hover:cursor-pointer
                                ${loginForm.role === "trainer" ? "text-black" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Trainer
                        </button>
                    </div>
                    <InputForm textColor="text-white" name="email" type="text" label="Email" onChange={handleChange} />
                    <InputForm textColor="text-white" name="password" type="password" label="Password" onChange={handleChange} />
                    <button type="submit" className="w-full bg-white py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 hover:cursor-pointer">
                        Sign in
                    </button>
                </div>
            </form>
            </div>

            <div className="relative flex w-1/2 flex-col justify-center items-center bg-blue-primary text-white overflow-hidden">
                <div className="inline-flex items-center gap-2 bg-blue-secondary/10 border border-blue-secondary/25 rounded-full px-4 py-1.5 mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-secondary" />
                    <span className="text-blue-secondary text-lg uppercase tracking-widest font-medium">Training Platform</span>
                </div>

                <h2 className="text-4xl font-medium tracking-tight">Overload</h2>
                <p className="text-gray-300 mt-2 leading-relaxed">
                    Track your progress.<br />Push your limits.
                </p>

                <div className="mt-9 text-left flex flex-col gap-5">
                    {features.map(({ icon, title, desc }) => (
                        <div key={title} className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-secondary/15 border border-blue-secondary/20 flex items-center justify-center flex-shrink-0">
                                <FontAwesomeIcon icon={icon} className="text-blue-secondary w-3.5 h-3.5" />
                            </div>
                            <div>
                                <p className="text-white font-medium">{title}</p>
                                <p className="text-gray-300 text-sm mt-0.5">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-col items-center justify-center">
                    <p className="text-gray-200">New here?</p>
                    <button onClick={() => navigate("/register")}
                            className="mt-3 px-7 py-2.5 bg-blush border border-[#2a3f52] text-blue-secondary rounded-xl
                                       text-sm font-medium hover:bg-white hover:text-black hover:border-blue-secondary transition-all duration-200">
                        Create an account
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Login
