import express from "express";
import { customersRoutes } from "./routes/customers/route";
import { dishesRoutes } from "./routes/dishes/route";
import { ordersRoutes } from "./routes/orders/route";
import { errorHandler } from "./controllers/error-handler";
import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


export const app = express();

app.use(express.json())

app.use(customersRoutes)
app.use(dishesRoutes)
app.use(ordersRoutes)

app.use(errorHandler)

app.get("/", (req, res) => {
  res.send("Rx Redefined API");
});

const options: Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Rx Redefined API',
      version: '1.0.0',
    },
  },
  apis: ['./src/http/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

