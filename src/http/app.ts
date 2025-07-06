import express from "express";
import { customersRoutes } from "./routes/customers/route";
import { ZodError } from "zod";
import { dishesRoutes } from "./routes/dishes/route";


export const app = express();

app.use(express.json())
app.use(customersRoutes)
app.use(dishesRoutes)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation error', errors: err.flatten().fieldErrors })
  }

  console.error(err.stack)
  return res.status(500).json({ message: 'Internal server error' })
})

app.get("/", (req, res) => {
  res.send("Hello World");
});

