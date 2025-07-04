import { CustomerAttributes, CustomerCreationAttributes } from "../database/sequelize/models/customer";

export interface CustomersRepository {
  create(data: CustomerCreationAttributes): Promise<CustomerAttributes>
  findByEmail(email: string): Promise<CustomerAttributes | null>
}