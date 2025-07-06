
import { CustomerAlreadyExistsError } from '@/services/_errors/customer-already-exists-erorr'
import { makeCreateCustomerService } from '@/services/_factories/customers/make-create-customer-service'
import { Request, Response } from 'express'
import { z } from 'zod'

const createCustomerBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
})

export const createCustomerController = async (request: Request, response: Response) => {
  const { name, email, phone } =
    createCustomerBodySchema.parse(request.body)

  try {
    const createCustomerService = makeCreateCustomerService()

    const { customer } = await createCustomerService.execute({
      name,
      email,
      phone
    })

    response.status(201).send(customer)
  } catch (error) {
    if (error instanceof CustomerAlreadyExistsError) {
      response.status(409).send({ message: 'Customer e-mail already exists' })
      return
    }

    throw error
  }
}