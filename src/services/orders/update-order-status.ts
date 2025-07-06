import { OrderStatus } from "@/database/sequelize/models/order";
import { OrdersRepository } from "@/repositories/orders-repository";
import { OrderNotFoundError } from "../_errors/order-not-found-error";
import { z } from "zod";

const updateOrderStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(OrderStatus),
})

export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusSchema>

export class UpdateOrderStatusService {
  constructor(private ordersRepository: OrdersRepository) { }

  async execute(data: UpdateOrderStatusRequest) {
    const { id: orderId, status: newStatus } = updateOrderStatusSchema.parse(data)

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      throw new OrderNotFoundError()
    }

    await this.ordersRepository.updateStatus(orderId, newStatus)
  }
}