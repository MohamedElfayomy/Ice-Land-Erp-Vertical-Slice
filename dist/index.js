"use strict";
// src/index.ts (Corrected Structure)
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TransactionService = __importStar(require("./TransactionService"));
const sequelize_1 = require("./config/sequelize"); // <-- Import the connection check
const app = (0, express_1.default)();
const port = 3000; // Define port here
app.use(express_1.default.json());
// --- 1. CORE API ROUTE (MUST BE UNCOMMENTED) ---
app.post('/api/transactions', async (req, res) => {
    const journalId = 1; // Assuming a fixed journal ID for now
    const batch = req.body.transactions;
    if (!batch || !Array.isArray(batch))
        return res.status(400).send({ message: 'Invalid transactions batch.' });
    const results = [];
    for (const entry of batch) {
        try {
            // Note: This needs updating to use the new Sequelize models inside
            const result = await TransactionService.processSingleEntry(entry, journalId);
            results.push({ entry, status: 'SUCCESS', result });
        }
        catch (error) {
            results.push({ entry, status: 'FAILURE', error: error.message });
        }
    }
    res.json({ message: 'Batch Processed', results });
});
// -------------------------------------------------------------------
// --- 2. STARTUP LOGIC (Must be wrapped and called) ---
// -------------------------------------------------------------------
async function startServer() {
    // 1. AUTHENTICATE DATABASE FIRST
    await (0, sequelize_1.testConnection)(); // Wait for the Sequelize connection to be verified.
    // 2. START THE EXPRESS SERVER
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
// Execute the startup function
startServer();
