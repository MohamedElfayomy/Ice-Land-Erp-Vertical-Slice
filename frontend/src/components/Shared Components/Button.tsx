interface Props {
    label: string;
    icon: string;
    // 'primary' for the blue "New Entry" style, 'secondary' for the white border style
    variant: 'primary' | 'secondary';
    // 'onClick' allows you to pass different functions to each button
    onClick?: () => void;
}

export default function Button({ label, icon, variant, onClick }: Props) {
    // Base classes shared by ALL buttons
    const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm";

    // Dynamic classes based on the variant prop
    const variantClasses = variant === 'primary'
        ? "bg-blue-700/90 text-white shadow-md hover:bg-blue-600 font-bold"
        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium shadow-sm";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses}`}
        >
            <span className="material-symbols-outlined text-lg">{icon}</span>
            <span>{label}</span>
        </button>
    );
}

