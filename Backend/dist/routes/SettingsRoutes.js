"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SettingsServices_1 = require("../Controllers/SettingsServices");
const router = express_1.default.Router();
// POST /api/settings/accounts - Create Accounts
router.post('/accounts', async (req, res) => {
    try {
        const inputs = req.body.inputs;
        const createdAccounts = await (0, SettingsServices_1.CreateAccounts)(inputs);
        return res.status(201).json(createdAccounts);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
});
// GET /api/settings/accounts-with-journal - Get Accounts with Journals
router.get('/accounts-with-journal', async (req, res) => {
    try {
        const accounts = await (0, SettingsServices_1.getAccountsWithJournal)();
        return res.status(200).json(accounts);
    }
    catch (error) {
        return res.status(500).json({ error: 'failed to get accounts!', details: error.message });
    }
});
router.post('/set-account-with-journal', async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Debugging statement
        const inputs = req.body.inputs;
        if (!Array.isArray(inputs)) {
            throw new Error("Invalid input format. 'inputs' must be an array.");
        }
        await (0, SettingsServices_1.setAccountWithJournal)(inputs);
        return res.status(204).json(inputs); // No Content
    }
    catch (error) {
        console.error('Error in /set-account-with-journal:', error.message);
        return res.status(500).json({ error: 'failed to enter accounts!', details: error.message });
    }
});
exports.default = router;
