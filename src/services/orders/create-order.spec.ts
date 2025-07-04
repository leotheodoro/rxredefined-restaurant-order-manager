import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository";
import { InMemoryDishesRepository } from "@/repositories/in-memory/in-memory-dishes-repository";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository";
import { CreateOrderService } from "./create-order";
import { randomUUID } from "crypto";
import { DishCategory } from "@/database/sequelize/models/dish";
import { CustomerNotFoundError } from "../_errors/customer-not-found-error";
import { DishNotFoundError } from "../_errors/dish-not-found-error";

let customersRepository: InMemoryCustomersRepository
let dishesRepository: InMemoryDishesRepository
let ordersRepository: InMemoryOrdersRepository
let sut: CreateOrderService

beforeEach(() => {
  customersRepository = new InMemoryCustomersRepository()
  dishesRepository = new InMemoryDishesRepository()
  ordersRepository = new InMemoryOrdersRepository()

  sut = new CreateOrderService(ordersRepository, customersRepository, dishesRepository)
})

describe("Create Order Service", () => {
  it("should create a new order with valid data", async () => {
    const customer = await customersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
    })

    const dish = await dishesRepository.create({
      name: "Pizza",
      description: "Delicious pizza",
      priceCents: 1500,
      category: DishCategory.MAIN_COURSE,
    })

    const response = await sut.execute({
      customerId: customer.id,
      items: [
        {
          dishId: dish.id,
          quantity: 2,
        },
      ],
    })

    expect(response.order.id).toEqual(expect.any(String))
    expect(response.order.totalAmountCents).toBe(3000)
  })

  it("should throw an error if customer does not exist", async () => {
    const dish = await dishesRepository.create({
      name: "Burger",
      description: "Yummy",
      priceCents: 1000,
      category: DishCategory.MAIN_COURSE,
    })

    await expect(() => sut.execute({
      customerId: randomUUID(),
      items: [{ dishId: dish.id, quantity: 1 }],
    })).rejects.toBeInstanceOf(CustomerNotFoundError)
  })

  it("should throw an error if dish does not exist", async () => {
    const customer = await customersRepository.create({
      name: "Jane",
      email: "jane@example.com",
      phone: "987654321",
    })

    await expect(() => sut.execute({
      customerId: customer.id,
      items: [{ dishId: randomUUID(), quantity: 1 }],
    })).rejects.toBeInstanceOf(DishNotFoundError)
  })
}) 