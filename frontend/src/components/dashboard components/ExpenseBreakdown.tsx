const ExpenseBreakdown = () => {
    return (
        <div
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Expense Breakdown</h3>
            <div className="flex flex-col gap-5 flex-1 justify-center">
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-200">Operations &amp; Rent</span>
                        <span className="text-slate-500 dark:text-slate-400">EGP 1,800 (52%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{width: "52%"}}></div>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-200">Office Supplies</span>
                        <span className="text-slate-500 dark:text-slate-400">EGP 850 (25%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{width: "25%"}}></div>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-200">Travel</span>
                        <span className="text-slate-500 dark:text-slate-400">EGP 455 (13%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-sky-300 h-2 rounded-full" style={{width: "13%"}}></div>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span
                            className="font-medium text-slate-700 dark:text-slate-200">Meals &amp; Entertainment</span>
                        <span className="text-slate-500 dark:text-slate-400">EGP 300 (10%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-teal-300 h-2 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                </div>
            </div>
            <button
                className="mt-6 w-full py-2 text-sm text-primary font-medium hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-dashed border-slate-300 dark:border-slate-700">
                View Full Report
            </button>
        </div>
    )
}

export default ExpenseBreakdown;