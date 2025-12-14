"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerReport = void 0;
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
        if (balanceCode === 'DEBIT') {
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
