import Summary from "../components/entry components/Summary.tsx";
import TransactionTable from "../components/entry components/TransactionTable.tsx";
import AddNewRowButton from "../components/entry components/AddNewRowButton.tsx";
import TransactionTableHeader from "../components/entry components/TransactionTableHeader.tsx";
import EntryTitle from "../components/entry components/EntryTitle.tsx";

function Entry() {
    return (
        <main className="flex-1 flex flex-col overflow-y-auto relative bg-background-light dark:bg-background-dark">
            <div className="p-4 md:p-8 flex justify-center">
                <div className="w-full max-w-360 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex items-center gap-2">
                        <EntryTitle/>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
                        {/*Table Header*/}
                        <TransactionTableHeader/>
                        {/*Table*/}
                        <TransactionTable/>
                         {/*Add row component*/}
                        <AddNewRowButton/>
                        {/*Table Footer Summary*/}
                        <Summary/>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Entry;