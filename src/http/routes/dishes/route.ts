import { createDishController } from '@/http/controllers/dishes/create-dish-controller'
import { findDishesController } from '@/http/controllers/dishes/find-dishes-controller'
import { Router } from 'express'

const dishesRoutes = Router()

dishesRoutes.get('/menu', findDishesController)
dishesRoutes.post('/menu', createDishController)

export { dishesRoutes }