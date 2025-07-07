import { SequelizeOrdersRepository } from "@/repositories/sequelize/sequelize-orders-repository"
import { SequelizeDishesRepository } from "@/repositories/sequelize/sequelize-dishes-repository"
import { UpdateOrderItemsService } from "@/services/orders/update-order-items"

export function makeUpdateOrderItemsService() {
  const ordersRepository = new SequelizeOrdersRepository()
  const dishesRepository = new SequelizeDishesRepository()

  const updateOrderItemsService = new UpdateOrderItemsService(
    ordersRepository,
    dishesRepository,
  )

  return updateOrderItemsService
} 