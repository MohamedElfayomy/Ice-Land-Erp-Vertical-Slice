import TransactionCell from "./TransactionCell.tsx";

interface TransactionRowProps {
    entry: {
        date: string;
        type: string;
        account: string;      // This must exist here
        description: string;
        amount: number;
    };
    onUpdate: (field: string, value: any) => void; // This must exist here
}

//TODO: Change all the td into Transaction Cells
const TransactionRow = ({entry, onUpdate}: TransactionRowProps) =>{
    return (
        <tr className="group bg-slate-50 hover:bg-slate-100/75 dark:hover:bg-slate-800 transition-colors">
            <td className="px-3 py-2 text-center align-middle">
                <span
                    className="block size-2.5 rounded-full border border-slate-300 dark:border-slate-600 mx-auto"></span>
            </td>
            <td className="px-3 py-2">
                <input
                    className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 pl-3"
                    type="date"/>
            </td>

            {/*<td className="px-3 py-2">
                <select
                    className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 py-1 pl-3 text-slate-700">
                    <option disabled={true} selected={true}>Type...</option>
                    <option>Expense</option>
                    <option>Income</option>
                    <option>Transfer</option>
                </select>*/}

                <TransactionCell
                    value={entry.account}
                    placeholder="Type"
                    options={[
                        { label: "Travel", value: "travel" },
                        { label: "Utilities", value: "utilities" }
                    ]}
                    onChange={(val) => onUpdate('account', val)}
                />
            {/*</td>*/}
            <td className="px-3 py-2">
                <select
                    className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 py-1 pl-3 text-slate-700">
                    <option disabled={true} selected={true}>Account...</option>
                    <option>Office Supplies</option>
                    <option>Travel</option>
                    <option>Utilities</option>
                </select>
            </td>
            <td className="px-3 py-2">
                <input
                    className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 pl-3 placeholder-slate-700"
                    placeholder="Description" type="text"/>
            </td>
            {/*<td className="px-3 py-2">
                <div className="relative">
                    <span
                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400">$</span>
                    <input
                        className="block w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm h-9 pl-6 text-right font-mono"
                        placeholder="0.00" type="number"/>
                </div>
            </td>*/}

            <TransactionCell
                value={entry.amount}
                placeholder="0.00"
                onChange={(val) => onUpdate('amount', val)}
                />
            <td className="px-3 py-2 text-center">
                <div
                    className="flex items-center justify-center gap-1 opacity-100 sm:opacity-70 sm:group-hover:opacity-100 transition-opacity">
                    <button className="text-slate-400 hover:text-slate-500 transition-colors p-1" title="Duplicate Row">
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                    </button>
                    <button className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Delete Row">
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default TransactionRow;