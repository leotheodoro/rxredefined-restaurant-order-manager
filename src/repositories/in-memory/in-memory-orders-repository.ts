import { randomUUID } from "crypto";
import { OrderAttributes, OrderCreationAttributes, OrderStatus } from "../../database/sequelize/models/order";
import { OrdersRepository } from "../orders-repository";
import { OrderItemAttributes } from "@/database/sequelize/models/order-item";
import { OrderNotFoundError } from "@/services/_errors/order-not-found-error";

interface OrderItemInput {
  dishId: string;
  quantity: number;
  unitPriceCents: number;
}

export class InMemoryOrdersRepository implements OrdersRepository {
  public orders: OrderAttributes[] = []
  public orderItems: OrderItemAttributes[] = []

  async create(data: OrderCreationAttributes & { items: OrderItemInput[] }): Promise<OrderAttributes & { items: OrderItemAttributes[] }> {
    const totalAmountCents = data.items.reduce((acc, item) => acc + item.unitPriceCents * item.quantity, 0)

    const order: OrderAttributes = {
      id: randomUUID(),
      customerId: data.customerId,
      status: data.status ?? OrderStatus.PENDING,
      totalAmountCents,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const orderItems: OrderItemAttributes[] = data.items.map((item) => ({
      id: randomUUID(),
      orderId: order.id,
      dishId: item.dishId,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    }))



    this.orders.push(order)
    this.orderItems.push(...orderItems)

    return { ...order, items: orderItems }
  }

  async findById(id: string): Promise<OrderAttributes | null> {
    const order = this.orders.find((order) => order.id === id)

    return order ?? null
  }

  async findOrdersByCustomerId({ customerId, page, limit }: { customerId: string, page: number, limit: number }): Promise<(OrderAttributes & { items: OrderItemAttributes[] })[]> {
    const orders = this.orders.filter((order) => order.customerId === customerId)

    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: this.orderItems.filter((item) => item.orderId === order.id),
    }))

    return ordersWithItems.slice((page - 1) * limit, page * limit)
  }

  async count(customerId?: string): Promise<number> {
    if (customerId) {
      return this.orders.filter((order) => order.customerId === customerId).length
    }

    return this.orders.length
  }

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    const order = this.orders.find((order) => order.id === id)

    if (!order) {
      throw new OrderNotFoundError()
    }

    order.status = status
  }

  async updateItems(orderId: string, items: { dishId: string; quantity: number; unitPriceCents: number }[]): Promise<void> {
    const order = this.orders.find((order) => order.id === orderId)

    if (!order) {
      throw new OrderNotFoundError()
    }

    // Remove existing items for the order
    this.orderItems = this.orderItems.filter((item) => item.orderId !== orderId)

    const newOrderItems: OrderItemAttributes[] = items.map((item) => ({
      id: randomUUID(),
      orderId,
      dishId: item.dishId,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    }))

    this.orderItems.push(...newOrderItems)

    order.totalAmountCents = items.reduce((acc, item) => acc + item.unitPriceCents * item.quantity, 0)

    order.updatedAt = new Date()
  }
} 