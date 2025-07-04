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
  price: number;
  category: DishCategory;
  createdAt?: Date;
  updatedAt?: Date;
}

export type DishCreationAttributes = Optional<DishAttributes, "id" | "createdAt" | "updatedAt">;

export class Dish extends Model<DishAttributes, DishCreationAttributes> implements DishAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: DishCategory;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize() {
    Dish.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
          },
        },
        category: {
          type: DataTypes.ENUM(DishCategory.STARTER, DishCategory.MAIN_COURSE, DishCategory.DESSERT, DishCategory.DRINK),
          allowNull: false,
          validate: {
            isIn: [Object.values(DishCategory)],
          },
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
