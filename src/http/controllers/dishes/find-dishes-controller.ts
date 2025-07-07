import { DishCategory } from '@/database/sequelize/models/dish'
import { makeFindDishesService } from '@/services/_factories/dishes/make-find-dishes-service'
import { Request, Response } from 'express'
import { z } from 'zod'

const findDishesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
  category: z.nativeEnum(DishCategory).optional(),
})

/**
 * @openapi
 * /menu:
 *   get:
 *     summary: List available dishes
 *     tags: [Dishes]
 *     responses:
 *       200:
 *         description: A list of dishes
 */
export const findDishesController = async (request: Request, response: Response) => {
  const { page, limit, category } = findDishesQuerySchema.parse(request.query)

  const findDishesService = makeFindDishesService()

  const { dishes, total } = await findDishesService.execute({
    page,
    limit,
    category,
  })

  response.status(200).send({ dishes, total })
}
