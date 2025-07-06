import { OrdersRepository } from "@/repositories/orders-repository";
import { DishesRepository } from "@/repositories/dishes-repository";
import { OrderStatus } from "@/database/sequelize/models/order";
import { z } from "zod";
import { OrderNotFoundError } from "../_errors/order-not-found-error";
import { DishNotFoundError } from "../_errors/dish-not-found-error";
import { OrderCannotBeUpdatedError } from "../_errors/order-cannot-be-updated-error";

const itemSchema = z.object({
  dishId: z.string().uuid(),
  quantity: z.number().int().min(1, { message: "Quantity must be greater than 0" }),
})

const updateOrderItemsSchema = z.object({
  id: z.string().uuid(),
  items: z.array(itemSchema).nonempty({ message: "Items cannot be empty" }),
})

export type UpdateOrderItemsRequest = z.infer<typeof updateOrderItemsSchema>

export class UpdateOrderItemsService {
  constructor(private ordersRepository: OrdersRepository, private dishesRepository: DishesRepository) { }

  async execute(request: UpdateOrderItemsRequest) {
    const { id: orderId, items } = updateOrderItemsSchema.parse(request)

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      throw new OrderNotFoundError()
    }

    if (![OrderStatus.PENDING, OrderStatus.PREPARING].includes(order.status)) {
      throw new OrderCannotBeUpdatedError()
    }

    const itemsWithSnapshottedPrice: { dishId: string; quantity: number; unitPriceCents: number }[] = []

    for (const item of items) {
      const dish = await this.dishesRepository.findById(item.dishId)

      if (!dish) {
        throw new DishNotFoundError()
      }

      itemsWithSnapshottedPrice.push({
        dishId: dish.id,
        quantity: item.quantity,
        unitPriceCents: dish.priceCents,
      })
    }

    await this.ordersRepository.updateItems(orderId, itemsWithSnapshottedPrice)
  }
} 