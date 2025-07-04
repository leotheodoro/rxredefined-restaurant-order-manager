import { DishAttributes, DishCreationAttributes } from "../database/sequelize/models/dish";

export interface DishesRepository {
  create(data: DishCreationAttributes): Promise<DishAttributes>
}