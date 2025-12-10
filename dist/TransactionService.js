"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSingleEntry = void 0;
const db_1 = __importDefault(require("./db"));
// --- Helper Functions ---
async function _getAccountType(client, accountId) {
    const res = await client.query('SELECT T.normal_balance_code FROM accounts A JOIN coa_types T ON A.type_id = T.id WHERE A.id = $1', [accountId]);
    if (res.rows.length === 0)
        throw new Error(`Account ID ${accountId} not found or has no linked type.`);
    return res.rows[0].normal_balance_code;
}
async function _getJournalAssetId(client, journalId) {
    const res = await client.query('SELECT primary_cash_account_id FROM journals WHERE id = $1', [journalId]);
    if (res.rows.length === 0)
        throw new Error(`Journal ID ${journalId} not found.`);
    return res.rows[0].primary_cash_account_id;
}
async function _createSingleEntry(client, entry, journalId) {
    const res = await client.query(`INSERT INTO single_entries (journal_id, secondary_account_id, value, direction, description) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`, [journalId, entry.secondary_account_id, entry.value, entry.direction, entry.description]);
    return res.rows[0].id;
}
async function _postToGeneralLedger(client, entry, primaryAccountId, secondaryAccountNormalBalance, singleEntryId, journalId) {
    let debitAccount;
    let creditAccount;
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
    return { debitAccount, creditAccount };
}
// --- Main Function ---
// Replace the old processSingleEntry function with this one
async function processSingleEntry(entry, journalId) {
    const client = await db_1.default.getClient();
    try {
        await client.query('BEGIN');
        // I. Lookups
        const primaryAccountId = await _getJournalAssetId(client, journalId);
        // NEW LOOKUP: Get the normal balance type of the secondary account
        const secondaryAccountNormalBalance = await _getAccountType(client, entry.secondary_account_id);
        // II. Audit
        const singleEntryId = await _createSingleEntry(client, entry, journalId);
        // III. Posting
        await _postToGeneralLedger(client, entry, primaryAccountId, secondaryAccountNormalBalance, // <--- PASS THE TYPE
        singleEntryId, journalId);
        await client.query('COMMIT');
        return { status: 'SUCCESS', singleEntryId };
    }
    catch (e) {
        await client.query('ROLLBACK');
        throw e;
    }
    finally {
        client.release();
    }
}
exports.processSingleEntry = processSingleEntry;
