import { Router } from 'express'
import { createCustomerController } from '@/http/controllers/customers/create-customer-controller'

const customersRoutes = Router()

customersRoutes.post('/customer', createCustomerController)

export { customersRoutes }