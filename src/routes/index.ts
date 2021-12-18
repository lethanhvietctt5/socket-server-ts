import { Router } from "express";
import authRoute from "./authentication/auth";
import loginRoute from "./authentication/login";
import registerRoute from "./authentication/register";
import searchRoute from "./user/search";
import contactRoute from "./contact/contact";

import authMiddleware from "../middleware/auth.mdw";

const router = Router();

router.use("/auth", authRoute);
router.use("/login", loginRoute);
router.use("/register", registerRoute);
router.use("/search", authMiddleware, searchRoute);
router.use("/contacts", authMiddleware, contactRoute);

export default router;
