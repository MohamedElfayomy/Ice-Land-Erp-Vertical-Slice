import { Account, SingleEntry, JournalEntry } from "../models/init-models";
import { _getJournalPrimaryAccountId, getNormalBalanceCode, calculateEndBalance, GetAccountsForReport } from "./HelperFunctions";

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

interface AccountRow{
    account_number: number;
    account_name: string;
    account_balance: number;
}

interface ProfitLossReport{
    income_accounts: AccountRow[];
    expenses_accounts: AccountRow[];
    incomes_total: number;
    expenses_total: number;
    net_profit: number;
}

interface BalanceSheetReport{
    assets_accounts: AccountRow[];
    liabilities_accounts: AccountRow[];
    assets_total: number;
    liabilities_total: number;
    equity: number;
}


export async function ViewPLStatement(): Promise<ProfitLossReport>{

    const incomeAccounts = await GetAccountsForReport(4);
    const expenseAccounts = await GetAccountsForReport(3);

    const totalIncome = incomeAccounts.reduce((sum: number, acc: { account_balance: number}) => sum + acc.account_balance, 0);
    const totalExpense = expenseAccounts.reduce((sum: number, acc: { account_balance: number}) => sum + acc.account_balance, 0);
    const netProfit = totalIncome - totalExpense;


    return{
        income_accounts: incomeAccounts,
        expenses_accounts: expenseAccounts,
        incomes_total: totalIncome,
        expenses_total: totalExpense,
        net_profit: netProfit
    }
}

export async function ViewBalanceSheet(): Promise<BalanceSheetReport>{

    const assetsAccounts = await GetAccountsForReport(1);
    const liabilityAccounts = await GetAccountsForReport(2);

    const totalAssets = assetsAccounts.reduce((sum: number, acc: { account_balance: number}) => sum + acc.account_balance, 0);
    const totalLiabilities = liabilityAccounts.reduce((sum: number, acc: { account_balance: number}) => sum + acc.account_balance, 0);
    const equity = totalAssets - totalLiabilities;

    return{
        assets_accounts: assetsAccounts,
        liabilities_accounts: liabilityAccounts,
        assets_total: totalAssets,
        liabilities_total: totalLiabilities,
        equity: equity
    }
}

