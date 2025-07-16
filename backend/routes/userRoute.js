import express from "express";

import { register } from "../controllers/userController";
import { login } from "../controllers/userController";

const router = express.Router();
// Route: POST /api/auth/register
router.post("/register", register);

// Route: POST /api/auth/login
router.post("/login", login);

export default router;
