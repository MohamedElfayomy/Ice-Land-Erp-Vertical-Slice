// src/TransactionService.ts
import e from 'express';
import db from './db';
import { PoolClient } from 'pg';

interface SingleEntryInput {
    secondary_account_id: number;
    value: number;
    direction: 'IN' | 'OUT';
    description: string;
}

// --- Helper Functions ---

async function _getAccountType(client: PoolClient, accountId: number): Promise<string>{
    const res = await client.query(
        'SELECT T.normal_balance_code FROM accounts A JOIN coa_types T ON A.type_id = T.id WHERE A.id = $1',
        [accountId]
    );
    if (res.rows.length === 0) throw new Error(`Account ID ${accountId} not found or has no linked type.`);
    return res.rows[0].normal_balance_code;
}

async function _getJournalAssetId(client: PoolClient, journalId: number): Promise<number> {
    const res = await client.query('SELECT primary_cash_account_id FROM journals WHERE id = $1', [journalId]);
    if (res.rows.length === 0) throw new Error(`Journal ID ${journalId} not found.`);
    return res.rows[0].primary_cash_account_id;
}

async function _createSingleEntry(client: PoolClient, entry: SingleEntryInput, journalId: number): Promise<number> {
    const res = await client.query(
        `INSERT INTO single_entries (journal_id, secondary_account_id, value, direction, description) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [journalId, entry.secondary_account_id, entry.value, entry.direction, entry.description]
    );
    return res.rows[0].id;
}

async function _postToGeneralLedger(
    client: PoolClient, 
    entry: SingleEntryInput, 
    primaryAccountId: number, 
    secondaryAccountNormalBalance: string,
    singleEntryId: number, 
    journalId: number
) {    

    let debitAccount: number; 
    let creditAccount: number;

    const CASH_ACCOUNT_ID = primaryAccountId;
    const SECONDARY_ACCOUNT_ID = entry.secondary_account_id;

    if (entry.direction === 'IN') {
        debitAccount = CASH_ACCOUNT_ID;
        creditAccount = SECONDARY_ACCOUNT_ID;
    }
    else if (entry.direction === 'OUT') {
        creditAccount = CASH_ACCOUNT_ID;
        debitAccount = SECONDARY_ACCOUNT_ID;
    }
    else {
        throw new Error('Invalid transaction direction specified.');
    }

    const query = `INSERT INTO journal_entries (single_entry_id, journal_id, account_id, debit, credit) VALUES ($1, $2, $3, $4, $5)`;
    await client.query(query, [singleEntryId, journalId, debitAccount, entry.value, 0]);
    await client.query(query, [singleEntryId, journalId, creditAccount, 0, entry.value]);

    return {debitAccount, creditAccount};
}

// --- Main Function ---
// Replace the old processSingleEntry function with this one

export async function processSingleEntry(entry: SingleEntryInput, journalId: number) {
    const client = await db.getClient();
    
    try {
        await client.query('BEGIN');

        // I. Lookups
        const primaryAccountId = await _getJournalAssetId(client, journalId);
        // NEW LOOKUP: Get the normal balance type of the secondary account
        const secondaryAccountNormalBalance = await _getAccountType(client, entry.secondary_account_id);

        // II. Audit
        const singleEntryId = await _createSingleEntry(client, entry, journalId);
        
        // III. Posting
        await _postToGeneralLedger(
            client, 
            entry, 
            primaryAccountId, 
            secondaryAccountNormalBalance, // <--- PASS THE TYPE
            singleEntryId, 
            journalId
        );
        
        await client.query('COMMIT');
        
        return { status: 'SUCCESS', singleEntryId };

    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}