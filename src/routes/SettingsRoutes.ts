import express, { Request, Response } from 'express';
import { CreateAccounts, getAccountsWithJournal, setAccountWithJournal, AccountsInput, AccountWithJournalInput} from '../Controllers/SettingsServices';

const router = express.Router();

// POST /api/settings/accounts - Create Accounts
router.post('/accounts', async (req: Request, res: Response) => {
    try {
        const inputs = req.body.inputs as AccountsInput[];
        const createdAccounts = await CreateAccounts(inputs);
        return res.status(201).json(createdAccounts);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
});

// GET /api/settings/accounts-with-journal - Get Accounts with Journals
router.get('/accounts-with-journal', async (req: Request, res: Response) => {
    try {
        const accounts = await getAccountsWithJournal();
        return res.status(200).json(accounts);
    } catch (error: any) {
        return res.status(500).json({error: 'failed to get accounts!', details: error.message});
    }
});

router.post('/set-account-with-journal', async (req: Request, res: Response) => {
    try {
        console.log('Request Body:', req.body); // Debugging statement
        const inputs = req.body.inputs as AccountWithJournalInput[];
        
        if (!Array.isArray(inputs)) {
            throw new Error("Invalid input format. 'inputs' must be an array.");
        }
        
        await setAccountWithJournal(inputs);
        return res.status(204).json(inputs); // No Content
    } catch (error: any) {
        console.error('Error in /set-account-with-journal:', error.message);
        return res.status(500).json({ error: 'failed to enter accounts!', details: error.message });
    }
});


export default router;
