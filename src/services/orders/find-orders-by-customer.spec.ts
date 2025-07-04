import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository";
import { FindOrdersByCustomerService } from "./find-orders-by-customer";
import { InMemoryDishesRepository } from "@/repositories/in-memory/in-memory-dishes-repository";
import { DishCategory } from "@/database/sequelize/models/dish";
import { OrderStatus } from "@/database/sequelize/models/order";
import { CustomerNotFoundError } from "../_errors/customer-not-found-error";

let customersRepository: InMemoryCustomersRepository
let ordersRepository: InMemoryOrdersRepository
let dishesRepository: InMemoryDishesRepository
let sut: FindOrdersByCustomerService

describe("Find Orders By Customer Service", () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    ordersRepository = new InMemoryOrdersRepository()
    dishesRepository = new InMemoryDishesRepository()

    sut = new FindOrdersByCustomerService(ordersRepository, customersRepository)
  })

  it("should be able to find orders by customer id", async () => {
    const customer = await customersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
    })

    const dish = await dishesRepository.create({
      name: "Pizza",
      description: "Pizza description",
      priceCents: 1000,
      category: DishCategory.MAIN_COURSE,
    })

    await ordersRepository.create({
      customerId: customer.id,
      items: [
        {
          dishId: dish.id,
          quantity: 1,
          unitPriceCents: 1000,
        },
      ],
    })

    const orders = await sut.execute({ customerId: customer.id })

    expect(orders).toHaveLength(1)
    expect(orders[0].customerId).toBe(customer.id)
    expect(orders[0].totalAmountCents).toBe(1000)
    expect(orders[0].status).toBe(OrderStatus.PENDING)
    expect(orders[0].items).toHaveLength(1)
  })

  it("should throw an error if customer does not exist", async () => {
    await expect(sut.execute({ customerId: "non-existing-customer-id" })).rejects.toThrow(CustomerNotFoundError)
  })
})