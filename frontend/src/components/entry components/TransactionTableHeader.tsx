const TransactionTableHeader = () => (
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
)

export default TransactionTableHeader;