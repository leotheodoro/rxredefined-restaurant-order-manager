import { randomUUID } from "crypto";
import { DishAttributes, DishCreationAttributes } from "../../database/sequelize/models/dish";
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
}