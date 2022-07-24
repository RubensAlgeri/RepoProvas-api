import { Router } from "express";

import * as controller from "../controllers/testController.js";
import schemaValidator from "../middlewares/schemaValidatorMiddleware.js"
import * as schema from "../schemas/testSchema.js";
import { validateToken } from "../middlewares/tokenMiddleware.js";

const testRouter = Router();
testRouter.post('/test',validateToken, schemaValidator(schema.testSchema), controller.postTest)

export default testRouter;