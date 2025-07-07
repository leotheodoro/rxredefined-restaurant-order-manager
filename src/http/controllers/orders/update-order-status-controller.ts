import { makeUpdateOrderStatusService } from "@/services/_factories/orders/make-update-order-status-service"
import { Request, Response } from "express"
import { z } from "zod"
import { OrderStatus } from "@/database/sequelize/models/order"
import { OrderNotFoundError } from "@/services/_errors/order-not-found-error"

const updateOrderStatusParamsSchema = z.object({
  orderId: z.string().uuid(),
})

const updateOrderStatusBodySchema = z.object({
  status: z.nativeEnum(OrderStatus),
})

/**
 * @openapi
 * /order/{orderId}:
 *   patch:
 *     summary: Update Order Status
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, delivered, canceled]
 *     responses:
 *       204:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 *       400:
 *         description: Validation error
 */
export const updateOrderStatusController = async (request: Request, response: Response) => {
  const { orderId } = updateOrderStatusParamsSchema.parse(request.params)
  const { status } = updateOrderStatusBodySchema.parse(request.body)

  try {
    const updateOrderStatusService = makeUpdateOrderStatusService()

    await updateOrderStatusService.execute({ id: orderId, status })

    return response.status(204).send()
  } catch (error) {
    if (error instanceof OrderNotFoundError) {
      return response.status(404).send({ message: error.message })
    }

    throw error
  }
} 