// src/index.ts (Corrected Structure)

import express from 'express';
import * as TransactionService from './TransactionService'; 
import { testConnection } from './config/sequelize'; // <-- Import the connection check

const app = express();
const port = 3000; // Define port here

app.use(express.json());

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