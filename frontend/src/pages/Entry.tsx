import Summary from "../components/entry components/Summary.tsx";

function Entry() {
    return (
        <main className="flex-1 flex flex-col overflow-y-auto relative bg-background-light dark:bg-background-dark">
            <div className="p-4 md:p-8 flex justify-center">
                <div className="w-full max-w-[90rem] flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Transactions Entry</h1>
                            <div className="flex items-center gap-2 text-primary font-medium text-sm">
                                <span className="size-2 rounded-full bg-indigo-500"></span>
                                Active: Shop Journal
                            </div>
                        </div>
                        <div className="flex items-center gap-2">

                        </div>
                    </div>
                    <div
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
                        <div
                            className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Batch
                                    Transactions</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Enter multiple rows of
                                    financial data. Review before submitting.</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-3">


                            </div>
                        </div>
                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead
                                    className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold border-b border-slate-200 dark:border-slate-800">
                                <tr>

                                    <th className="px-3 py-3 w-40" scope="col">Date</th>
                                    <th className="px-3 py-3 w-36" scope="col">Type</th>
                                    <th className="px-3 py-3 w-48" scope="col">Account</th>
                                    <th className="px-3 py-3 min-w-[200px]" scope="col">Description</th>
                                    <th className="px-3 py-3 w-32 text-right" scope="col">Amount</th>
                                    <th className="px-3 py-3 w-25 text-center" scope="col">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr className="bg-emerald-50/40 dark:bg-emerald-900/10 group hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20 transition-colors">

                                    <td className="px-3 py-2">
                                        <input
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm h-9"
                                            type="date" value="2023-10-24"/>
                                    </td>
                                    <td className="px-3 py-2">
                                        <select
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm h-9 py-1">
                                            <option selected={true}>Expense</option>
                                            <option>Income</option>
                                            <option>Transfer</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-2">
                                        <select
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm h-9 py-1">
                                            <option selected={true}>Office Supplies</option>
                                            <option>Travel</option>
                                            <option>Utilities</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm h-9 placeholder-slate-400"
                                            type="text" value="Paper ream x50"/>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="relative">
                                            <span
                                                className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400">$</span>
                                            <input
                                                className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm h-9 pl-6 text-right font-mono"
                                                type="number" value="45.00"/>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <div
                                            className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-slate-400 hover:text-primary transition-colors p-1"
                                                    title="Duplicate Row">
                                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                            </button>
                                            <button className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    title="Delete Row">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">

                                    <td className="px-3 py-2">
                                        <input
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9"
                                            type="date" value="2023-10-25"/>
                                    </td>
                                    <td className="px-3 py-2">
                                        <select
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 py-1">
                                            <option>Expense</option>
                                            <option selected={true}>Income</option>
                                            <option>Transfer</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-2">
                                        <select
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 py-1">
                                            <option>Consulting</option>
                                            <option selected={true}>Services Revenue</option>
                                            <option>Other Income</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 placeholder-slate-400"
                                            placeholder="Description" type="text" value="Q4 Retainer"/>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="relative">
                                            <span
                                                className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400">$</span>
                                            <input
                                                className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 pl-6 text-right font-mono"
                                                placeholder="0.00" type="number" value="1200.00"/>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <div
                                            className="flex items-center justify-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button className="text-slate-400 hover:text-primary transition-colors p-1"
                                                    title="Duplicate Row">
                                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                            </button>
                                            <button className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    title="Delete Row">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="bg-red-50/40 dark:bg-red-900/10 group hover:bg-red-50/60 dark:hover:bg-red-900/20 transition-colors">

                                    <td className="px-3 py-2">
                                        <input
                                            className="block w-full rounded border-red-300 dark:border-red-800/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-red-500 focus:ring-red-500 sm:text-sm h-9"
                                            type="date" value="2023-10-25"/>
                                    </td>
                                    <td className="px-3 py-2">
                                        <select
                                            className="block w-full rounded border-red-300 dark:border-red-800/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-red-500 focus:ring-red-500 sm:text-sm h-9 py-1">
                                            <option selected={true}>Expense</option>
                                            <option>Income</option>
                                            <option>Transfer</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-2">
                                        <select
                                            className="block w-full rounded border-red-300 dark:border-red-800/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-red-500 focus:ring-red-500 sm:text-sm h-9 py-1">
                                            <option>Travel</option>
                                            <option selected={true}>Select Account...</option>
                                            <option>Utilities</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            className="block w-full rounded border-red-300 dark:border-red-800/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-red-500 focus:ring-red-500 sm:text-sm h-9 placeholder-slate-400"
                                            type="text" value="Client Dinner"/>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="relative">
                                            <span
                                                className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400">$</span>
                                            <input
                                                className="block w-full rounded border-red-300 dark:border-red-800/50 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 focus:border-red-500 focus:ring-red-500 sm:text-sm h-9 pl-6 text-right font-mono font-medium"
                                                type="number" value="-50.00"/>

                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <div
                                            className="flex items-center justify-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button className="text-slate-400 hover:text-primary transition-colors p-1"
                                                    title="Duplicate Row">
                                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                            </button>
                                            <button className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    title="Delete Row">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">

                                    <td className="px-3 py-2">
                                        <input
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9"
                                            type="date"/>
                                    </td>
                                    <td className="px-3 py-2">
                                        <select
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 py-1 text-slate-500">
                                            <option disabled={true} selected={true}>Type...</option>
                                            <option>Expense</option>
                                            <option>Income</option>
                                            <option>Transfer</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-2">
                                        <select
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 py-1 text-slate-500">
                                            <option disabled={true} selected={true}>Account...</option>
                                            <option>Office Supplies</option>
                                            <option>Travel</option>
                                            <option>Utilities</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 placeholder-slate-400"
                                            placeholder="Description" type="text"/>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="relative">
                                            <span
                                                className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400">$</span>
                                            <input
                                                className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 pl-6 text-right font-mono"
                                                placeholder="0.00" type="number"/>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <div
                                            className="flex items-center justify-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button className="text-slate-400 hover:text-primary transition-colors p-1"
                                                    title="Duplicate Row">
                                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                            </button>
                                            <button className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    title="Delete Row">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                            <button
                                className="group w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium text-sm"
                                type="button">
                                <span
                                    className="material-symbols-outlined transition-transform group-hover:scale-110">add_circle</span>
                                Add New Row
                            </button>
                        </div>
                        <Summary/>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Entry;