import { OrderStatus } from "@/database/sequelize/models/order"
import { UpdateOrderStatusService } from "./update-order-status"
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository"
import { OrderNotFoundError } from "../_errors/order-not-found-error"
import { randomUUID } from "crypto"
import { ZodError } from "zod"

let ordersRepository: InMemoryOrdersRepository
let sut: UpdateOrderStatusService


describe("UpdateOrderStatusService", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new UpdateOrderStatusService(ordersRepository)
  })

  it("should be able to update the status of an order", async () => {
    const order = await ordersRepository.create({
      customerId: "customer-id",
      status: OrderStatus.PENDING,
      totalAmountCents: 1000,
      items: [{
        dishId: "dish-id",
        quantity: 1,
        unitPriceCents: 1000,
      }]
    })

    await sut.execute({
      id: order.id,
      status: OrderStatus.DELIVERED,
    })

    const updatedOrder = await ordersRepository.findById(order.id)

    expect(updatedOrder?.status).toBe(OrderStatus.DELIVERED)
  })

  it("should throw an error if the order does not exist", async () => {
    await expect(sut.execute({
      id: randomUUID(),
      status: OrderStatus.DELIVERED,
    })).rejects.toThrow(OrderNotFoundError)
  })

  it("should throw an error if the status is invalid", async () => {
    const order = await ordersRepository.create({
      customerId: "customer-id",
      status: OrderStatus.PENDING,
      totalAmountCents: 1000,
      items: [{
        dishId: "dish-id",
        quantity: 1,
        unitPriceCents: 1000,
      }]
    })

    await expect(sut.execute({
      id: order.id,
      status: "invalid-status" as OrderStatus,
    })).rejects.toThrow(ZodError)
  })
})