import { SequelizeOrdersRepository } from "@/repositories/sequelize/sequelize-orders-repository"
import { UpdateOrderStatusService } from "@/services/orders/update-order-status"

export function makeUpdateOrderStatusService() {
  const ordersRepository = new SequelizeOrdersRepository()

  const updateOrderStatusService = new UpdateOrderStatusService(ordersRepository)

  return updateOrderStatusService
} 