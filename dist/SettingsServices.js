"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAccountWithJournal = exports.getAccountsWithJournal = exports.CreateAccounts = void 0;
const sequelize_1 = __importDefault(require("./config/sequelize"));
const init_models_1 = require("./models/init-models");
const HelperFunctions_1 = require("./HelperFunctions");
async function CreateAccounts(inputs) {
    if (inputs.length < 1) {
        throw new Error("No accounts found.");
    }
    const createdAccounts = [];
    await sequelize_1.default.transaction(async (t) => {
        for (const input of inputs) {
            const { account, journal_ids } = input;
            if (journal_ids.length === 0) {
                throw new Error("No journal id found.");
            }
            const newAccount = await init_models_1.Account.create({
                account_number: account.account_number,
                name: account.account_name,
                type_id: account.account_type
            }, { transaction: t });
            // Link to journals
            const junctionRows = journal_ids.map(journalId => ({
                journal_id: journalId,
                account_id: newAccount.id,
            }));
            await init_models_1.JournalAccounts.bulkCreate(junctionRows, { transaction: t });
            createdAccounts.push(newAccount);
        }
    });
    return createdAccounts;
}
exports.CreateAccounts = CreateAccounts;
async function getAccountsWithJournal() {
    const accounts = await init_models_1.Account.findAll({
        attributes: ['name', 'account_number'],
        include: [
            {
                model: init_models_1.Journals,
                as: 'AttachedJournals',
                attributes: ['name'],
                through: { attributes: [] }
            },
        ],
        order: ['account_number'],
    });
    return accounts.map((account) => ({
        account_name: account.name,
        account_number: account.account_number,
        linked_journals: account.AttachedJournals || [],
    }));
}
exports.getAccountsWithJournal = getAccountsWithJournal;
// src/SettingsServices.ts (82-97)
async function setAccountWithJournal(inputs) {
    console.log('Setting accounts with journals...');
    console.log('Inputs:', inputs);
    if (!Array.isArray(inputs)) {
        throw new Error("Invalid input format. 'inputs' must be an array.");
    }
    for (const input of inputs) {
        console.log(`Processing account: ${input.accountName}`);
        const accountID = await (0, HelperFunctions_1.findIdFromName)(input.accountName, init_models_1.Account);
        if (!accountID) {
            throw new Error(`Account with name "${input.accountName}" not found.`);
        }
        console.log(`Found account ID: ${accountID}`);
        for (const name of input.newJournalNames) {
            console.log(`Processing journal: ${name}`);
            const journalID = await (0, HelperFunctions_1.findIdFromName)(name, init_models_1.Journals);
            if (!journalID) {
                throw new Error(`Journal with name "${name}" not found.`);
            }
            console.log(`Found journal ID: ${journalID}`);
            await sequelize_1.default.transaction(async (t) => {
                await init_models_1.JournalAccounts.create({
                    journal_id: journalID,
                    account_id: accountID,
                }, { transaction: t, ignoreDuplicates: true });
            });
            console.log(`Created entry for account ${input.accountName} with journal ${name}`);
        }
    }
}
exports.setAccountWithJournal = setAccountWithJournal;
