import { Sequelize } from "sequelize";
import { env } from "../env";

export const sequelize = new Sequelize(env.DATABASE_URL)
