import { Router } from "express";
import authMiddleware from "../middleware/auth.mdw";
import authRoute from "./authentication/auth";
import loginRoute from "./authentication/login";
import registerRoute from "./authentication/register";
import searchRoute from "./user/search";
import contactRoute from "./contact/contact";
import blokckRoute from "./user/block";
import groupRoute from "./group/group";
import messageRoute from "./message/message";
import profileRoute from "./user/profile";

const router = Router();

// Authentication
router.use("/auth", authRoute);
router.use("/login", loginRoute);
router.use("/register", registerRoute);

// User
router.use("/search", authMiddleware, searchRoute);
router.use("/block", authMiddleware, blokckRoute);
router.use("/info", authMiddleware, profileRoute);

// Contact
router.use("/contacts", authMiddleware, contactRoute);

// Group
router.use("/group", authMiddleware, groupRoute);

// Message
router.use("/message", authMiddleware, messageRoute);

export default router;
