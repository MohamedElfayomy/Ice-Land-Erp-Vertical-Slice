// src/TransactionService.ts
//import e from 'express';
//import { PoolClient } from 'pg';

import sequelize from './config/sequelize';
import { Account, COAType, Journal, SingleEntry, JournalEntry } from './models/init-models';
import { Transaction } from 'sequelize';

interface SingleEntryInput {
    secondary_account_id: number;
    value: number;
    direction: 'IN' | 'OUT';
    description: string;
}

// --- Helper Functions ---

async function _getAccountType(accountId: number): Promise<string>{
    const account = await Account.findByPk(accountId, {
        include:[{
            model: COAType, 
            as: 'Type',
            attributes: ['normal_balance_code']
        }]
    });
    if (!account) throw new Error(`Account ID ${accountId} not found.`);

    return account.get('normal_balance_code') as string;
}

async function _getJournalPrimaryAccountId(journalId: number): Promise<number> {
    const journal = await Journal.findByPk(journalId);
    if (!journal) throw new Error(`Journal ID ${journalId} not found.`);

    return journal.get('primary_cash_account_id') as number;
}

async function _createSingleEntry(transaction: any, entry: SingleEntryInput, journalId: number): Promise<InstanceType<typeof SingleEntry>> {
    const singleEntry = await SingleEntry.create({
        journal_id: journalId,
        secondary_account_id: entry.secondary_account_id,
        value: entry.value,
        direction: entry.direction,
        description: entry.description
    }, { transaction });

    return singleEntry;
}

async function _postToGeneralLedger(
    transaction: any,
    entry: SingleEntryInput, 
    primaryAccountId: number,
    secondary_account_id: number,
    secondaryAccountNormalBalance: string,
    singleEntryId: number, 
    journalId: number
) {    

    let debitAccount: number = 0;; 
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
        debit: creditAccount,
        credit: debitAccount,
    }, { transaction });
    
    await JournalEntry.create({
        single_entry_id: singleEntryId,
        journal_id: journalId,
        account_id: secondary_account_id,
        debit: debitAccount,
        credit: creditAccount
    }, {transaction} );

    return {primaryAccountId, secondary_account_id};
}


// --- Main Function ---

export async function processSingleEntry(entry: SingleEntryInput, journalId: number) {
    
    // --- 1. PRE-TRANSACTION READS ---
    
    // Get the required data needed for transaction logic (read operations)
    const primaryAccountId = await _getJournalPrimaryAccountId(journalId);
    const secondaryAccountNormalBalance = await _getAccountType(entry.secondary_account_id);
    
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
            entry.secondary_account_id,
            secondaryAccountNormalBalance,
            singleEntryId,
            journalId
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