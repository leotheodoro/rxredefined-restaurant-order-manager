import { DishesRepository } from "../dishes-repository";
import { Dish, DishAttributes, DishCategory, DishCreationAttributes } from "@/database/sequelize/models/dish";

export class SequelizeDishesRepository implements DishesRepository {
  async create(data: DishCreationAttributes): Promise<DishAttributes> {
    const dish = await Dish.create(data)

    return dish
  }

  async find({ page, limit, category }: { page: number; limit: number; category?: DishCategory }): Promise<DishAttributes[]> {
    const where = category ? { category } : undefined

    const dishes = await Dish.findAll({
      where,
      offset: (page - 1) * limit,
      limit,
      order: [["createdAt", "DESC"]],
    })

    return dishes
  }

  async count(category?: DishCategory): Promise<number> {
    const where = category ? { category } : undefined

    return Dish.count({ where })
  }

  async findById(id: string): Promise<DishAttributes | null> {
    const dish = await Dish.findByPk(id)

    return dish
  }
} 