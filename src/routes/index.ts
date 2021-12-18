import { Router } from "express";
import authRoute from "./authentication/auth";
import loginRoute from "./authentication/login";
import registerRoute from "./authentication/register";

const router = Router();

router.use("/auth", authRoute);
router.use("/login", loginRoute);
router.use("/register", registerRoute);

export default router;
