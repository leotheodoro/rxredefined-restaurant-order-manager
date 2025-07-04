import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../lib/sequelize";

export interface OrderItemAttributes {
  id: string;
  orderId: string;
  dishId: string;
  quantity: number;
  unitPriceCents: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type OrderItemCreationAttributes = Optional<OrderItemAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt">;

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: string;
  public orderId!: string;
  public dishId!: string;
  public quantity!: number;
  public unitPriceCents!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initialize() {
    OrderItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        dishId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
          },
        },
        unitPriceCents: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
          },
        },
      },
      {
        sequelize,
        modelName: "OrderItem",
        tableName: "order_items",
        timestamps: true,
        paranoid: true,
      }
    );
  }
}

OrderItem.initialize(); 