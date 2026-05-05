import 'react'
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faEye, faEyeSlash, faCheck, faStar} from "@fortawesome/free-solid-svg-icons";

type LoginForm = {
    email: string,
    password: string
}

const features = [
    { icon: faCheck, title: "Workout tracking", desc: "Log every set, rep, and PR" },
    { icon: faClock, title: "Progress over time", desc: "Visualize your gains weekly" },
    { icon: faStar, title: "Trainer programs", desc: "Follow structured plans" },
];

const Login = () => {
    const [loginForm, setLoginForm] = useState<LoginForm>({ email: "", password: ""});
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [passwordShow, setPasswordShow] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({ ...prev, [e.target.name]: e.target.value}));
    }

    const SubmitLogin = async () => {
        try {
            const res = await fetch("http://localhost:8080/trainer/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(loginForm)
            });

            if (!res.ok) {
                if (res.status === 403) {
                    setError("Invalid email or password")
                } else if (res.status === 500) {
                    setError("Something went wrong, please try again")
                }
                return;
            }
            const data = await res.json();
            localStorage.setItem("token", data.token)
            navigate("/") // ! Update to real url
        } catch {
           setError("Something went wrong, please try again")
        }
    }


    return (
        <div className="flex h-screen">

            {/* Login Form */}

            <div className="flex w-1/2 flex-col justify-center items-center">
                <p className="text-red-500 pb-4">{error}</p>
                <form className="flex flex-col items-center justify-center" onSubmit={(e) => { e.preventDefault(); SubmitLogin();}}>
                <h1 className="text-2xl font-bold mb-6">Login</h1>

                <div className="flex flex-col w-80 gap-4">

                    {/* Email */}
                    <div className="relative">
                        <input
                            type="text"
                            name="email"
                            id="email"
                            onChange={handleChange}
                            placeholder=" "
                            className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 pointer-events-none
                                peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-500
                                peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
                        >
                            Email
                        </label>
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={passwordShow ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder=" "
                            onChange={handleChange}
                            className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                        />
                        <span className="absolute right-3 top-4 cursor-pointer text-gray-400" onClick={() => setPasswordShow(!passwordShow)}>
                            {passwordShow ? <FontAwesomeIcon icon={faEye}/> : <FontAwesomeIcon icon={faEyeSlash} />}</span>
                        <label
                            htmlFor="password"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 pointer-events-none
                                peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-500
                                peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
                        >
                            Password
                        </label>


                    </div>
                    <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200" onClick={SubmitLogin}>
                        Sign in
                    </button>
                </div>
            </form>
            </div>


            {/* Right side */}

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
