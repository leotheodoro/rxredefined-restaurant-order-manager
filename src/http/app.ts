import express from "express";
import { sequelize } from "../lib/sequelize";
import { customersRoutes } from "./routes/customers/route";
import { ZodError } from "zod";


export const app = express();

app.use(express.json())
app.use(customersRoutes)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: err.message })
  }

  console.error(err.stack)
  return res.status(500).json({ message: 'Internal server error' })
})

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send({ message: 'Connection to database has been established successfully.' });
  } catch (error) {
    res.send({ message: `Unable to connect to the database`, error });
  }
});

