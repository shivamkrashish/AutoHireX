// server/routes/userRoutes.js
import express from "express";
import { registerUser, loginUser, getUserData, getCars } from "../controllers/userControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/data", protect, getUserData);
router.get("/cars", getCars);

export default router;
