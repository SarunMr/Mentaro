import express from "express";

import { register } from "../controllers/userController";
import { login } from "../controllers/userController";
import { getUserProfile } from "../controllers/userController";
import { logout } from "../controllers/userController";
import isAuthenticated from "../middlewares/isauthMiddelware";

const router = express.Router();
// Route: POST /api/auth/register
router.route("/register").post(register);
router.route("/login").post(login);

router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated,getUserProfile)

export default router;
