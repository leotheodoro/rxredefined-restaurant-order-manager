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

/**
 * @openapi
 * /order:
 *   post:
 *     summary: Create an order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, items]
 *             properties:
 *               customerId:
 *                 type: string
 *                 format: uuid
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
 *       201:
 *         description: Order created
 *       404:
 *         description: Customer or Dish not found
 *       400:
 *         description: Validation error
 */
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