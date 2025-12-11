import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import { ICOAType, IAccount } from "./model-interface";

// --- Define COAType model ---
export const COAType = sequelize.define<ICOAType>("coa_types", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  normal_balance_code:{
    type: DataTypes.ENUM('Debit', 'Credit'),
    allowNull: false,
  },
}, {
    timestamps: false,
});

// --- Define accounts model ---
export const Account = sequelize.define("accounts", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_number:{
        type: DataTypes.INTEGER,
        allowNull: false,   
    },
    type_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    timestamps: false,
});

// --- Define Journal model ---
export const Journal = sequelize.define("journals",{
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  primary_cash_account_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},{
  timestamps: false,
});

// --- Define SingleEntry model ---
export const SingleEntry = sequelize.define("single_entries",{
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  journal_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  secondary_account_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value:{
    type: DataTypes.DECIMAL (10,2),
    allowNull: false,
  },
  direction:{
    type: DataTypes.ENUM('IN', 'OUT'),
    allowNull: false,
  },
  description:{
    type: DataTypes.STRING,
    allowNull: true,
  },
},{
  timestamps: false,
});

// --- Define JournalEntry model ---
export const JournalEntry = sequelize.define("journal_entries",{
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  single_entry_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  journal_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  account_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  debit:{
    type: DataTypes.DECIMAL (10,2),
    allowNull: false,
  },
  credit:{
    type: DataTypes.DECIMAL (10,2),
    allowNull: false,
  },
},{
  timestamps: false,
});

// --- Define associations ---

// Account table foreign keys/References
Account.belongsTo(COAType, { foreignKey: 'type_id', as: 'Type' });
COAType.hasMany(Account, { foreignKey: 'type_id'});

// SingleEntry table foreign keys/References
SingleEntry.belongsTo(Journal, { foreignKey: 'journal_id', as: 'Journal' });
Journal.hasMany(SingleEntry, { foreignKey: 'journal_id' });

SingleEntry.belongsTo(Account, { foreignKey: 'secondary_account_id', as: 'SecondaryAccount' });
Account.hasMany(SingleEntry, { foreignKey: 'secondary_account_id' });

// Journals table foreign keys/References
Journal.belongsTo(Account, { foreignKey: 'primary_cash_account_id', as: 'PrimaryCashAccount' });
Account.hasMany(Journal, { foreignKey: 'primary_cash_account_id' });

// JournalEntry table foreign keys/References
JournalEntry.belongsTo(SingleEntry, { foreignKey: 'single_entry_id', as: 'SingleEntry' });
SingleEntry.hasMany(JournalEntry, { foreignKey: 'single_entry_id' });

JournalEntry.belongsTo(Journal, { foreignKey: 'journal_id', as: 'Journal' });
Journal.hasMany(JournalEntry, { foreignKey: 'journal_id' });

JournalEntry.belongsTo(Account, { foreignKey: 'account_id', as: 'Account' });
Account.hasMany(JournalEntry, { foreignKey: 'account_id' });

// Journal accounts Junction table associations for many-to-many relationships
Account.belongsToMany(Journal,{
  through: 'journal_accounts',
  foreignKey: 'account_id',
  otherKey: 'journal_id',
  as: 'Journals',
  timestamps: false,
});

Journal.belongsToMany(Account,{
  through: 'Journal_accounts',
  foreignKey: 'journal_id',
  otherKey: 'account_id',
  as: 'Accounts',
  timestamps: false,
});

export default function initModels() {
  return {
    COAType,
    Account,
    Journal,
    SingleEntry,
    JournalEntry,
  };
}


