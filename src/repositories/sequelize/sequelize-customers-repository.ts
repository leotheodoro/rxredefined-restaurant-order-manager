import { CustomersRepository } from "../customers-repository";
import { Customer, CustomerAttributes, CustomerCreationAttributes } from "@/database/sequelize/models/customer";

export class SequelizeCustomersRepository implements CustomersRepository {
  async create(data: CustomerCreationAttributes): Promise<CustomerAttributes> {
    const customer = await Customer.create(data)

    return customer
  }

  async findByEmail(email: string): Promise<CustomerAttributes | null> {
    const customer = await Customer.findOne({ where: { email } })

    return customer
  }

  async findById(id: string): Promise<CustomerAttributes | null> {
    const customer = await Customer.findByPk(id)

    return customer
  }
} 