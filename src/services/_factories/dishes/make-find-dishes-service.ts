import { InMemoryDishesRepository } from "@/repositories/in-memory/in-memory-dishes-repository"
import { FindDishesService } from "@/services/dishes/find-dishes"


export function makeFindDishesService() {
  const dishesRepository = new InMemoryDishesRepository()
  const findDishesService = new FindDishesService(dishesRepository)

  return findDishesService
}
