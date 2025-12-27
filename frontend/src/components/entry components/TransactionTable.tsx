import TransactionRow from "./TransactionRow.tsx";

//TODO: Use useStates to make the rows respond to type errors
const TransactionTable = () => {
    return (
        <table className="w-full text-left text-sm whitespace-nowrap">
            <thead
                className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
                <th className="px-3 py-3 w-10 text-center" scope="col">Status</th>
                <th className="px-3 py-3 w-40" scope="col">Date</th>
                <th className="px-3 py-3 w-36" scope="col">Type</th>
                <th className="px-3 py-3 w-48" scope="col">Account</th>
                <th className="px-3 py-3 min-w-[200px]" scope="col">Description</th>
                <th className="px-3 py-3 w-32 text-right" scope="col">Amount</th>
                <th className="px-3 py-3 w-20 text-center" scope="col">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* 1. Normal Row Check */}
            <TransactionRow
                entry={{
                date: "2023-10-24",
                type: "Expense",
                account: "",
                description: "Flight to London",
                amount: -450.00
                }}
                onUpdate={(f, v) => console.log(f, v)}
                />
            </tbody>
        </table>
    )
}

export default TransactionTable;