import express, { Request, Response } from 'express';
import { CreateAccounts, getAccountsWithJournal, setAccountWithJournal, AccountsInput, AccountWithJournalInput} from '../SettingsServices';

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

// POST /api/settings/set-account-with-journal - Set Account with Journal
router.post('/set-account-with-journal', async (req: Request, res: Response) => {
    try {
        const inputs = req.body.inputs as AccountWithJournalInput[];
        await setAccountWithJournal(inputs);
        return res.status(204).json(inputs); // No Content
    } catch (error: any) {
        return res.status(500).json({error: 'failed to enter accounts!', details: error.message});
    }
});

export default router;
