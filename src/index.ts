// src/index.ts (Corrected Structure)

import express from 'express';
import * as TransactionService from './TransactionService'; 
import { testConnection } from './config/sequelize'; // <-- Import the connection check

const app = express();
const port = 3000; // Define port here

app.use(express.json());

// --- 1. CORE API ROUTE (MUST BE UNCOMMENTED) ---
app.post('/api/transactions', async (req, res) => {
    const journalId = 1; // Assuming a fixed journal ID for now
    const batch = req.body.transactions;

    if (!batch || !Array.isArray(batch)) return res.status(400).send({ message: 'Invalid transactions batch.' });

    const results = [];
    for (const entry of batch) {
        try {
            // Note: This needs updating to use the new Sequelize models inside
            const result = await TransactionService.processSingleEntry(entry, journalId); 
            results.push({ entry, status: 'SUCCESS', result });
        } catch (error) {
            results.push({ entry, status: 'FAILURE', error: (error as Error).message });
        }
    }
    res.json({ message: 'Batch Processed', results });
});


// -------------------------------------------------------------------
// --- 2. STARTUP LOGIC (Must be wrapped and called) ---
// -------------------------------------------------------------------

async function startServer() {
    // 1. AUTHENTICATE DATABASE FIRST
    await testConnection(); // Wait for the Sequelize connection to be verified.

    // 2. START THE EXPRESS SERVER
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

// Execute the startup function
startServer();