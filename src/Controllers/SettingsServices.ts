import {Transaction} from "sequelize";
import sequelize from "../config/sequelize";
import {Account, Journals, JournalAccounts} from "../models/init-models"
import {findIdFromName} from "./HelperFunctions";

interface Accounts {
    account_name: string;
    account_number: number;
    account_type: number;
}

export interface AccountsInput {
    journal_ids: number[];
    account: Accounts;
}

async function CreateAccounts(inputs: AccountsInput[]): Promise<Account[]> {

    if (inputs.length < 1) { throw new Error("No accounts found."); }
    const createdAccounts: Account[] = [];

    await sequelize.transaction(async (t:Transaction) => {
        for (const input of inputs) {
            const {account, journal_ids } = input;
            if (journal_ids.length === 0) {throw new Error("No journal id found."); }

            const newAccount = await Account.create(
                {
                    account_number: account.account_number,
                    name: account.account_name,
                    type_id: account.account_type
                },
                { transaction: t }
            );

            // Link to journals
            const junctionRows = journal_ids.map(journalId => ({
                journal_id: journalId,
                account_id: newAccount.id,
            }));

            await JournalAccounts.bulkCreate(junctionRows, {transaction: t});
            createdAccounts.push(newAccount);
        }
    });
    return createdAccounts;
}

interface AccountsWithJournals {
    account_name: string;
    account_number: number;
    linked_journals: {id:number, name: string}[];
}

async function getAccountsWithJournal(): Promise<AccountsWithJournals[]>{

    const accounts = await Account.findAll({
        attributes: [ 'name', 'account_number' ],
        include: [
            {
                model: Journals,
                as: 'AttachedJournals',
                attributes: ['name'],
                through: {attributes:[]}
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

export interface AccountWithJournalInput {
    accountName: string;
    newJournalNames: string[];
}

// src/SettingsServices.ts (82-97)


async function setAccountWithJournal(inputs: AccountWithJournalInput[]) {

    console.log('Setting accounts with journals...');
    console.log('Inputs:', inputs);

    if (!Array.isArray(inputs)) {
        throw new Error("Invalid input format. 'inputs' must be an array.");
    }

    for (const input of inputs) {
        console.log(`Processing account: ${input.accountName}`);
        
        const accountID = await findIdFromName(input.accountName, Account);
        if (!accountID) {
            throw new Error(`Account with name "${input.accountName}" not found.`);
        }
        console.log(`Found account ID: ${accountID}`);

        for (const name of input.newJournalNames) {
            console.log(`Processing journal: ${name}`);
            const journalID = await findIdFromName(name, Journals);
            if (!journalID) {
                throw new Error(`Journal with name "${name}" not found.`);
            }
            console.log(`Found journal ID: ${journalID}`);

            await sequelize.transaction(async (t: Transaction) => {
                await JournalAccounts.create({
                    journal_id: journalID,
                    account_id: accountID,
                }, { transaction: t, ignoreDuplicates: true });
            });
            console.log(`Created entry for account ${input.accountName} with journal ${name}`);
        }
    }
}

export {
    CreateAccounts,
    getAccountsWithJournal,
    setAccountWithJournal
}
