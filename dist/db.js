"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/db.ts
const pg_1 = require("pg");
// Configure the connection to your existing database
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'iceland_financial_db',
    password: 'Me2442_E',
    port: 5432,
});
// Listener to confirm connection
pool.on('connect', () => {
    console.log('Database connection pool established.');
});
exports.default = {
    // Use this for simple, one-off queries
    query: (text, params) => pool.query(text, params),
    // Use this to get a dedicated client for Transactions (BEGIN/COMMIT)
    getClient: () => pool.connect(),
};
