interface Option {
    label: string;
    value: string;
}

interface TransactionCellProps {
    value: string | number;
    onChange: (val: any) => void;
    placeholder?: string;
    type?: string;          // 'text', 'number', 'date'
    options?: Option[];     // Providing this triggers the <select> mode
    error?: boolean;        // Triggers the red border logic
    className?: string;     // Extra container classes (width, etc.)
}

export default function TransactionCell({
                                            value,
                                            onChange,
                                            placeholder,
                                            type = "text",
                                            options,
                                            error = false,
                                            className = ""
                                        }: TransactionCellProps) {

    // TODO: Make the transaction cell text be aligned either to the left on call
    // 1. Single Source of Truth for Styling
    const baseStyles = `block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 py-1 pl-3 text-slate-700
        ${error
        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        : "border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary"
    }`;

    return (
        <td className={`px-3 py-2 ${className}`}>
            {options ? (
                /* --- Dropdown Logic --- */
                <select
                    className={`${baseStyles} py-1`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {/* Placeholder as a disabled first option */}
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                /* --- Input Logic --- */
                <input
                    type={type}
                    className={baseStyles}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </td>
    );
}