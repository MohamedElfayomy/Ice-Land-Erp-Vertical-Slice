"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMasterLedger = exports.LedgerReport = void 0;
const init_models_1 = require("./models/init-models");
const HelperFunctions_1 = require("./HelperFunctions");
async function LedgerReport(entry) {
    const { secondary_account_id, journal_id } = entry;
    const journalEntries = await init_models_1.JournalEntry.findAll({
        where: {
            account_id: secondary_account_id,
            journal_id: journal_id,
        },
        include: [
            {
                model: init_models_1.SingleEntry,
                as: 'SingleEntry',
                attributes: ['description'],
            },
        ]
    });
    const balanceCode = await (0, HelperFunctions_1.getNormalBalanceCode)(secondary_account_id);
    let runningBalance = 0;
    const transactions = journalEntries.map((entry) => {
        const debit = entry.debit;
        const credit = entry.credit;
        if (balanceCode === 'Debit') {
            runningBalance += debit - credit;
        }
        else {
            runningBalance += credit - debit;
        }
        return {
            date: entry.createdAt,
            description: entry.SingleEntry?.description || entry.Journal?.description || '',
            debit: debit,
            credit: credit,
            balance: runningBalance,
        };
    });
    return {
        account_id: secondary_account_id,
        journal_id: journal_id,
        entries: transactions,
        ending_balance: runningBalance,
    };
}
exports.LedgerReport = LedgerReport;
async function getMasterLedger() {
    // 1. Get all accounts from database
    const accounts = await init_models_1.Account.findAll();
    // 2. For each account, get totals and calculate balance
    const ledgerRows = await Promise.all(accounts.map(async (account) => {
        // Use your helper to get final balance
        const { totalDebit, totalCredit, endingBalance } = await (0, HelperFunctions_1.calculateEndBalance)(account.id);
        return {
            account_number: account.account_number,
            account_name: account.name,
            total_debit: totalDebit,
            total_credit: totalCredit,
            ending_balance: endingBalance,
        };
    }));
    console.log('master ledger get completed!');
    // 3. Optional: sort by account number (standard in accounting)
    return ledgerRows.sort((a, b) => a.account_number - b.account_number);
}
exports.getMasterLedger = getMasterLedger;
