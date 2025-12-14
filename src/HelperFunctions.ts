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

export async function calculateBalance(accountId: number, code: 'debit' | 'credit'): Promise<number> {

  let balance = 0;

    balance = await JournalEntry.sum(code, {
      where: {
        id: accountId,
      },
    });

return balance;
}

export async function calculateEndBalance(accountId: number): Promise<number>{
  let endBalance = 0;
  const normalBalanceCode = await getNormalBalanceCode(accountId);

  if (normalBalanceCode === 'DEBIT')
  {
    endBalance = await calculateBalance(accountId, 'debit') - await calculateBalance(accountId, 'credit');
  }
  else{
    endBalance = await calculateBalance(accountId, 'credit') - await calculateBalance(accountId, 'debit')
  }

  return endBalance;
}
