import { Account, CoaType, Journals, JournalEntry } from './models/init-models';
import sequelize from './config/sequelize';

export async function getNormalBalanceCode(accountId: number): Promise<string> {
  const account = await Account.findByPk(accountId, {
    include: [
      {
        model: CoaType,
        as: 'Type',                // Must match the alias used in belongsTo
        attributes: ['normal_balance_code'],  // Only fetch what we need
      },]          // We don't need any fields from Account itself
  });

  // If account or its type is not found, return null
  if (!account || !account.Type) {
    throw new Error(`Account ID ${accountId} or its type not found.`);
  }

  console.log(`Normal balance code for account ID ${accountId} is ${account.Type.normal_balance_code}`);
  return account.Type.normal_balance_code;
}


export async function _getJournalPrimaryAccountId(journalId: number, code: string): Promise<number> {
    const journal = await Journals.findByPk(journalId);
    if (!journal) throw new Error(`Journal ID ${journalId} not found.`);

    return journal.get('primary_cash_account_id') as number;
}

interface AccountTotals{
  totalDebit: number;
  totalCredit: number;
}

export async function GetBalanceSum(accountId: number): Promise<AccountTotals> {

   const result = await JournalEntry.findOne({
    attributes: [
      [(sequelize.fn('SUM', sequelize.col('debit'))), 'totalDebit'],
      [(sequelize.fn('SUM', sequelize.col('credit'))), 'totalCredit'],
    ],
    where: { account_id: accountId },
    raw: true,
  });

  const totals = result as AccountTotals | null;

  return {
    totalDebit: Number(totals?.totalDebit ?? 0),
    totalCredit: Number(totals?.totalCredit ?? 0)
  };
}

interface BalancesTable{
  totalDebit: number;
  totalCredit: number;
  endingBalance: number;
}

export async function calculateEndBalance(accountId: number): Promise<BalancesTable>{

  const normalBalanceCode = await getNormalBalanceCode(accountId);
  const totals = await GetBalanceSum(accountId);

  const totalCredit = totals.totalCredit;
  const totalDebit = totals.totalDebit;

  let endBalance = 0;

  if (normalBalanceCode === 'Debit'){
      endBalance = totalDebit - totalCredit;
  }
  else{
    endBalance = totalCredit - totalDebit;
  }

  return{
    totalDebit: Number(totalDebit),
    totalCredit: Number(totalCredit),
    endingBalance: Number(endBalance)
  }
}

export async function GetAccountsForReport(typeid: number): Promise< {
  account_number:number;
  account_name: string;
  account_balance: number; 
}[]> {

   const accounts =  await Account.findAll({
        where: {type_id: typeid,},
        attributes: ['id', 'account_number', 'name'],
        order: [['account_number', 'ASC']],
    });

    const rows = await Promise.all(
        accounts.map(async(account) => {
            const balances = await calculateEndBalance(account.id);

            return {
                account_number: account.account_number,
                account_name: account.name,
                account_balance: balances.endingBalance,
            };
        })
    );

    return rows;
}
