import { makeFindOrdersByCustomerService } from "@/services/_factories/orders/make-find-orders-by-customer-service"
import { Request, Response } from "express"
import { z } from "zod"
import { CustomerNotFoundError } from "@/services/_errors/customer-not-found-error"

const findOrdersParamsSchema = z.object({
  customerId: z.string().uuid(),
})

const findOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
})

export const findOrdersByCustomerController = async (request: Request, response: Response) => {
  const { customerId } = findOrdersParamsSchema.parse(request.params)
  const { page, limit } = findOrdersQuerySchema.parse(request.query)

  try {
    const findOrdersByCustomerService = makeFindOrdersByCustomerService()

    const { orders, total } = await findOrdersByCustomerService.execute({
      customerId,
      page,
      limit,
    })

    return response.status(200).send({ orders, total })
  } catch (error) {
    if (error instanceof CustomerNotFoundError) {
      return response.status(404).send({ message: error.message })
    }

    throw error
  }
} 