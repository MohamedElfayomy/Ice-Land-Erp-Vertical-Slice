import CurrencyFormatter from "../dashboard components/CurrencyFormatter.tsx";
import Button from "../Shared Components/Button.tsx";

const Summary = () => {

    return(
        <div
            className="bg-white dark:bg-slate-950 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 w-full md:w-auto text-sm">
                <div className="flex flex-col">
                                    <span
                                        className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Row Count</span>
                    <span
                        className="font-mono font-medium text-slate-900 dark:text-white text-lg">4</span>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                <div className="flex flex-col">
                                    <span
                                        className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Total Amount</span>
                    <span
                        className="font-mono font-bold text-slate-900 dark:text-white text-lg">{CurrencyFormatter.format(1195)}</span>
                </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">

                <Button label={"Save Draft"} icon={""} variant={"secondary"}/>
                <Button label={"Submit Transaction"} icon={"publish"} variant={"primary"}/>
            </div>
        </div>
    )
}

export default Summary;

