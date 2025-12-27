import currencyFormatter from "./CurrencyFormatter.tsx";

interface Props {
    label: string;
    value: number;
    icon: string;
    // We'll use a string for 'type' to allow for 'success', 'danger', or 'primary'
    type: 'success' | 'danger' | 'primary';
}

export default function StatsCard({ label, value, icon, type }: Props) {

    // Configuration for the colors based on the 'type' prop
    const colorConfigs = {
        success: {
            container: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
            text: "text-slate-900 dark:text-white"
        },
        danger: {
            container: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
            text: "text-slate-900 dark:text-white"
        },
        primary: {
            container: "bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg",
            text: "text-primary" // Net profit usually highlights the amount in primary color
        }
    };

    const config = colorConfigs[type];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {label}
                    </p>
                    <h3 className={`text-2xl font-bold mt-1 tabular-nums ${config.text}`}>
                        {currencyFormatter.format(value)}
                    </h3>
                </div>
                {/* Apply the dynamic icon container colors */}
                <div className={`p-2 rounded-lg ${config.container}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
            </div>

            {/* Keeping the empty div for spacing consistency with your HTML */}
            <div className="mt-4 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            </div>
        </div>
    );
}