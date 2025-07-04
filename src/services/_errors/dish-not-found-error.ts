export class DishNotFoundError extends Error {
  constructor() {
    super("Dish not found.")
  }
} 