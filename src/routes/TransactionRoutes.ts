import express from "express";
import {processSingleEntry} from "../Controllers/TransactionService";

const router = express.Router();
router.post('/transactions', async (req, res) => {
    try {
        const { entry, journal_id} = req.body;

        if (!entry || !journal_id) {
            return res.status(400).json({ message: 'Missing entry or journal_id in request body.' });
        }
        const result = await processSingleEntry(entry, journal_id);
    
        res.status(200).json({ message: 'Transaction processed successfully.', result });
    
    } catch (error) {
        console.error('Error processing transaction:', error);
        res.status(500).json({ message: 'Internal server error.', error: (error as Error).message });
    }
});

export default router;