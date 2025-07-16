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


export const db = async () => {
  try {
    await sequelize.authenticate();  // checks DB connection
    await sequelize.sync({ alter: true }); // updates tables if needed
    console.log('✅ Database connected and synced successfully');
  } catch (error) {
    console.error('❌ Failed to connect or sync database:', error);
    process.exit(1); // stop server if DB fails
  }
};
