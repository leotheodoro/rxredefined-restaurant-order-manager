import { SequelizeDishesRepository } from "@/repositories/sequelize/sequelize-dishes-repository"
import { CreateDishService } from "@/services/dishes/create-dish"


export function makeCreateDishService() {
  const dishesRepository = new SequelizeDishesRepository()
  const createDishService = new CreateDishService(dishesRepository)

  return createDishService
}
