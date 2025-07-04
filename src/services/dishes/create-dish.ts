import { DishCategory } from "@/database/sequelize/models/dish"
import { DishesRepository } from "@/repositories/dishes-repository"
import { z } from "zod"

const createDishSchema = z.object({
  name: z.string(),
  description: z.string(),
  priceCents: z.coerce.number().int().min(0, { message: "Price must be greater or equal to 0" }),
  category: z.nativeEnum(DishCategory),
})

type CreateDishRequest = z.infer<typeof createDishSchema>

export class CreateDishService {
  constructor(private dishesRepository: DishesRepository) { }

  async execute(request: CreateDishRequest) {
    const { name, description, priceCents, category } = createDishSchema.parse(request)

    const dish = await this.dishesRepository.create({
      name,
      description,
      priceCents,
      category,
    })

    return { dish }
  }
}