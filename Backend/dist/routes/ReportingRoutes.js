"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ReportingServices_1 = require("../Controllers/ReportingServices");
const router = express_1.default.Router();
router.get('/ledger-report', async (req, res) => {
    try {
        const { secondary_account_id, journal_id } = req.query;
        if (!secondary_account_id || !journal_id) {
            return res.status(400).json({ message: 'Missing secondary_account_id or journal_id in query parameters.' });
        }
        const entry = {
            secondary_account_id: Number(secondary_account_id),
            journal_id: Number(journal_id)
        };
        const report = await (0, ReportingServices_1.LedgerReport)(entry);
        res.status(200).json({ message: 'Ledger report generated successfully.', report });
    }
    catch (error) {
        console.error('Error generating ledger report:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});
router.get('/master-ledger', async (req, res) => {
    try {
        const masterLedger = await (0, ReportingServices_1.getMasterLedger)();
        console.log(masterLedger);
        res.status(200).json(masterLedger);
    }
    catch (error) {
        res.status(500).json({ error: 'failed to generate master ledger!', details: error.message });
    }
});
router.get('/profit-loss', async (req, res) => {
    try {
        const Pl = await (0, ReportingServices_1.ViewPLStatement)();
        console.log(Pl);
        res.status(200).json(Pl);
    }
    catch (error) {
        res.status(500).json({ error: 'failed to generate P & L Statement', details: error.message });
    }
});
router.get('/balance-sheet', async (req, res) => {
    try {
        const Pl = await (0, ReportingServices_1.ViewBalanceSheet)();
        console.log(Pl);
        res.status(200).json(Pl);
    }
    catch (error) {
        res.status(500).json({ error: 'failed to generate P & L Statement', details: error.message });
    }
});
exports.default = router;
