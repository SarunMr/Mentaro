import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not Authenticated",
        success: false,
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }
    req.id = decode.userid;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;
