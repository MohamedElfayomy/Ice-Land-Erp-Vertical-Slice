const CalenderButton = () => {
    return(
        <button
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            <span>Oct 2023</span>
            <span className="material-symbols-outlined text-lg">arrow_drop_down</span>
        </button>
    )
}

export default CalenderButton