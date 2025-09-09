import express from "express";
import { createUser, getAllUsers, getUserById, updateUserById, loginUser, authGoogleUser, loginAdminUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/user", createUser);
router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);
router.post("/user/:id", updateUserById);
router.post("/login", loginUser);
router.post("/login/admin", loginAdminUser);
router.post("/auth/google", authGoogleUser);

export default router;