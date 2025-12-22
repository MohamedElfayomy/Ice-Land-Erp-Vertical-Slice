"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSingleEntry = void 0;
const sequelize_1 = __importDefault(require("./config/sequelize"));
const init_models_1 = require("./models/init-models"); // Adjust the import path as necessary
const HelperFunctions_1 = require("./HelperFunctions"); // Adjust the import path as necessary
async function _createSingleEntry(transaction, entry, journalId) {
    const id = await (0, HelperFunctions_1.findIdFromName)(entry.account_name, init_models_1.Account);
    const r = await init_models_1.SingleEntry.create({
        journal_id: journalId,
        secondary_account_id: id,
        value: entry.value,
        direction: entry.direction,
        description: entry.description
    }, { transaction });
    return r;
}
async function _postToGeneralLedger(transaction, entry, primaryAccountId, secondary_account_id, secondaryAccountNormalBalance, singleEntryId, journalId, description) {
    let debitAccount = 0;
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
        description: entry.description,
        debit: creditAccount,
        credit: debitAccount,
    }, { transaction });
    await init_models_1.JournalEntry.create({
        single_entry_id: singleEntryId,
        journal_id: journalId,
        account_id: secondary_account_id,
        description: entry.description,
        debit: debitAccount,
        credit: creditAccount
    }, { transaction });
    return { primaryAccountId, secondary_account_id };
}
// --- Main Function ---
async function processSingleEntry(entry, journalId) {
    // Extract the account_id from the input or determine it dynamically
    const accountId = entry.account_name ? await (0, HelperFunctions_1.findIdFromName)(entry.account_name, init_models_1.Account) : null;
    if (!accountId) {
        throw new Error('Invalid account name provided.');
    }
    // --- 1. PRE-TRANSACTION READS ---
    // Validate that the specific account_id is linked to the given journal_id
    const journalAccount = await init_models_1.JournalAccounts.findOne({
        where: {
            journal_id: journalId,
            account_id: accountId
        }
    });
    if (!journalAccount) {
        throw new Error(`Account ID ${accountId} is not linked to Journal ID ${journalId}.`);
    }
    // Get the required data needed for transaction logic (read operations)
    const primaryAccountId = await init_models_1.Journals.findByPk(journalId).then(journal => {
        if (!journal)
            throw new Error(`Journal ID ${journalId} not found.`);
        return journal.get('primary_cash_account_id');
    });
    const secondaryAccountNormalBalance = await (0, HelperFunctions_1.getNormalBalanceCode)(accountId);
    // Initialize the transaction variable
    let t;
    try {
        // BEGIN: Start the transaction session
        t = await sequelize_1.default.transaction();
        // --- CORE TRANSACTION WRITES ---
        const singleEntryRecord = await _createSingleEntry(t, entry, journalId);
        const singleEntryId = singleEntryRecord.get('id');
        // Post the Debit/Credit Journal Entries (The Double Entry)
        const ledgerResult = await _postToGeneralLedger(t, entry, primaryAccountId, accountId, // Use the extracted account_id
        secondaryAccountNormalBalance, singleEntryId, journalId, entry.description);
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
