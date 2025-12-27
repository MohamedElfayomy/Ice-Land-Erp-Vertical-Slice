//import CurrencyFormatter from "./CurrencyFormatter.tsx";

const transactions = [
    { id: 'TX-9021', date: 'Dec 24, 2025', desc: 'Inventory Restock - Ice Cream', category: 'Supplies', amount: '-1,200.00', status: 'Completed' },
    { id: 'TX-9022', date: 'Dec 25, 2025', desc: 'Daily Sales - Branch A', category: 'Revenue', amount: '+4,550.00', status: 'Processing' },
    { id: 'TX-9023', date: 'Dec 26, 2025', desc: 'Electricity Bill - Q4', category: 'Utilities', amount: '-850.00', status: 'Completed' },
];

export default function JournalTable() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Recent Transactions</h3>
                <button className="text-primary text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-slate-400">{t.id}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{t.date}</td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-800">{t.desc}</td>
                            <td className={`px-6 py-4 text-sm font-bold ${t.amount.startsWith('+') ? 'text-green-600' : 'text-slate-900'}`}>
                                {t.amount}
                            </td>
                            <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      t.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {t.status}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}