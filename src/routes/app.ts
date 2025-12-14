import express from 'express';
import transactionRoutes from './TransactionRoutes'; // Import the transaction routes
import reportingRoutes from './ReportingRoutes'; // Import the reporting routes


const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/api', transactionRoutes); // Use the transaction routes under the /api path
app.use('/api', reportingRoutes); // Use the reporting routes under the /api path

export default app; // Export the app for use in other modules
