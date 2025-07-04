import { randomUUID } from "crypto";
import { CustomerAttributes, CustomerCreationAttributes } from "../../database/sequelize/models/customer";
import { CustomersRepository } from "../customers-repository";

export class InMemoryCustomersRepository implements CustomersRepository {
  public customers: CustomerAttributes[] = []

  async create(data: CustomerCreationAttributes): Promise<CustomerAttributes> {
    const customer: CustomerAttributes = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.customers.push(customer)
    return customer
  }

  async findByEmail(email: string): Promise<CustomerAttributes | null> {
    const customer = this.customers.find(customer => customer.email === email)
    return customer ?? null
  }

  async findById(id: string): Promise<CustomerAttributes | null> {
    const customer = this.customers.find((customer) => customer.id === id)
    return customer ?? null
  }
}