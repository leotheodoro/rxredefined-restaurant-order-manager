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

/**
 * @openapi
 * /order/modify/{orderId}:
 *   patch:
 *     summary: Modify an Order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [dishId, quantity]
 *                   properties:
 *                     dishId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *     responses:
 *       204:
 *         description: Order items updated
 *       404:
 *         description: Order or dish not found
 *       400:
 *         description: Validation error
 */
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