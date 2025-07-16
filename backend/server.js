import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { db } from "./config/database";
import userRoutes from "./routes/userRoute";

dotenv.config();
db();
const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors());
app.use("/api/auth", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
