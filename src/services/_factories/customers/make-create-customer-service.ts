import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository"
import { CreateCustomerService } from "@/services/customers/create-customer"


export function makeCreateCustomerService() {
  const customersRepository = new InMemoryCustomersRepository()
  const createCustomerService = new CreateCustomerService(customersRepository)

  return createCustomerService
}
