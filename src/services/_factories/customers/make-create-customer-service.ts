import { SequelizeCustomersRepository } from "@/repositories/sequelize/sequelize-customers-repository"
import { CreateCustomerService } from "@/services/customers/create-customer"


export function makeCreateCustomerService() {
  const customersRepository = new SequelizeCustomersRepository()
  const createCustomerService = new CreateCustomerService(customersRepository)

  return createCustomerService
}
