import { forwardRef } from 'react'


type Props = {
    name: string
    label: string
    options: string[]
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    error?: string
    required?: boolean
}

const SelectForm = forwardRef<HTMLSelectElement, Props>(
    ({ name, label, options, onChange, error, required, ...rest }, ref) => {
        return (
            <div className="relative">
                <select
                    {...rest}
                    ref={ref}
                    id={name}
                    name={name}
                    onChange={onChange}
                    className={`peer w-full px-4 pt-5 pb-2 pr-10 border rounded-lg focus:outline-none focus:border-blue-500
                        text-white appearance-none cursor-pointer bg-transparent
                        ${error ? "border-red-400" : "border-gray-300"}`}
                >
                    {options.map(option => (
                        <option key={option} value={option} className="bg-[#0d1520] text-white">
                            {option}
                        </option>
                    ))}
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                <label
                    htmlFor={name}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 pointer-events-none
                        peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-400
                        peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400"
                >
                    {label}
                    {required && <span className="pl-1 pb-1 text-red-500">*</span>}
                </label>

                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        )
    }
)

SelectForm.displayName = "SelectForm"

export default SelectForm