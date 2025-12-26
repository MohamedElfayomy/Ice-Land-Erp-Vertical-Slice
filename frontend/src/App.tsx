import Header from "./components/Header";
import StatCard from "./components/StatCard";
import JournalTable from "./components/JournalTable";

function App() {
    return (
        <div className="min-h-screen bg-[#f6f7f8] font-display antialiased text-slate-900">
            <Header />

            <main className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                            Overview of your financial status
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-lg">calendar_today</span>
                            <span>Oct 2023</span>
                            <span className="material-symbols-outlined text-lg">arrow_drop_down</span>
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-lg">menu_book</span>
                            <span>Master Ledger</span>
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-lg">insert_chart</span>
                            <span>P&amp;L Statement</span>
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-lg">account_balance</span>
                            <span>Balance Sheet</span>
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm font-bold">
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span>New Entry</span>
                        </button>
                    </div>
                </div>


                {/* Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/*Cash On Hand Wdiget*/}
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
                            <div className="text-3xl font-bold font-mono tracking-tight">$24,592.00</div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                                <span
                                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">+12%</span>
                                <span className="text-slate-400">vs last month</span>
                            </div>
                        </div>
                    </div>

                    <div                        // Total income widget
                        className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total
                                    Income</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$8,250.50</h3>
                            </div>
                            <div
                                className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <span className="material-symbols-outlined">trending_up</span>
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: "75%"}}></div>
                        </div>
                    </div>
                    <div

                        //expenses widget
                        className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Expenses</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$3,405.00</h3>
                            </div>
                            <div
                                className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600 dark:text-rose-400">
                                <span className="material-symbols-outlined">trending_down</span>
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-rose-500 h-1.5 rounded-full" style={{width: "45%"}}></div>
                        </div>
                    </div>
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net
                                    Profit</p>
                                <h3 className="text-2xl font-bold text-primary mt-1">$4,845.50</h3>
                            </div>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                                <span className="material-symbols-outlined">savings</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined text-base text-emerald-500">arrow_upward</span>
                            <span className="font-medium text-emerald-500">5.2%</span>
                            <span>margin increase</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div
                        className="lg:col-span-2">
                        <JournalTable/>
                    </div>
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Expense Breakdown</h3>
                        <div className="flex flex-col gap-5 flex-1 justify-center">
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span
                                        className="font-medium text-slate-700 dark:text-slate-200">Operations &amp; Rent</span>
                                    <span className="text-slate-500 dark:text-slate-400">$1,800 (52%)</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                    <div className="bg-indigo-500 h-2 rounded-full" style={{width: "52%"}}></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span
                                        className="font-medium text-slate-700 dark:text-slate-200">Office Supplies</span>
                                    <span className="text-slate-500 dark:text-slate-400">$850 (25%)</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                    <div className="bg-blue-400 h-2 rounded-full" style={{width: "25%"}}></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700 dark:text-slate-200">Travel</span>
                                    <span className="text-slate-500 dark:text-slate-400">$455 (13%)</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                    <div className="bg-sky-300 h-2 rounded-full" style={{width: "13%"}}></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span
                                        className="font-medium text-slate-700 dark:text-slate-200">Meals &amp; Entertainment</span>
                                    <span className="text-slate-500 dark:text-slate-400">$300 (10%)</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                    <div className="bg-teal-300 h-2 rounded-full" style={{width: "10%"}}></div>
                                </div>
                            </div>
                        </div>
                        <button
                            className="mt-6 w-full py-2 text-sm text-primary font-medium hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-dashed border-slate-300 dark:border-slate-700">
                            View Full Report
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;