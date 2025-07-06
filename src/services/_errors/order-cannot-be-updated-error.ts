export class OrderCannotBeUpdatedError extends Error {
  constructor() {
    super("Order cannot be modified unless it is in pending or preparing status")
  }
} 