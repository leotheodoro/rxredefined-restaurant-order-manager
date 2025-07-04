import { InMemoryDishesRepository } from "@/repositories/in-memory/in-memory-dishes-repository"
import { CreateDishService } from "./create-dish"
import { DishCategory } from "@/database/sequelize/models/dish"

let dishesRepository: InMemoryDishesRepository
let sut: CreateDishService

describe('Create Dish Service', () => {
  beforeEach(() => {
    dishesRepository = new InMemoryDishesRepository()
    sut = new CreateDishService(dishesRepository)
  })

  it('should be able to create a new dish', async () => {
    const { dish } = await sut.execute({
      name: 'Pizza',
      description: 'Pizza with cheese and tomato',
      priceCents: 2950,
      category: DishCategory.MAIN_COURSE,
    })

    expect(dish.id).toEqual(expect.any(String))
  })
})