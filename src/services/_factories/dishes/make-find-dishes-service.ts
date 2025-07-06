import { SequelizeDishesRepository } from "@/repositories/sequelize/sequelize-dishes-repository"
import { FindDishesService } from "@/services/dishes/find-dishes"


export function makeFindDishesService() {
  const dishesRepository = new SequelizeDishesRepository()
  const findDishesService = new FindDishesService(dishesRepository)

  return findDishesService
}
