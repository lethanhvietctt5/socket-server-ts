import { Router } from "express";
import authRoute from "./authentication/auth";
import loginRoute from "./authentication/login";
import registerRoute from "./authentication/register";
import searchRoute from "./user/search";
import contactRoute from "./contact/contact";

import authMiddleware from "../middleware/auth.mdw";
import priorityRoute from "./user/priority";
import blokckRoute from "./user/block";

const router = Router();

// Authentication
router.use("/auth", authRoute);
router.use("/login", loginRoute);
router.use("/register", registerRoute);

// User
router.use("/search", authMiddleware, searchRoute);
router.use("/priority", authMiddleware, priorityRoute);
router.use("/block", authMiddleware, blokckRoute);

// Contact
router.use("/contacts", authMiddleware, contactRoute);

export default router;
