import { makeUpdateOrderItemsService } from "@/services/_factories/orders/make-update-order-items-service"
import { Request, Response } from "express"
import { z } from "zod"
import { OrderNotFoundError } from "@/services/_errors/order-not-found-error"
import { DishNotFoundError } from "@/services/_errors/dish-not-found-error"
import { OrderCannotBeUpdatedError } from "@/services/_errors/order-cannot-be-updated-error"

const updateOrderItemsParamsSchema = z.object({
  orderId: z.string().uuid(),
})

const itemSchema = z.object({
  dishId: z.string().uuid(),
  quantity: z.number().int().min(1, { message: "Quantity must be greater than 0" }),
})

const updateOrderItemsBodySchema = z.object({
  items: z.array(itemSchema).nonempty({ message: "Items cannot be empty" }),
})

export const updateOrderItemsController = async (request: Request, response: Response) => {
  const { orderId } = updateOrderItemsParamsSchema.parse(request.params)
  const { items } = updateOrderItemsBodySchema.parse(request.body)

  try {
    const updateOrderItemsService = makeUpdateOrderItemsService()

    await updateOrderItemsService.execute({ id: orderId, items })

    return response.status(204).send()
  } catch (error) {
    if (error instanceof OrderNotFoundError || error instanceof DishNotFoundError) {
      return response.status(404).send({ message: error.message })
    }

    if (error instanceof OrderCannotBeUpdatedError) {
      return response.status(400).send({ message: error.message })
    }

    throw error
  }
} 