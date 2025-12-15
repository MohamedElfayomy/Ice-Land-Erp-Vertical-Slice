"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEndBalance = exports.GetBalanceSum = exports._getJournalPrimaryAccountId = exports.getNormalBalanceCode = void 0;
const init_models_1 = require("./models/init-models");
const sequelize_1 = __importDefault(require("./config/sequelize"));
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
    console.log(`Normal balance code for account ID ${accountId} is ${account.Type.normal_balance_code}`);
    return account.Type.normal_balance_code;
}
exports.getNormalBalanceCode = getNormalBalanceCode;
async function _getJournalPrimaryAccountId(journalId, code) {
    const journal = await init_models_1.Journals.findByPk(journalId);
    if (!journal)
        throw new Error(`Journal ID ${journalId} not found.`);
    return journal.get('primary_cash_account_id');
}
exports._getJournalPrimaryAccountId = _getJournalPrimaryAccountId;
async function GetBalanceSum(accountId) {
    const result = await init_models_1.JournalEntry.findOne({
        attributes: [
            [(sequelize_1.default.fn('SUM', sequelize_1.default.col('debit'))), 'totalDebit'],
            [(sequelize_1.default.fn('SUM', sequelize_1.default.col('credit'))), 'totalCredit'],
        ],
        where: { account_id: accountId },
        raw: true,
    });
    const totals = result;
    return {
        totalDebit: Number(totals?.totalDebit ?? 0),
        totalCredit: Number(totals?.totalCredit ?? 0)
    };
}
exports.GetBalanceSum = GetBalanceSum;
async function calculateEndBalance(accountId) {
    const normalBalanceCode = await getNormalBalanceCode(accountId);
    const totals = await GetBalanceSum(accountId);
    const totalCredit = totals.totalCredit;
    const totalDebit = totals.totalDebit;
    let endBalance = 0;
    if (normalBalanceCode === 'Debit') {
        endBalance = totalDebit - totalCredit;
    }
    else {
        endBalance = totalCredit - totalDebit;
    }
    return {
        totalDebit: Number(totalDebit),
        totalCredit: Number(totalCredit),
        endingBalance: Number(endBalance)
    };
}
exports.calculateEndBalance = calculateEndBalance;
