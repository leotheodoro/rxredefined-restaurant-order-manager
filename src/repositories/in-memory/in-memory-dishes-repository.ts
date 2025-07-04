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
      priceCents: data.priceCents,
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
        priceCents: dish.priceCents,
      }));
  }

  async count(category?: DishCategory): Promise<number> {
    const filteredDishes = category
      ? this.dishes.filter((dish) => dish.category === category)
      : this.dishes;

    return filteredDishes.length;
  }

  async findById(id: string): Promise<DishAttributes | null> {
    const dish = this.dishes.find((dish) => dish.id === id)
    if (!dish) return null
    return dish
  }
}