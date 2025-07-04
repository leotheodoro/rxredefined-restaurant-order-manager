import { InMemoryDishesRepository } from "@/repositories/in-memory/in-memory-dishes-repository"
import { FindDishesService } from "./find-dishes"
import { DishCategory } from "@/database/sequelize/models/dish"
import { ZodError } from "zod"

let dishesRepository: InMemoryDishesRepository
let sut: FindDishesService

describe('Find Dishes Service', () => {
  beforeEach(() => {
    dishesRepository = new InMemoryDishesRepository()
    sut = new FindDishesService(dishesRepository)
  })

  it('should be able to find dishes', async () => {
    await dishesRepository.create({
      name: 'Pizza',
      description: 'Pizza with cheese and tomato',
      priceCents: 2950,
      category: DishCategory.MAIN_COURSE,
    })

    await dishesRepository.create({
      name: 'Salad',
      description: 'Salad with lettuce and tomato',
      priceCents: 1950,
      category: DishCategory.STARTER,
    })

    const { dishes } = await sut.execute({
      page: 1,
      limit: 10,
    })

    expect(dishes).toHaveLength(2)
  })

  it('should be able to find dishes by category', async () => {
    await dishesRepository.create({
      name: 'Pizza',
      description: 'Pizza with cheese and tomato',
      priceCents: 2950,
      category: DishCategory.MAIN_COURSE,
    })

    await dishesRepository.create({
      name: 'Salad',
      description: 'Salad with lettuce and tomato',
      priceCents: 1950,
      category: DishCategory.STARTER,
    })

    const { dishes } = await sut.execute({
      page: 1,
      limit: 10,
      category: DishCategory.MAIN_COURSE,
    })

    expect(dishes).toHaveLength(1)
    expect(dishes[0].name).toBe('Pizza')
  })

  it('should be able to find dishes by page', async () => {
    await dishesRepository.create({
      name: 'Pizza',
      description: 'Pizza with cheese and tomato',
      priceCents: 2950,
      category: DishCategory.MAIN_COURSE,
    })

    await dishesRepository.create({
      name: 'Salad',
      description: 'Salad with lettuce and tomato',
      priceCents: 1950,
      category: DishCategory.STARTER,
    })

    const { dishes } = await sut.execute({
      page: 2,
      limit: 1,
    })

    expect(dishes).toHaveLength(1)
    expect(dishes[0].name).toBe('Salad')
  })

  it('should not be able to find dishes with invalid category', async () => {
    await expect(sut.execute({
      page: 1,
      limit: 10,
      category: 'invalid' as DishCategory,
    })).rejects.toThrow(ZodError)
  })

  it('should be able to return the total number of dishes', async () => {
    await dishesRepository.create({
      name: 'Pizza',
      description: 'Pizza with cheese and tomato',
      priceCents: 2950,
      category: DishCategory.MAIN_COURSE,
    })

    await dishesRepository.create({
      name: 'Salad',
      description: 'Salad with lettuce and tomato',
      priceCents: 1950,
      category: DishCategory.STARTER,
    })

    const { total } = await sut.execute({
      page: 1,
      limit: 1,
    })

    expect(total).toBe(2)
  })
})