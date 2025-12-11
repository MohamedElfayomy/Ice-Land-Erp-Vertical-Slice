"use strict";
// src/TransactionService.ts
//import e from 'express';
//import { PoolClient } from 'pg';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSingleEntry = void 0;
const sequelize_1 = __importDefault(require("./config/sequelize"));
const init_models_1 = require("./models/init-models");
// --- Helper Functions ---
async function _getAccountType(accountId) {
    const account = await init_models_1.Account.findByPk(accountId, {
        include: [{
                model: init_models_1.COAType,
                as: 'Type',
                attributes: ['normal_balance_code']
            }]
    });
    if (!account)
        throw new Error(`Account ID ${accountId} not found.`);
    return account.get('normal_balance_code');
}
async function _getJournalPrimaryAccountId(journalId) {
    const journal = await init_models_1.Journal.findByPk(journalId);
    if (!journal)
        throw new Error(`Journal ID ${journalId} not found.`);
    return journal.get('primary_cash_account_id');
}
async function _createSingleEntry(transaction, entry, journalId) {
    const singleEntry = await init_models_1.SingleEntry.create({
        journal_id: journalId,
        secondary_account_id: entry.secondary_account_id,
        value: entry.value,
        direction: entry.direction,
        description: entry.description
    }, { transaction });
    return singleEntry;
}
async function _postToGeneralLedger(transaction, entry, primaryAccountId, secondary_account_id, secondaryAccountNormalBalance, singleEntryId, journalId) {
    let debitAccount = 0;
    ;
    let creditAccount = 0;
    if (entry.direction === 'IN') {
        (secondaryAccountNormalBalance === 'DEBIT') ?
            (debitAccount = entry.value, creditAccount = 0) :
            (debitAccount = 0, creditAccount = entry.value);
    }
    else if (entry.direction === 'OUT') {
        (secondaryAccountNormalBalance === 'DEBIT') ?
            (debitAccount = 0, creditAccount = entry.value) :
            (debitAccount = entry.value, creditAccount = 0);
    }
    else {
        throw new Error('Invalid transaction direction specified.');
    }
    await init_models_1.JournalEntry.create({
        single_entry_id: singleEntryId,
        journal_id: journalId,
        account_id: primaryAccountId,
        debit: creditAccount,
        credit: debitAccount,
    }, { transaction });
    await init_models_1.JournalEntry.create({
        single_entry_id: singleEntryId,
        journal_id: journalId,
        account_id: secondary_account_id,
        debit: debitAccount,
        credit: creditAccount
    }, { transaction });
    return { primaryAccountId, secondary_account_id };
}
// --- Main Function ---
async function processSingleEntry(entry, journalId) {
    // --- 1. PRE-TRANSACTION READS ---
    // Get the required data needed for transaction logic (read operations)
    const primaryAccountId = await _getJournalPrimaryAccountId(journalId);
    const secondaryAccountNormalBalance = await _getAccountType(entry.secondary_account_id);
    // Initialize the transaction variable
    let t;
    try {
        // BEGIN: Start the transaction session
        t = await sequelize_1.default.transaction();
        // --- CORE TRANSACTION WRITES ---
        const singleEntryRecord = await _createSingleEntry(t, entry, journalId);
        const singleEntryId = singleEntryRecord.get('id');
        // Post the Debit/Credit Journal Entries (The Double Entry)
        const ledgerResult = await _postToGeneralLedger(t, entry, primaryAccountId, entry.secondary_account_id, secondaryAccountNormalBalance, singleEntryId, journalId);
        // COMMIT: If all database operations were successful, commit the changes.
        await t.commit();
        return {
            single_entry_id: singleEntryId,
            status: 'Committed',
            // ... return other details ...
        };
    }
    catch (error) {
        // ROLLBACK: If any error occurred during the transaction, roll back all changes.
        if (t) { // Check if the transaction object was successfully created
            await t.rollback();
        }
        // Re-throw the error so the API can return a 500 status.
        throw error;
    }
}
exports.processSingleEntry = processSingleEntry;
