import { SequelizeOrdersRepository } from "@/repositories/sequelize/sequelize-orders-repository"
import { SequelizeCustomersRepository } from "@/repositories/sequelize/sequelize-customers-repository"
import { SequelizeDishesRepository } from "@/repositories/sequelize/sequelize-dishes-repository"
import { CreateOrderService } from "@/services/orders/create-order"

export function makeCreateOrderService() {
  const ordersRepository = new SequelizeOrdersRepository()
  const customersRepository = new SequelizeCustomersRepository()
  const dishesRepository = new SequelizeDishesRepository()

  const createOrderService = new CreateOrderService(
    ordersRepository,
    customersRepository,
    dishesRepository,
  )

  return createOrderService
} 