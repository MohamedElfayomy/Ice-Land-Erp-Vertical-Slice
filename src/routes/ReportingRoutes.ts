import express from 'express';
import { LedgerReport, getMasterLedger } from '../ReportingServices';
import { report } from 'process';

const router = express.Router();
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

        const report = await LedgerReport(entry);
    
        res.status(200).json({ message: 'Ledger report generated successfully.', report });
    
    } catch (error) {
        console.error('Error generating ledger report:', error);
        res.status(500).json({ message: 'Internal server error.', error: (error as Error).message });
    }
});

router.get('/master-ledger', async (req, res) => {
    try{
        const masterLedger = await getMasterLedger();
        console.log(masterLedger);

        res.status(200).json(masterLedger);
    } catch (error: any){
        res.status(500).json({error: 'failed to generate master ledger!', details: error.message})
    }

});

export default router;