import { OrdersRepository } from "@/repositories/orders-repository";
import { CustomersRepository } from "@/repositories/customers-repository";
import { DishesRepository } from "@/repositories/dishes-repository";
import { z } from "zod";
import { CustomerNotFoundError } from "../_errors/customer-not-found-error";
import { DishNotFoundError } from "../_errors/dish-not-found-error";

const itemSchema = z.object({
  dishId: z.string().uuid(),
  quantity: z.number().int().min(1, { message: "Quantity must be greater than 0" }),
})

const createOrderSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(itemSchema).nonempty({ message: "Items cannot be empty" }),
})

export type CreateOrderRequest = z.infer<typeof createOrderSchema>

export class CreateOrderService {
  constructor(
    private ordersRepository: OrdersRepository,
    private customersRepository: CustomersRepository,
    private dishesRepository: DishesRepository,
  ) { }

  async execute(request: CreateOrderRequest) {
    const { customerId, items } = createOrderSchema.parse(request)

    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      throw new CustomerNotFoundError()
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

    const order = await this.ordersRepository.create({
      customerId,
      items: itemsWithSnapshottedPrice,
    })

    return { order }
  }
} 