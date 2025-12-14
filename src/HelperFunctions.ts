import { get } from 'http';
import { Account, CoaType, Journals, SingleEntry, JournalEntry } from './models/init-models';
import { NUMBER, where } from 'sequelize';
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
      [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('debit')), 0), 'totalDebit'],
      [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('credit')), 0), 'totalCredit'],
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

export async function calculateEndBalance(accountId: number): Promise<number>{

  const normalBalanceCode = await getNormalBalanceCode(accountId);
  const totals = await GetBalanceSum(accountId);

  const totalCredit = totals.totalCredit;
  const totalDebit = totals.totalDebit;

  return normalBalanceCode === 'DEBIT' ? totalDebit - totalCredit : totalCredit - totalDebit;
}
