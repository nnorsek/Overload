import React, { useState, forwardRef } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

type Props = {
    name: string
    type: string
    label: string
    textColor?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
    required?: boolean
}

const InputForm = forwardRef<HTMLInputElement, Props>(
    ({ name, type, label, onChange, error, required, textColor, ...rest }, ref) => {
        const [showPassword, setShowPassword] = useState(false)
        const isPassword = type === "password"
        const inputType = isPassword ? (showPassword ? "text" : "password") : type

        return (
            <div className="relative">

                    <input
                    {...rest}
                    ref={ref}
                    type={inputType}
                    name={name}
                    id={name}
                    onChange={onChange}
                    placeholder=" "
                    className={`peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:border-blue-500 ${textColor} ${
                        error ? "border-red-400" : "border-gray-300"
                    }`}
                />
                {isPassword && (
                    <span
                        className="absolute right-3 top-4 cursor-pointer text-gray-400"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                    </span>
                )}
                <label
                    htmlFor={name}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-base transition-all duration-200 pointer-events-none
                        peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-500
                        peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
                >
                    {label}
                    {required && (
                        <span className="pl-1 pb-1 text-red-500">*</span>
                    )}
                </label>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        )
    }
)

InputForm.displayName = "InputForm"

export default InputForm
