import { Account, SingleEntry, CoaType, JournalEntry, Journals } from "./models/init-models";
import { _getJournalPrimaryAccountId, getNormalBalanceCode, GetBalanceSum, calculateEndBalance, GetAccountsForReport } from "./HelperFunctions";
import { getAccountBalance } from "./LedgerService";

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


        if (balanceCode === 'Debit') {
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

interface MasterLedgerRow {
  account_name: string;
  account_number: number;
  total_debit: number;
  total_credit: number;
  ending_balance: number;
}

export async function getMasterLedger(): Promise<MasterLedgerRow[]> {
  // 1. Get all accounts from database
  const accounts = await Account.findAll();

  // 2. For each account, get totals and calculate balance
  const ledgerRows = await Promise.all(
    accounts.map(async (account) => {


      // Use your helper to get final balance
      const { totalDebit, totalCredit, endingBalance} = await calculateEndBalance(account.id);

      return {
        account_number: account.account_number,
        account_name: account.name,
        total_debit: totalDebit,
        total_credit: totalCredit,
        ending_balance: endingBalance,
      };
    })
  );

    console.log('master ledger get completed!');

  // 3. Optional: sort by account number (standard in accounting)
  return ledgerRows.sort((a, b) => a.account_number - b.account_number);

}

interface PLAccountRow{
    account_number: number;
    account_name: string;
    account_balance: number;
}

interface PlStatement{
    income_accounts: PLAccountRow[];
    expense_accounts: PLAccountRow[];
    total_income: number;
    total_expense: number;
    net_profit: number;
}

export async function ViewPLStatement(): Promise<PlStatement>{

    const incomeAccounts = await GetAccountsForReport(6);
    const expenseAccounts = await GetAccountsForReport(4);

    const totalIncome = incomeAccounts.reduce((sum, acc) => sum + acc.account_balance, 0);
    const totalExpense = expenseAccounts.reduce((sum, acc) => sum + acc.account_balance, 0);
    const netProfit = totalIncome - totalExpense;


    return{
        income_accounts: incomeAccounts,
        expense_accounts: expenseAccounts,
        total_income: totalIncome,
        total_expense: totalExpense,
        net_profit: netProfit
    }
}

