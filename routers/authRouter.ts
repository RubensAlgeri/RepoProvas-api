import { Router } from "express";

import * as controller from "../controllers/authController.js";
import schemaValidator from "../middlewares/schemaValidatorMiddleware.js"
import * as schema from "../schemas/userSchema.js";

const authRouter = Router();
authRouter.post('/signin',schemaValidator(schema.signinUserSchema), controller.signIn)
authRouter.post('/signup',schemaValidator(schema.signupUserSchema), controller.signUp)

export default authRouter;