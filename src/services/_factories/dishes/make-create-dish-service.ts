import { InMemoryDishesRepository } from "@/repositories/in-memory/in-memory-dishes-repository"
import { CreateDishService } from "@/services/dishes/create-dish"


export function makeCreateDishService() {
  const dishesRepository = new InMemoryDishesRepository()
  const createDishService = new CreateDishService(dishesRepository)

  return createDishService
}
