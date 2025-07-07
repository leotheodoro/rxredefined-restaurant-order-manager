import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../lib/sequelize";

export interface CustomerAttributes {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CustomerCreationAttributes = Optional<CustomerAttributes, "id" | "createdAt" | "updatedAt">;

export class Customer extends Model<CustomerAttributes, CustomerCreationAttributes>
  implements CustomerAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare phone: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initialize() {
    Customer.init(
      {
        id: {
          type: DataTypes.UUID,
          autoIncrement: true,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
            notEmpty: true,
          },
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        sequelize,
        modelName: "Customer",
        tableName: "customers",
        timestamps: true,
        indexes: [
          {
            unique: true,
            fields: ["email"],
          },
        ],
      }
    );
  }
}

Customer.initialize();
