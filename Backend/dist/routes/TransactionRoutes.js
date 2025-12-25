"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TransactionService_1 = require("../Controllers/TransactionService");
const router = express_1.default.Router();
router.post('/transactions', async (req, res) => {
    try {
        const { entry, journal_id } = req.body;
        if (!entry || !journal_id) {
            return res.status(400).json({ message: 'Missing entry or journal_id in request body.' });
        }
        const result = await (0, TransactionService_1.processSingleEntry)(entry, journal_id);
        res.status(200).json({ message: 'Transaction processed successfully.', result });
    }
    catch (error) {
        console.error('Error processing transaction:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});
exports.default = router;
