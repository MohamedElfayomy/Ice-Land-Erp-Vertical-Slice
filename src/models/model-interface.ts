import { CreationOptional, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { COAType } from "./init-models";


export interface ICOAType extends Model<InferAttributes<ICOAType>, InferCreationAttributes<ICOAType>> {
    id: CreationOptional<number>;
    name: string;
    normal_balance_code: string; // Using string to match your TEXT/VARCHAR column
}

export interface IAccount extends Model<InferAttributes<IAccount>, InferCreationAttributes<IAccount>> {
    id: CreationOptional<number>;
    name: string;
    account_number: number;
    type_id: number;
    
    // --- ASSOCIATIONS ---
    // This is the crucial line: it tells TypeScript that when we use 'include' 
    // with the alias 'Type', an instance of COAType will be present on the model.
    Type?: NonAttribute<InstanceType<typeof COAType>>;
}