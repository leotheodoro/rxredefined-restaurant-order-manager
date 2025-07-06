import { OrderItemAttributes } from "@/database/sequelize/models/order-item";
import { OrderAttributes, OrderCreationAttributes, OrderStatus } from "../database/sequelize/models/order";

export interface OrdersRepository {
  create(data: OrderCreationAttributes & { items: { dishId: string; quantity: number; unitPriceCents: number }[] }): Promise<OrderAttributes & { items: OrderItemAttributes[] }>
  findById(id: string): Promise<OrderAttributes | null>
  findOrdersByCustomerId({ customerId, page, limit }: { customerId: string, page: number, limit: number }): Promise<(OrderAttributes & { items: OrderItemAttributes[] })[]>
  count(customerId?: string): Promise<number>
  updateStatus(id: string, status: OrderStatus): Promise<void>
  updateItems(id: string, items: { dishId: string; quantity: number; unitPriceCents: number }[]): Promise<void>
} 