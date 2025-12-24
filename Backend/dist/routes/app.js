"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TransactionRoutes_1 = __importDefault(require("./TransactionRoutes")); // Import the transaction routes
const ReportingRoutes_1 = __importDefault(require("./ReportingRoutes")); // Import the reporting routes
const SettingsRoutes_1 = __importDefault(require("./SettingsRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Middleware to parse JSON request bodies
app.use('/api/transaction', TransactionRoutes_1.default); // Use the transaction routes under the /api path
app.use('/api/reporting', ReportingRoutes_1.default); // Use the reporting routes under the /api path
app.use('/api/settings', SettingsRoutes_1.default);
exports.default = app; // Export the app for use in other modules
