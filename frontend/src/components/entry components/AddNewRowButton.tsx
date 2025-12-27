const AddNewRowButton = () =>{
    return (
        <div
            className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
            <button
                className="group w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium text-sm"
                type="button">
                <span className="material-symbols-outlined transition-transform group-hover:scale-110">add_circle</span>
                Add New Row
            </button>
        </div>
    )
}

export default AddNewRowButton;