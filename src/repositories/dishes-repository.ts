import { DishAttributes, DishCategory, DishCreationAttributes } from "../database/sequelize/models/dish";

export interface DishesRepository {
  create(data: DishCreationAttributes): Promise<DishAttributes>
  find({
    page,
    limit,
    category
  }: {
    page: number
    limit: number,
    category?: DishCategory
  }): Promise<DishAttributes[]>
}