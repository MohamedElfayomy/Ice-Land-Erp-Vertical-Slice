import { Account, CoaType, Journals, SingleEntry, JournalEntry } from './models/init-models';

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


export async function _getJournalPrimaryAccountId(journalId: number): Promise<number> {
    const journal = await Journals.findByPk(journalId);
    if (!journal) throw new Error(`Journal ID ${journalId} not found.`);

    return journal.get('primary_cash_account_id') as number;
}
