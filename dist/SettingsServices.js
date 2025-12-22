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
        attributes: ['name', 'number'],
        include: [
            {
                model: init_models_1.Journals,
                as: 'AttachedJournals',
                attributes: ['name'],
                through: { attributes: [] }
            },
        ],
        order: ['number', 'ASC'],
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
    let id;
    await sequelize_1.default.transaction(async (t) => {
        // Loop through each input in the inputs array
        for (const input of inputs) {
            for (const name of input.newJournalNames) {
                // Find the ID corresponding to the journal name
                id = await (0, HelperFunctions_1.findIdFromName)(name, init_models_1.Journals);
                // Create a new JournalAccounts record with the found journal_id and the provided account_id
                await init_models_1.JournalAccounts.create({
                    journal_id: id,
                    account_id: input.accountId,
                }, { transaction: t, ignoreDuplicates: true });
            }
        }
    });
}
exports.setAccountWithJournal = setAccountWithJournal;
