import { Router } from "express";
import "express-async-errors"
import errorHandlingMiddleware from "../middlewares/errorHandler.js";
import authRouter from "./authRouter.js";

const router = Router();

router.use(authRouter)
router.use(errorHandlingMiddleware)

export default router;