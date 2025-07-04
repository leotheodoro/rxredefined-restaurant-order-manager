import { CustomersRepository } from "../../repositories/customers-repository";
import { CustomerAlreadyExistsError } from "../_errors/customer-already-exists-erorr";

interface CreateCustomerServiceRequest {
  name: string
  email: string
  phone: string
}

export class CreateCustomerService {
  constructor(private customersRepository: CustomersRepository) { }

  async execute({ name, email, phone }: CreateCustomerServiceRequest) {
    const customerAlreadyExists = await this.customersRepository.findByEmail(email)

    if (customerAlreadyExists) {
      throw new CustomerAlreadyExistsError()
    }

    const customer = await this.customersRepository.create({
      name,
      email,
      phone
    })

    return { customer }
  }
}