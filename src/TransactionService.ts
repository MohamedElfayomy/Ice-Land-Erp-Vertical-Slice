import sequelize from './config/sequelize';
import { SingleEntry, JournalEntry, Journals, Account, JournalAccounts } from './models/init-models' // Adjust the import path as necessary
import { Op, Transaction } from 'sequelize';
import { getNormalBalanceCode, calculateEndBalance, GetAccountsForReport, findIdFromName } from './HelperFunctions' // Adjust the import path as necessary

interface SingleEntryInput {
    account_name: string;
    value: number;
    direction: 'IN' | 'OUT';
    description: string;
}

async function _createSingleEntry(transaction: Transaction, entry: SingleEntryInput, journalId: number): Promise<InstanceType<typeof SingleEntry>> {

    const id = await findIdFromName(entry.account_name, Account);

    const r =  await SingleEntry.create({
        journal_id: journalId,
        secondary_account_id: id,
        value: entry.value,
        direction: entry.direction,
        description: entry.description
    }, { transaction });

    return r;
}

async function _postToGeneralLedger(
    transaction: Transaction,
    entry: SingleEntryInput,
    primaryAccountId: number,
    secondary_account_id: number,
    secondaryAccountNormalBalance: string,
    singleEntryId: number,
    journalId: number,
    description?: string
) {

    let debitAccount: number = 0;
    let creditAccount: number = 0;

    if (entry.direction === 'IN') {
        (secondaryAccountNormalBalance === 'DEBIT') ?
            (debitAccount = entry.value, creditAccount = 0) :
            (debitAccount = 0, creditAccount = entry.value);
    } else if (entry.direction === 'OUT') {
        (secondaryAccountNormalBalance === 'DEBIT') ?
            (debitAccount = 0, creditAccount = entry.value) :
            (debitAccount = entry.value, creditAccount = 0);
    } else {
        throw new Error('Invalid transaction direction specified.');
    }

    await JournalEntry.create({
        single_entry_id: singleEntryId,
        journal_id: journalId,
        account_id: primaryAccountId,
        description: entry.description,
        debit: creditAccount,
        credit: debitAccount,
    }, { transaction });

    await JournalEntry.create({
        single_entry_id: singleEntryId,
        journal_id: journalId,
        account_id: secondary_account_id,
        description: entry.description,
        debit: debitAccount,
        credit: creditAccount
    }, { transaction} );

    return { primaryAccountId, secondary_account_id };
}

// --- Main Function ---
export async function processSingleEntry(entry: SingleEntryInput, journalId: number) {

    // Extract the account_id from the input or determine it dynamically
    const accountId = entry.account_name ? await findIdFromName(entry.account_name, Account) : null;

    if (!accountId) {
        throw new Error('Invalid account name provided.');
    }

    // --- 1. PRE-TRANSACTION READS ---

    // Validate that the specific account_id is linked to the given journal_id
    const journalAccount = await JournalAccounts.findOne({
        where: {
            journal_id: journalId,
            account_id: accountId
        }
    });

    if (!journalAccount) {
        throw new Error(`Account ID ${accountId} is not linked to Journal ID ${journalId}.`);
    }

    // Get the required data needed for transaction logic (read operations)
    const primaryAccountId = await Journals.findByPk(journalId).then(journal => {
        if (!journal) throw new Error(`Journal ID ${journalId} not found.`);
        return journal.get('primary_cash_account_id') as number;
    });

    const secondaryAccountNormalBalance = await getNormalBalanceCode(accountId);

    // Initialize the transaction variable
    let t: Transaction;

    try {
        // BEGIN: Start the transaction session
        t = await sequelize.transaction();

        // --- CORE TRANSACTION WRITES ---
        const singleEntryRecord = await _createSingleEntry(t, entry, journalId);

        const singleEntryId = singleEntryRecord.get('id') as number;

        // Post the Debit/Credit Journal Entries (The Double Entry)
        const ledgerResult = await _postToGeneralLedger(
            t,
            entry,
            primaryAccountId,
            accountId, // Use the extracted account_id
            secondaryAccountNormalBalance,
            singleEntryId,
            journalId,
            entry.description
        );

        // COMMIT: If all database operations were successful, commit the changes.
        await t.commit();

        return {
            single_entry_id: singleEntryId,
            status: 'Committed',
            // ... return other details ...
        };

    } catch (error) {
        // ROLLBACK: If any error occurred during the transaction, roll back all changes.
        if (t!) { // Check if the transaction object was successfully created
            await t.rollback();
        }

        // Re-throw the error so the API can return a 500 status.
        throw error;
    }
}