import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository"
import { CreateCustomerService } from "./create-customer"
import { CustomerAlreadyExistsError } from "../_errors/customer-already-exists-error"

let customersRepository: InMemoryCustomersRepository
let sut: CreateCustomerService

describe('Create Customer Service', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    sut = new CreateCustomerService(customersRepository)
  })

  it('should be able to create a new customer', async () => {
    const { customer } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890'
    })

    expect(customer.id).toEqual(expect.any(String))
  })

  it('should not be able to create a new customer with same email', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890'
    })

    await expect(sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890'
    })).rejects.toBeInstanceOf(CustomerAlreadyExistsError)
  })
})