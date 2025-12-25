"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts (Corrected Structure)
const sequelize_1 = require("./config/sequelize"); // <-- Import the connection check
const app_1 = __importDefault(require("./routes/app"));
const port = process.env.PORT || 3000; // Default port if not specified
async function startServer() {
    // 1. AUTHENTICATE DATABASE FIRST
    await (0, sequelize_1.testConnection)(); // Wait for the Sequelize connection to be verified.
    // 2. START THE EXPRESS SERVER
    app_1.default.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
// Execute the startup function
startServer();
