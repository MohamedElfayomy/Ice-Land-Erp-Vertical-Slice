// src/index.ts (Corrected Structure)

import express from 'express';
import * as TransactionService from './TransactionService'; 
import { testConnection } from './config/sequelize'; // <-- Import the connection check
import transactionRoutes from './routes/TransactionRoutes';
import app from './routes/app';

const port = process.env.PORT || 3000; // Default port if not specified


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