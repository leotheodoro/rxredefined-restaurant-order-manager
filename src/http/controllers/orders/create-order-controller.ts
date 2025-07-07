import { makeCreateOrderService } from "@/services/_factories/orders/make-create-order-service"
import { Request, Response } from "express"
import { z } from "zod"
import { CustomerNotFoundError } from "@/services/_errors/customer-not-found-error"
import { DishNotFoundError } from "@/services/_errors/dish-not-found-error"

const itemSchema = z.object({
  dishId: z.string().uuid(),
  quantity: z.number().int().min(1, { message: "Quantity must be greater than 0" }),
})

const createOrderBodySchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(itemSchema).nonempty({ message: "Items cannot be empty" }),
})

export const createOrderController = async (request: Request, response: Response) => {
  const { customerId, items } = createOrderBodySchema.parse(request.body)

  try {
    const createOrderService = makeCreateOrderService()

    const { order } = await createOrderService.execute({
      customerId,
      items,
    })

    return response.status(201).send(order)
  } catch (error) {
    if (error instanceof CustomerNotFoundError || error instanceof DishNotFoundError) {
      return response.status(404).send({ message: error.message })
    }

    throw error
  }
} 