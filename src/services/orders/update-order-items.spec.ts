import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository";
import { InMemoryDishesRepository } from "@/repositories/in-memory/in-memory-dishes-repository";
import { UpdateOrderItemsService } from "./update-order-items";
import { OrderStatus } from "@/database/sequelize/models/order";
import { DishCategory } from "@/database/sequelize/models/dish";
import { OrderCannotBeUpdatedError } from "../_errors/order-cannot-be-updated-error";
import { DishNotFoundError } from "../_errors/dish-not-found-error";
import { OrderNotFoundError } from "../_errors/order-not-found-error";
import { randomUUID } from "crypto";
import { ZodError } from "zod";

let ordersRepository: InMemoryOrdersRepository
let dishesRepository: InMemoryDishesRepository
let sut: UpdateOrderItemsService

describe("UpdateOrderItemsService", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    dishesRepository = new InMemoryDishesRepository()
    sut = new UpdateOrderItemsService(ordersRepository, dishesRepository)
  })

  it("should be able to update the items of an order", async () => {
    const dish1 = await dishesRepository.create({
      name: "Pizza",
      description: "Delicious",
      priceCents: 1000,
      category: DishCategory.MAIN_COURSE,
    })

    const dish2 = await dishesRepository.create({
      name: "Soda",
      description: "Refreshing",
      priceCents: 500,
      category: DishCategory.DRINK,
    })

    const order = await ordersRepository.create({
      customerId: "customer-id",
      status: OrderStatus.PENDING,
      items: [
        {
          dishId: dish1.id,
          quantity: 1,
          unitPriceCents: dish1.priceCents,
        },
      ],
    })

    await sut.execute({
      id: order.id,
      items: [
        {
          dishId: dish2.id,
          quantity: 2,
        },
      ],
    })

    const updatedOrder = await ordersRepository.findById(order.id)
    expect(updatedOrder?.totalAmountCents).toBe(dish2.priceCents * 2)
  })

  it("should not allow updating items if order is not pending or preparing", async () => {
    const dish = await dishesRepository.create({
      name: "Burger",
      description: "Tasty",
      priceCents: 800,
      category: DishCategory.MAIN_COURSE,
    })

    const order = await ordersRepository.create({
      customerId: "customer-id",
      status: OrderStatus.DELIVERED,
      items: [
        {
          dishId: dish.id,
          quantity: 1,
          unitPriceCents: dish.priceCents,
        },
      ],
    })

    await expect(
      sut.execute({
        id: order.id,
        items: [
          {
            dishId: dish.id,
            quantity: 2,
          },
        ],
      })
    ).rejects.toThrow(OrderCannotBeUpdatedError)
  })

  it("should throw if dish does not exist", async () => {
    const order = await ordersRepository.create({
      customerId: "customer-id",
      status: OrderStatus.PENDING,
      items: [
        {
          dishId: randomUUID(),
          quantity: 1,
          unitPriceCents: 1000,
        },
      ],
    })

    await expect(
      sut.execute({
        id: order.id,
        items: [
          {
            dishId: randomUUID(),
            quantity: 1,
          },
        ],
      })
    ).rejects.toThrow(DishNotFoundError)
  })

  it("should throw if order does not exist", async () => {
    await expect(
      sut.execute({
        id: randomUUID(),
        items: [
          {
            dishId: randomUUID(),
            quantity: 1,
          },
        ],
      })
    ).rejects.toThrow(OrderNotFoundError)
  })

  it("should throw validation error for empty items", async () => {
    await expect(
      sut.execute({
        id: randomUUID(),
        items: [] as unknown as [{ dishId: string; quantity: number }],
      })
    ).rejects.toThrow(ZodError)
  })
}) 