import { OrderItemAttributes } from "@/database/sequelize/models/order-item";
import { OrderAttributes, OrderCreationAttributes } from "../database/sequelize/models/order";

export interface OrdersRepository {
  create(data: OrderCreationAttributes & { items: { dishId: string; quantity: number; unitPriceCents: number }[] }): Promise<OrderAttributes & { items: OrderItemAttributes[] }>
  findById(id: string): Promise<OrderAttributes | null>
  findOrdersByCustomerId({ customerId, page, limit }: { customerId: string, page: number, limit: number }): Promise<(OrderAttributes & { items: OrderItemAttributes[] })[]>
} 