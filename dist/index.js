"use strict";
// src/index.ts (Corrected Structure)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("./config/sequelize"); // <-- Import the connection check
const TransactionRoutes_1 = __importDefault(require("./routes/TransactionRoutes"));
const app = (0, express_1.default)();
const port = 3000; // Define port here
app.use(express_1.default.json());
app.use('/api/transactions', TransactionRoutes_1.default);
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
