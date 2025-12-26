interface StatCardProps {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: string;
}

export default function StatCard({ label, value, change, isPositive, icon }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all hover:shadow-lg hover:border-primary/20 group">
            <div className="flex justify-between items-start mb-5">
                {/* Softer Icon Container */}
                <div className="size-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">{icon}</span>
                </div>

                {/* Trending Badge with smaller text */}
                <div className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-full ${
                    isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
          <span className="material-symbols-outlined text-[14px]">
            {isPositive ? 'trending_up' : 'trending_down'}
          </span>
                    {change}
                </div>
            </div>

            <div>
                <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 tabular-nums">{value}</h3>
            </div>
        </div>
    );
}