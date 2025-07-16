import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY; // Replace with env var in production

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userid: user.userid }, SECRET_KEY, {
    expiresIn: "3d",
  });
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 72 * 60 * 60 * 1000,
    })
    .json({ success: true, message, user });
};
