import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../lib/sequelize";

export enum DishCategory {
  STARTER = "starter",
  MAIN_COURSE = "main_course",
  DESSERT = "dessert",
  DRINK = "drink",
}

export interface DishAttributes {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  category: DishCategory;
  createdAt?: Date;
  updatedAt?: Date;
}

export type DishCreationAttributes = Optional<DishAttributes, "id" | "createdAt" | "updatedAt">;

export class Dish extends Model<DishAttributes, DishCreationAttributes> implements DishAttributes {
  declare id: string;
  declare name: string;
  declare description: string;
  declare priceCents: number;
  declare category: DishCategory;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initialize() {
    Dish.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: "id",
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
          field: "name",
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
          field: "description",
        },
        priceCents: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
          },
          field: "price_cents",
        },
        category: {
          type: DataTypes.ENUM(DishCategory.STARTER, DishCategory.MAIN_COURSE, DishCategory.DESSERT, DishCategory.DRINK),
          allowNull: false,
          validate: {
            isIn: [Object.values(DishCategory)],
          },
          field: "category",
        },
      },
      {
        sequelize,
        modelName: "Dish",
        tableName: "dishes",
        timestamps: true,
      }
    );
  }
}

Dish.initialize();
