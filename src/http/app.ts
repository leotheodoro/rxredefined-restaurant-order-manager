import express from "express";
import { customersRoutes } from "./routes/customers/route";
import { dishesRoutes } from "./routes/dishes/route";
import { ordersRoutes } from "./routes/orders/route";
import { errorHandler } from "./controllers/error-handler";


export const app = express();

app.use(express.json())

app.use(customersRoutes)
app.use(dishesRoutes)
app.use(ordersRoutes)

app.use(errorHandler)

app.get("/", (req, res) => {
  res.send("Rx Redefined API");
});

