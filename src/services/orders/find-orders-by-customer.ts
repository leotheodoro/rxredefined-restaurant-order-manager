import { OrdersRepository } from "@/repositories/orders-repository";
import { CustomerNotFoundError } from "../_errors/customer-not-found-error";
import { CustomersRepository } from "@/repositories/customers-repository";

export class FindOrdersByCustomerService {
  constructor(private ordersRepository: OrdersRepository, private customersRepository: CustomersRepository) { }

  async execute({ customerId, page = 1, limit = 10 }: { customerId: string, page?: number, limit?: number }) {
    const customer = await this.customersRepository.findById(customerId)
    if (!customer) {
      throw new CustomerNotFoundError()
    }

    const orders = await this.ordersRepository.findOrdersByCustomerId({ customerId, page, limit })
    const total = await this.ordersRepository.count(customerId)

    return { orders, total }
  }
}