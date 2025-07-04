import express from "express";
import { sequelize } from "../lib/sequelize";


export const app = express();

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

