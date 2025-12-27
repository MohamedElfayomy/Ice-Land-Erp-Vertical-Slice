import CurrencyFormatter from './CurrencyFormatter.tsx';

interface Props {
    value: number;
}

export default function CashOnHand({value}: Props) {
    return (
        <div
            className="bg-linear-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div
                className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl">account_balance</span>
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1 text-slate-300">
                    <span className="material-symbols-outlined text-lg">payments</span>
                    <span className="text-sm font-medium uppercase tracking-wider">Cash on Hand</span>
                </div>
                <div className="text-3xl font-bold font-mono tracking-tight">{CurrencyFormatter.format(value)}</div>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                    {/*<span
                                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">+12%</span>
                                <span className="text-slate-400">vs last month</span>*/}
                </div>
            </div>
        </div>
    );
}