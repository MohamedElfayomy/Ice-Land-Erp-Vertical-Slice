"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNormalBalanceCode = getNormalBalanceCode;
exports._getJournalPrimaryAccountId = _getJournalPrimaryAccountId;
exports.GetBalanceSum = GetBalanceSum;
exports.calculateEndBalance = calculateEndBalance;
exports.GetAccountsForReport = GetAccountsForReport;
exports.findIdFromName = findIdFromName;
exports.findJournalIdByName = findJournalIdByName;
const init_models_1 = require("../models/init-models");
const sequelize_1 = __importDefault(require("../config/sequelize"));
async function getNormalBalanceCode(accountId) {
    const account = await init_models_1.Account.findByPk(accountId, {
        include: [
            {
                model: init_models_1.CoaType,
                as: 'Type', // Must match the alias used in belongsTo
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
async function _getJournalPrimaryAccountId(journalId, code) {
    const journal = await init_models_1.Journals.findByPk(journalId);
    if (!journal)
        throw new Error(`Journal ID ${journalId} not found.`);
    return journal.get('primary_cash_account_id');
}
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
async function GetAccountsForReport(typeid) {
    const accounts = await init_models_1.Account.findAll({
        where: { type_id: typeid },
        attributes: ['account_number', 'name'],
        order: [['account_number', 'ASC']],
    });
    const rows = await Promise.all(accounts.map(async (account) => {
        const balances = await calculateEndBalance(account.id);
        return {
            account_number: account.account_number,
            account_name: account.name,
            account_balance: balances.endingBalance,
        };
    }));
    return rows;
}
async function findIdFromName(name, model) {
    const idName = await model.findOne({
        where: { name },
        attributes: ['id'],
    });
    if (!idName) {
        throw new Error('Name was not found!');
    }
    return idName.id;
}
async function findJournalIdByName(name) {
    const journal = await init_models_1.Journals.findOne({
        where: { name },
        attributes: ['id'],
    });
    if (!journal) {
        throw new Error('Journal not found!');
    }
    return journal.id;
}
