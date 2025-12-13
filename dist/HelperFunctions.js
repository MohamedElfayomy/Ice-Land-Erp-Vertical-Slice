"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getJournalPrimaryAccountId = exports.getNormalBalanceCode = void 0;
const init_models_1 = require("./models/init-models");
async function getNormalBalanceCode(accountId) {
    const account = await init_models_1.Account.findByPk(accountId, {
        include: [
            {
                model: init_models_1.CoaType,
                as: 'Type',
                attributes: ['normal_balance_code'], // Only fetch what we need
            },
        ] // We don't need any fields from Account itself
    });
    // If account or its type is not found, return null
    if (!account || !account.Type) {
        throw new Error(`Account ID ${accountId} or its type not found.`);
    }
    return account.Type.normal_balance_code;
}
exports.getNormalBalanceCode = getNormalBalanceCode;
async function _getJournalPrimaryAccountId(journalId) {
    const journal = await init_models_1.Journals.findByPk(journalId);
    if (!journal)
        throw new Error(`Journal ID ${journalId} not found.`);
    return journal.get('primary_cash_account_id');
}
exports._getJournalPrimaryAccountId = _getJournalPrimaryAccountId;
