import CashOnHand from "../components/dashboard components/CashOnHand.tsx";
import JournalTable from "../components/dashboard components/JournalTable.tsx";
import StatsCard from "../components/dashboard components/StatsCard.tsx";
import Button from "../components/Shared Components/Button.tsx";
import CalenderButton from "../components/dashboard components/CalenderButton.tsx";
import ExpenseBreakdown from "../components/dashboard components/ExpenseBreakdown.tsx";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    return (

            <main className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                            Overview of your financial status
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">

                        <CalenderButton />
                        {/* 1. The Primary Button (New Entry) */}
                        <Button
                            label="Master Ledger"
                            icon="menu_book"
                            variant="secondary"
                            />
                        <Button
                            label="P&L Statement"
                            icon="insert_chart"
                            variant="secondary"
                        />
                        <Button
                            label="Balance Sheet"
                            icon="account_balance"
                            variant="secondary"
                        />
                        <Button
                            label="New Entry"
                            icon="add"
                            variant="primary"
                            onClick={() => navigate('/Entry')}
                        />
                    </div>
                </div>


                {/* Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/*Cash On Hand Wdiget*/}
                    <CashOnHand
                        value={3000}/>

                    {/* Income (Green/Success) */}
                    <StatsCard
                        label="Total Income"
                        value={8250.50}
                        icon="trending_up"
                        type="success"
                    />

                    {/* Expenses (Red/Danger) */}
                    <StatsCard
                        label="Expenses"
                        value={3405.00}
                        icon="trending_down"
                        type="danger"
                    />

                    {/* Net Profit (Blue/Primary) */}
                    <StatsCard
                        label="Net Profit"
                        value={4845.50}
                        icon="savings"
                        type="primary"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div
                        className="lg:col-span-2">
                        <JournalTable/>
                    </div>
                        <ExpenseBreakdown/>
                </div>
            </main>
    );
}

export default Dashboard;