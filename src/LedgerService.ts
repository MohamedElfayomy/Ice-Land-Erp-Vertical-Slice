import { JournalEntry } from "./models/init-models";
import { fn, col } from "sequelize";
import { _getNormalBalanceCode } from "./HelperFunctions";

/**
 * Calculates the real-time balance for a given account from all journal entries.
 */
export async function getAccountBalance(accountId: number): Promise<{balance: number, normalBalance: string}> {
    
    // 1. Get the Normal Balance for calculation
    const normalBalance = await _getNormalBalanceCode(accountId);

    // 2. Perform SQL Aggregation: SUM(debit) and SUM(credit)
    const result = await JournalEntry.findOne({
        attributes: [
            // Select SUM(debit) as 'total_debit'
            [fn('SUM', col('debit')), 'total_debit'],
            // Select SUM(credit) as 'total_credit'
            [fn('SUM', col('credit')), 'total_credit'],
        ],
        where: {
            account_id: accountId,
        },
        // We group by account_id to make the aggregation work correctly
        group: ['account_id'], 
        raw: true, // Return simple JavaScript object for easy access
    });

    if (!result) {
        // If no entries are found, the balance is 0
        return { balance: 0, normalBalance: normalBalance };
    }

    console.log('Balance Normal Code:', normalBalance);
    
    // 3. Extract and Parse the aggregated values (Sequelize returns numbers/decimals as strings)
    const totalDebit = parseFloat((result as any).total_debit || '0');
    const totalCredit = parseFloat((result as any).total_credit || '0');

    let finalBalance = 0;

    // 4. Apply the Normal Balance Rule for the final displayed balance
    if (normalBalance === 'Debit') {
        // Assets/Expenses: Balance = Debits - Credits
        finalBalance = totalDebit - totalCredit;
    } else { // normalBalance === 'Credit'
        // Liabilities/Equity/Revenue: Balance = Credits - Debits
        finalBalance = totalCredit - totalDebit;
    }

    // Return the final balance, formatted to two decimal places
    return { 
        balance: parseFloat(finalBalance.toFixed(2)), 
        normalBalance: normalBalance 
    };
}