// src/index.ts
import express from 'express';
import * as TransactionService from './TransactionService';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/transactions', async (req, res) => {
    const journalId = 1;
    const batch = req.body.transactions;

    if (!batch || !Array.isArray(batch)) return res.status(400).send({ message: 'Invalid input' });

    const results = [];
    for (const entry of batch) {
        try {
            const result = await TransactionService.processSingleEntry(entry, journalId);
            results.push({ entry, result });
        } catch (error) {
            results.push({ entry, status: 'FAILURE', error: (error as Error).message });
        }
    }
    res.json({ message: 'Batch Processed', results });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});