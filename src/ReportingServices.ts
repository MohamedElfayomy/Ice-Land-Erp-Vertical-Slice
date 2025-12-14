import { Account, SingleEntry, CoaType, JournalEntry, Journals } from "./models/init-models";
import { _getJournalPrimaryAccountId, getNormalBalanceCode } from "./HelperFunctions";

interface LedgerInput {
    secondary_account_id: number;
    journal_id: number;
}

interface LedgerRow{
    date: Date;
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

export async function LedgerReport(entry: LedgerInput): Promise<{
    account_id: number;
    journal_id: number;
    entries: LedgerRow[];
    ending_balance: number;
}> {
    const { secondary_account_id, journal_id } = entry;
    
    const journalEntries = await JournalEntry.findAll({
        where: {
            account_id: secondary_account_id,
            journal_id: journal_id,
        },
        include: [
            {
                model: SingleEntry,
                as: 'SingleEntry',
                attributes: ['description'],
            },
        ]
    });

    const balanceCode = await getNormalBalanceCode(secondary_account_id);

    let runningBalance = 0;
    const transactions: LedgerRow[] = journalEntries.map((entry: any) => {
        const debit = entry.debit;
        const credit = entry.credit;

        if (balanceCode === 'DEBIT') {
            runningBalance += debit - credit;
        } else {
            runningBalance += credit - debit;
        }   
        
        return {
            date: entry.createdAt,
            description: entry.SingleEntry?.description || entry.Journal?.description || '',
            debit: debit,
            credit: credit,
            balance: runningBalance,
        };
    });

    return {
        account_id: secondary_account_id,
        journal_id: journal_id,
        entries: transactions,
        ending_balance: runningBalance,
    };
}

interface MasterLedgerInput {
    account_id: number;
    journal_id: number;
}

interface MasterLedgerReportRow {
    account_name: string;
    account_number: string;
    debit_total: number;
    credit_total: number;
    ending_balance: number;


}