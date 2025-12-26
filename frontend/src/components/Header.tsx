const Header = () => {
    return (
        <header className="flex-none flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 z-20 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                </div>
                <div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Financial Ledger Core</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enterprise Edition</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <span className="material-symbols-outlined text-slate-400 text-sm">folder_open</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Shop Journal</span>
                    <span className="material-symbols-outlined text-slate-400 text-sm cursor-pointer hover:text-primary">expand_more</span>
                </div>
                <div className="flex items-center gap-2">
                    {["Journals", "Chart of Accounts", "Account Assignment", "User Permissions"].map((nav) => (
                        <button key={nav} className="hidden lg:block px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            {nav}
                        </button>
                    ))}
                    <button className="flex items-center justify-center size-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors ml-2">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-white dark:ring-slate-800 shadow-sm"
                        style={{backgroundImage: 'url("https://ui-avatars.com/api/?name=Admin")'}}
                    ></div>
                </div>
            </div>
        </header>
    );
};

export default Header;