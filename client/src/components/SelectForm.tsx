import React, { forwardRef } from 'react'

type Props = {
    options: { label: string; value: string }[]
    name: string
    label: string
    required?: boolean
    error?: string
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const SelectForm = forwardRef<HTMLSelectElement, Props>(
    ({ name, label, options, onChange, error, required, ...rest }, ref) => {
        return (
            <div className="flex flex-col gap-1">
                <label htmlFor={name} className="text-sm text-gray-500">
                    {label}
                    {required && <span className="pl-1 text-red-500">*</span>}
                </label>
                <select
                    {...rest}
                    ref={ref}
                    id={name}
                    name={name}
                    onChange={onChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-500 text-gray-600 ${
                        error ? "border-red-400" : "border-gray-300"
                    }`}
                >
                    <option value="">Select...</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        )
    }
)

SelectForm.displayName = "SelectForm"

export default SelectForm
