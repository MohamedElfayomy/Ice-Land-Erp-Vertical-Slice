import express from 'express';
import transactionRoutes from './TransactionRoutes'; // Import the transaction routes


const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/api', transactionRoutes); // Use the transaction routes under the /api path

export default app; // Export the app for use in other modules
