import express from 'express';
import { processSingleEntry } from '../TransactionService';

const router = express.Router();
router.post('/transaction', async (req, res) => {
    try {
        console.log('Received transaction request:', req.body);
        const {entry, journalId} = req.body;

        if (!journalId) {
            throw new Error('Journal ID undefined not found.');
        }
        const result = await processSingleEntry(entry, journalId);
        res.status(201).json({ 
            message: 'Transaction successfully processed and committed.', 
            data: result 
        });

    } catch (error: any) {
        console.error('Transaction failed:', error.message);
        res.status(500).json({ error: 'Transaction failed. Ledger rolled back.', details: error.message });
    }
});
    
export default router;