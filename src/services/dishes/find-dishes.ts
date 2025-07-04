import { DishCategory } from "@/database/sequelize/models/dish"
import { DishesRepository } from "@/repositories/dishes-repository"
import { z } from "zod"

const findDishesSchema = z.object({
  page: z.number().min(1, { message: "Page must be greater or equal to 1" }),
  limit: z.number().min(1, { message: "Limit must be greater or equal to 1" }),
  category: z.nativeEnum(DishCategory).optional(),
})

type FindDishesRequest = z.infer<typeof findDishesSchema>

export class FindDishesService {
  constructor(private dishesRepository: DishesRepository) { }

  async execute(data: FindDishesRequest) {
    const { page, limit, category } = findDishesSchema.parse(data)

    const dishes = await this.dishesRepository.find({
      page,
      limit,
      category
    })

    const total = await this.dishesRepository.count(category)

    return { dishes, total }
  }
}