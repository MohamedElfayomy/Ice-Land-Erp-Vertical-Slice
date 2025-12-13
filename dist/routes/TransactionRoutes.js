"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TransactionService_1 = require("../TransactionService");
const router = express_1.default.Router();
router.post('/transaction', async (req, res) => {
    try {
        console.log('Received transaction request:', req.body);
        const { entry, journalId } = req.body;
        if (!journalId) {
            throw new Error('Journal ID undefined not found.');
        }
        const result = await (0, TransactionService_1.processSingleEntry)(entry, journalId);
        res.status(201).json({
            message: 'Transaction successfully processed and committed.',
            data: result
        });
    }
    catch (error) {
        console.error('Transaction failed:', error.message);
        res.status(500).json({ error: 'Transaction failed. Ledger rolled back.', details: error.message });
    }
});
exports.default = router;
