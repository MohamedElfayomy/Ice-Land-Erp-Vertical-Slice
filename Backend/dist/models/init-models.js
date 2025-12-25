"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalAccounts = exports.JournalEntry = exports.SingleEntry = exports.CoaType = exports.Journals = exports.Account = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
class CoaType extends sequelize_1.Model {
}
exports.CoaType = CoaType;
CoaType.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    normal_balance_code: {
        type: sequelize_1.DataTypes.ENUM('Debit', 'Credit'),
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.default,
    modelName: 'CoaType',
    tableName: 'coa_types',
    timestamps: false,
});
class Account extends sequelize_1.Model {
}
exports.Account = Account;
Account.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    account_number: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    type_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.default,
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: false,
});
class Journals extends sequelize_1.Model {
}
exports.Journals = Journals;
Journals.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    primary_cash_account_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.default,
    modelName: 'Journals',
    tableName: 'journals',
    timestamps: false,
});
class SingleEntry extends sequelize_1.Model {
}
exports.SingleEntry = SingleEntry;
SingleEntry.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    journal_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    secondary_account_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    direction: {
        type: sequelize_1.DataTypes.ENUM('IN', 'OUT'),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: sequelize_2.default,
    modelName: 'SingleEntry',
    tableName: 'single_entries',
    timestamps: false,
});
class JournalEntry extends sequelize_1.Model {
}
exports.JournalEntry = JournalEntry;
JournalEntry.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    single_entry_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    journal_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    account_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    debit: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    credit: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.default,
    modelName: 'JournalEntry',
    tableName: 'journal_entries',
    timestamps: false,
});
class JournalAccounts extends sequelize_1.Model {
}
exports.JournalAccounts = JournalAccounts;
JournalAccounts.init({
    journal_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
    },
    account_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
    },
}, {
    sequelize: sequelize_2.default,
    modelName: 'JournalAccounts',
    tableName: 'journal_accounts',
    timestamps: false,
});
// Associations
// Account table foreign keys/References
Account.belongsTo(CoaType, { foreignKey: 'type_id', as: 'Type' });
CoaType.hasMany(Account, { foreignKey: 'type_id' });
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
    as: 'JournalsAsPrimaryCash' // unique!
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
    as: 'AttachedJournals', // ← clear meaning
    timestamps: false,
});
Journals.belongsToMany(Account, {
    through: JournalAccounts,
    foreignKey: 'journal_id',
    otherKey: 'account_id',
    as: 'AttachedAccounts',
    timestamps: false,
});
