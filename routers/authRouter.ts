import { Router } from "express";

import * as controller from "../controllers/authController.js";
import schemaValidator from "../middlewares/schemaValidatorMiddleware.js"
import * as schema from "../schemas/userSchema.js";

const authRouter = Router();
authRouter.post('/sign-in',schemaValidator(schema.signinUserSchema), controller.signIn)
authRouter.post('/sign-up',schemaValidator(schema.signupUserSchema), controller.signUp)

export default authRouter;