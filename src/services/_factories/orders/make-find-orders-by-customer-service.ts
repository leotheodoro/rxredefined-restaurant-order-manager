import { SequelizeOrdersRepository } from "@/repositories/sequelize/sequelize-orders-repository"
import { SequelizeCustomersRepository } from "@/repositories/sequelize/sequelize-customers-repository"
import { FindOrdersByCustomerService } from "@/services/orders/find-orders-by-customer"

export function makeFindOrdersByCustomerService() {
  const ordersRepository = new SequelizeOrdersRepository()
  const customersRepository = new SequelizeCustomersRepository()

  const findOrdersByCustomerService = new FindOrdersByCustomerService(
    ordersRepository,
    customersRepository,
  )

  return findOrdersByCustomerService
} 