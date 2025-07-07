import { Router } from "express"
import { createOrderController } from "@/http/controllers/orders/create-order-controller"
import { findOrdersByCustomerController } from "@/http/controllers/orders/find-orders-by-customer-controller"
import { updateOrderStatusController } from "@/http/controllers/orders/update-order-status-controller"
import { updateOrderItemsController } from "@/http/controllers/orders/update-order-items-controller"

const ordersRoutes = Router()

ordersRoutes.post('/order', createOrderController)
ordersRoutes.get('/customers/orders/:customerId', findOrdersByCustomerController)
ordersRoutes.patch('/order/:orderId', updateOrderStatusController)
ordersRoutes.patch('/order/modify/:orderId', updateOrderItemsController)

export { ordersRoutes } 