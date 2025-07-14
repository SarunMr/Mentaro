import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const DATABASE = process.env.PGDATABASE;
const USERNAME = process.env.PGUSERNAME;
const PASSWORD = process.env.PGPASSWORD;

export const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

export default sequelize;
