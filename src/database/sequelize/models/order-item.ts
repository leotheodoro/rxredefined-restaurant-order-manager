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
  declare id: string;
  declare orderId: string;
  declare dishId: string;
  declare quantity: number;
  declare unitPriceCents: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;

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
          field: "order_id",
        },
        dishId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "dish_id",
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
          field: "unit_price_cents",
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