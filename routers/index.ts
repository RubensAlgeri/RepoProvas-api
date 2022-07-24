import { Router } from "express";
import "express-async-errors"
import errorHandlingMiddleware from "../middlewares/errorHandler.js";
import authRouter from "./authRouter.js";
import testRouter from "./testRouter.js";

const router = Router();

router.use(authRouter)
router.use(testRouter)
router.use(errorHandlingMiddleware)

export default router;