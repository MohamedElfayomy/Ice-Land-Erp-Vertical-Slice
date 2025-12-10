// src/db.ts
import { Pool, PoolClient } from 'pg';

// Configure the connection to your existing database
const pool = new Pool({
  user: 'postgres',         // Default user
  host: 'localhost',
  database: 'iceland_financial_db', 
  password: 'Me2442_E', // ⚠️ ACTION: Replace with your actual password (e.g., M@242_E)
  port: 5432,
});

// Listener to confirm connection
pool.on('connect', () => {
  console.log('Database connection pool established.');
});

export default {
  // Use this for simple, one-off queries
  query: (text: string, params: any[]) => pool.query(text, params),
  
  // Use this to get a dedicated client for Transactions (BEGIN/COMMIT)
  getClient: (): Promise<PoolClient> => pool.connect(),
};