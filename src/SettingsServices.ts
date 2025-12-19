import {Transaction} from "sequelize";
import sequelize from "./config/sequelize";
import {Account, Journals, JournalAccounts} from "./models/init-models"
import  "/HelperFunctions";
import {findIdFromName} from "./HelperFunctions";

interface Accounts {
    account_name: string;
    account_number: number;
    account_type: number;
}

interface AccountsInput {
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
                    number: account.account_number,
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
        attributes: [ 'name', 'number' ],
        include: [
            {
                model: Journals,
                as: 'AttachedJournals',
                attributes: ['name'],
                through: {attributes:[]}
             },
        ],
        order: ['number', 'ASC'],
    });
    return accounts.map((account) => ({
        account_name: account.name,
        account_number: account.number,
        linked_journals: account.AttachedJournals || [],
    }));
}

interface AccountWithJournalInput {
    accountId: number;
    newJournalNames: string[];
}

async function setAccountWithJournal(inputs: AccountWithJournalInput[]){
   let id: number;

    await sequelize.transaction(async (t: Transaction) => {
        for (const input of inputs) {
            for (const name of input.newJournalNames) {
                id = await findIdFromName(name, Journals);
            }

            await JournalAccounts.create({
                journal_id: id,
                account_id: input.accountId,
            }, {transaction: t, ignoreDuplicates: true});
        }
    });
}

export {
    CreateAccounts,
    getAccountsWithJournal,
    setAccountWithJournal
}