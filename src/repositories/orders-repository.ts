import { OrderAttributes, OrderCreationAttributes } from "../database/sequelize/models/order";

export interface OrdersRepository {
  create(data: OrderCreationAttributes & { items: { dishId: string; quantity: number; unitPriceCents: number }[] }): Promise<OrderAttributes>
  findById(id: string): Promise<OrderAttributes | null>
} 