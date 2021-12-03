import { Router } from "express";
import authRoute from "./auth";
import loginRoute from "./login";
import registerRoute from "./register";

const router = Router();

router.use("/auth", authRoute);
router.use("/login", loginRoute);
router.use("/register", registerRoute);

export default router;
