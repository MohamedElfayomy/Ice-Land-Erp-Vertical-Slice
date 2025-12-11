"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalEntry = exports.SingleEntry = exports.Journal = exports.Account = exports.COAType = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
// --- Define COAType model ---
exports.COAType = sequelize_2.default.define("coa_types", {
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
    timestamps: false,
});
// --- Define accounts model ---
exports.Account = sequelize_2.default.define("accounts", {
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
    timestamps: false,
});
// --- Define Journal model ---
exports.Journal = sequelize_2.default.define("journals", {
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
    timestamps: false,
});
// --- Define SingleEntry model ---
exports.SingleEntry = sequelize_2.default.define("single_entries", {
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
    timestamps: false,
});
// --- Define JournalEntry model ---
exports.JournalEntry = sequelize_2.default.define("journal_entries", {
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
    debit: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    credit: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    timestamps: false,
});
// --- Define associations ---
// Account table foreign keys/References
exports.Account.belongsTo(exports.COAType, { foreignKey: 'type_id', as: 'Type' });
exports.COAType.hasMany(exports.Account, { foreignKey: 'type_id' });
// SingleEntry table foreign keys/References
exports.SingleEntry.belongsTo(exports.Journal, { foreignKey: 'journal_id', as: 'Journal' });
exports.Journal.hasMany(exports.SingleEntry, { foreignKey: 'journal_id' });
exports.SingleEntry.belongsTo(exports.Account, { foreignKey: 'secondary_account_id', as: 'SecondaryAccount' });
exports.Account.hasMany(exports.SingleEntry, { foreignKey: 'secondary_account_id' });
// Journals table foreign keys/References
exports.Journal.belongsTo(exports.Account, { foreignKey: 'primary_cash_account_id', as: 'PrimaryCashAccount' });
exports.Account.hasMany(exports.Journal, { foreignKey: 'primary_cash_account_id' });
// JournalEntry table foreign keys/References
exports.JournalEntry.belongsTo(exports.SingleEntry, { foreignKey: 'single_entry_id', as: 'SingleEntry' });
exports.SingleEntry.hasMany(exports.JournalEntry, { foreignKey: 'single_entry_id' });
exports.JournalEntry.belongsTo(exports.Journal, { foreignKey: 'journal_id', as: 'Journal' });
exports.Journal.hasMany(exports.JournalEntry, { foreignKey: 'journal_id' });
exports.JournalEntry.belongsTo(exports.Account, { foreignKey: 'account_id', as: 'Account' });
exports.Account.hasMany(exports.JournalEntry, { foreignKey: 'account_id' });
// Journal accounts Junction table associations for many-to-many relationships
exports.Account.belongsToMany(exports.Journal, {
    through: 'journal_accounts',
    foreignKey: 'account_id',
    otherKey: 'journal_id',
    as: 'Journals',
    timestamps: false,
});
exports.Journal.belongsToMany(exports.Account, {
    through: 'Journal_accounts',
    foreignKey: 'journal_id',
    otherKey: 'account_id',
    as: 'Accounts',
    timestamps: false,
});
function initModels() {
    return {
        COAType: exports.COAType,
        Account: exports.Account,
        Journal: exports.Journal,
        SingleEntry: exports.SingleEntry,
        JournalEntry: exports.JournalEntry,
    };
}
exports.default = initModels;
