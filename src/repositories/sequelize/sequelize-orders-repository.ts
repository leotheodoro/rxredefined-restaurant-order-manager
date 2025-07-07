import { OrdersRepository } from "../orders-repository";
import { Order, OrderAttributes, OrderCreationAttributes, OrderStatus } from "@/database/sequelize/models/order";
import { OrderItem, OrderItemAttributes } from "@/database/sequelize/models/order-item";
import { sequelize } from "@/lib/sequelize";
import { Transaction } from "sequelize";
import { OrderNotFoundError } from "@/services/_errors/order-not-found-error";

export class SequelizeOrdersRepository implements OrdersRepository {
  async create(data: OrderCreationAttributes & { items: { dishId: string; quantity: number; unitPriceCents: number }[] }): Promise<OrderAttributes & { items: OrderItemAttributes[] }> {
    return sequelize.transaction(async (t: Transaction) => {
      const totalAmountCents = data.items.reduce((acc, item) => acc + item.unitPriceCents * item.quantity, 0)

      const order = await Order.create({
        customerId: data.customerId,
        status: data.status ?? OrderStatus.PENDING,
        totalAmountCents,
      }, { transaction: t })

      const orderItems = await OrderItem.bulkCreate(
        data.items.map((item) => ({
          orderId: order.id,
          dishId: item.dishId,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
        })),
        { transaction: t }
      )

      return {
        ...order.get({ plain: true }),
        items: orderItems.map((it) => it.get({ plain: true })),
      }
    })
  }

  async findById(id: string): Promise<OrderAttributes | null> {
    const order = await Order.findByPk(id)

    return order
  }

  async findOrdersByCustomerId({ customerId, page, limit }: { customerId: string, page: number, limit: number }): Promise<(OrderAttributes & { items: OrderItemAttributes[] })[]> {
    const orders = await Order.findAll({
      where: { customerId },
      offset: (page - 1) * limit,
      limit,
      order: [["createdAt", "DESC"]],
    })

    const orderIds = orders.map((order) => order.id)

    const items = await OrderItem.findAll({ where: { orderId: orderIds } })

    return orders.map((order) => ({
      ...order.get({ plain: true }),
      items: items
        .filter((item) => item.orderId === order.id)
        .map((it) => it.get({ plain: true })),
    }))
  }

  async count(customerId?: string): Promise<number> {
    const where = customerId ? { customerId } : undefined

    return Order.count({ where })
  }

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    const order = await Order.findByPk(id)

    if (!order) {
      throw new OrderNotFoundError()
    }

    order.status = status

    await order.save()
  }

  async updateItems(orderId: string, items: { dishId: string; quantity: number; unitPriceCents: number }[]): Promise<void> {
    return sequelize.transaction(async (t: Transaction) => {
      const order = await Order.findByPk(orderId, { transaction: t })

      if (!order) {
        throw new OrderNotFoundError()
      }

      await OrderItem.destroy({ where: { orderId }, transaction: t })

      await OrderItem.bulkCreate(
        items.map((item) => ({
          orderId,
          dishId: item.dishId,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
        })),
        { transaction: t }
      )

      const totalAmountCents = items.reduce((acc, item) => acc + item.unitPriceCents * item.quantity, 0)
      order.totalAmountCents = totalAmountCents

      await order.save({ transaction: t })
    })
  }
} 