import { Account, COAType, Journal, SingleEntry, JournalEntry } from './models/init-models';

export async function _getNormalBalanceCode(accountId: number): Promise<string>{
    console.log('Fetching normal balance for Account ID:', accountId);
    const account = await Account.findByPk(accountId, {
        include:[{
            model: COAType, 
            as: 'Type',
            attributes: ['normal_balance_code'],
            foreignKey: 'type_id'
        }]
    });
    if (!account) throw new Error(`Account ID ${accountId} not found.`);

    console.log('Account fetched:', account.toJSON());

    const coaType = account.get('Type') as any;
    if (!coaType) throw new Error(`COA Type for Account ID ${accountId} not found.`);

    const balanceCode = coaType.get('normal_balance_code') as string; 
    
    console.log('Normal Balance Code fetched:', balanceCode);
    return balanceCode;
}


export async function _getJournalPrimaryAccountId(journalId: number): Promise<number> {
    const journal = await Journal.findByPk(journalId);
    if (!journal) throw new Error(`Journal ID ${journalId} not found.`);

    return journal.get('primary_cash_account_id') as number;
}