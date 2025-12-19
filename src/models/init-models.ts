import { Sequelize, DataTypes, Model, CreationOptional, NonAttribute } from "sequelize";
import sequelize from "../config/sequelize";
import { InferAttributes, InferCreationAttributes } from "sequelize";
class CoaType extends Model<InferAttributes<CoaType>, InferCreationAttributes<CoaType>> {
  declare id: number;
  declare name: string;
  declare normal_balance_code: string;

  declare Accounts?: Account[]; // Association
}

CoaType.init({
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
    sequelize,
    modelName: 'CoaType',
    tableName: 'coa_types',
    timestamps: false,
});

class Account extends Model<InferAttributes<Account>, InferCreationAttributes<Account>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare number: number;
  declare type_id: number;

  declare Type?: CoaType; // Association
  declare AttachedJournals?: NonAttribute<Journals[]>;
  declare JournalsAsPrimaryCash?: NonAttribute<Journals[]>;
}

Account.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  },
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
    sequelize,
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: false,
});

class Journals extends Model<InferAttributes<Journals>, InferCreationAttributes<Journals>> {
  declare id: number;
  declare name: string;
  declare primary_cash_account_id: number;

  declare AttachedAccounts?: NonAttribute<Account[]>;
  declare PrimaryCashAccount?: NonAttribute<Account>;
}

Journals.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  primary_cash_account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
    sequelize,
    modelName: 'Journals',
    tableName: 'journals',
    timestamps: false,
});

class SingleEntry extends Model<InferAttributes<SingleEntry>, InferCreationAttributes<SingleEntry>> {

  declare id: CreationOptional<number>;
  declare journal_id: number;
  declare secondary_account_id: number;
  declare value: number;
  declare direction: string;
  declare description?: string;
}

SingleEntry.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  journal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  secondary_account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  direction: {
    type: DataTypes.ENUM('IN', 'OUT'),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
    sequelize,
    modelName: 'SingleEntry',
    tableName: 'single_entries',
    timestamps: false,
});

class JournalEntry extends Model<InferAttributes<JournalEntry>, InferCreationAttributes<JournalEntry>> {
  declare id: CreationOptional<number>;
  declare single_entry_id: number;
  declare journal_id: number;
  declare account_id: number;
  declare description?: string;
  declare debit: number;
  declare credit: number;
}

JournalEntry.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  single_entry_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  journal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  debit: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  credit: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
}, {
    sequelize,
    modelName: 'JournalEntry',
    tableName: 'journal_entries',
    timestamps: false,
});

class JournalAccounts extends Model<InferAttributes<JournalAccounts>, InferCreationAttributes<JournalAccounts>> {
  declare journal_id: number;
  declare account_id: number;
}

JournalAccounts.init({
  journal_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  account_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
    sequelize,
    modelName: 'JournalAccounts',
    tableName: 'journal_accounts',
    timestamps: false,
});

// Associations

// Account table foreign keys/References
Account.belongsTo(CoaType, { foreignKey: 'type_id', as: 'Type' });
CoaType.hasMany(Account, { foreignKey: 'type_id'});

// SingleEntry table foreign keys/References
SingleEntry.belongsTo(Journals, { foreignKey: 'journal_id', as: 'Journal' });
Journals.hasMany(SingleEntry, { foreignKey: 'journal_id' });

SingleEntry.belongsTo(Account, { foreignKey: 'secondary_account_id', as: 'SecondaryAccount' });
Account.hasMany(SingleEntry, { foreignKey: 'secondary_account_id' });

// Journals table foreign keys/References
Journals.belongsTo(Account, { 
  foreignKey: 'primary_cash_account_id', 
  as: 'PrimaryCashAccount' 
});
// HasMany: Journals where this account is the main cash account
Account.hasMany(Journals, { 
  foreignKey: 'primary_cash_account_id',
  as: 'JournalsAsPrimaryCash'   // unique!
});

// JournalEntry table foreign keys/References
JournalEntry.belongsTo(SingleEntry, { foreignKey: 'single_entry_id', as: 'SingleEntry' });
SingleEntry.hasMany(JournalEntry, { foreignKey: 'single_entry_id' });

JournalEntry.belongsTo(Journals, { foreignKey: 'journal_id', as: 'Journal' });
Journals.hasMany(JournalEntry, { foreignKey: 'journal_id' });

JournalEntry.belongsTo(Account, { foreignKey: 'account_id', as: 'Account' });
Account.hasMany(JournalEntry, { foreignKey: 'account_id' });

// Many-to-Many: Accounts that are "attached" to a journal (e.g. for reporting)
Account.belongsToMany(Journals, {
  through: JournalAccounts,
  foreignKey: 'account_id',
  otherKey: 'journal_id',
  as: 'AttachedJournals',     // ← clear meaning
  timestamps: false,
});

Journals.belongsToMany(Account, {
  through: JournalAccounts,
  foreignKey: 'journal_id',
  otherKey: 'account_id',
  as: 'AttachedAccounts',
  timestamps: false,
});

// Export models
export {
  Account,
  Journals,
  CoaType,
  SingleEntry,
  JournalEntry,
  JournalAccounts
};