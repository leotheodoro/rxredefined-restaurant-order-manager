import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../lib/sequelize";

export enum OrderStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  READY = "ready",
  DELIVERED = "delivered",
  CANCELED = "canceled",
}

export interface OrderAttributes {
  id: string;
  customerId: string;
  status: OrderStatus;
  totalAmountCents: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type OrderCreationAttributes = Optional<OrderAttributes, "id" | "status" | "totalAmountCents" | "createdAt" | "updatedAt" | "deletedAt">;

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public customerId!: string;
  public status!: OrderStatus;
  public totalAmountCents!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  static initialize() {
    Order.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: "id",
        },
        customerId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "customer_id",
        },
        status: {
          type: DataTypes.ENUM(...Object.values(OrderStatus)),
          allowNull: false,
          defaultValue: OrderStatus.PENDING,
          field: "status",
        },
        totalAmountCents: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0,
          },
          field: "total_amount_cents",
        },
      },
      {
        sequelize,
        modelName: "Order",
        tableName: "orders",
        timestamps: true,
        paranoid: true,
      }
    );
  }
}

Order.initialize(); 