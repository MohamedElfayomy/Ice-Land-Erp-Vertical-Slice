import { Sequelize, DataTypes } from "sequelize";

const DB_NAME = "iceland_financial_db";
const DB_USER = "postgres";
const DB_PASSWORD = "Me2442_E";
const DB_HOST = "localhost";
const DB_PORT = 5432;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  port: DB_PORT,
  logging: false, // Disable logging; set to console.log to see the raw SQL queries
});

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
}

export default sequelize;
