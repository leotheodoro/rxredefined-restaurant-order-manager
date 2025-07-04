import { randomUUID } from "crypto";
import { DishAttributes, DishCategory, DishCreationAttributes } from "../../database/sequelize/models/dish";
import { DishesRepository } from "../dishes-repository";

export class InMemoryDishesRepository implements DishesRepository {
  public dishes: DishAttributes[] = []

  async create(data: DishCreationAttributes): Promise<DishAttributes> {
    const dish: DishAttributes = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.dishes.push(dish)
    return dish
  }

  async find({
    page,
    limit,
    category
  }: {
    page: number
    limit: number
    category?: DishCategory
  }): Promise<DishAttributes[]> {
    const filteredDishes = category
      ? this.dishes.filter((dish) => dish.category === category)
      : this.dishes;

    return filteredDishes
      .slice((page - 1) * limit, page * limit)
      .map((dish) => ({
        ...dish,
        price: dish.price / 100,
      }));
  }
}