import { DishCategory } from '@/database/sequelize/models/dish'
import { makeCreateDishService } from '@/services/_factories/dishes/make-create-dish-service'
import { Request, Response } from 'express'
import { z } from 'zod'

const createDishBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceCents: z.coerce.number().int().min(0, { message: 'Price must be greater or equal to 0' }),
  category: z.nativeEnum(DishCategory),
})

export const createDishController = async (request: Request, response: Response) => {
  const { name, description, priceCents, category } =
    createDishBodySchema.parse(request.body)

  const createDishService = makeCreateDishService()

  const { dish } = await createDishService.execute({
    name,
    description,
    priceCents,
    category,
  })

  response.status(201).send(dish)
}
