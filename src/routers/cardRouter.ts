import { Router } from "express";
import * as controller from "../controllers/cardController.js";
import apiKeyValidationMiddleware from "../middlewares/apiKeyValidationMiddleware.js";
import { schemaValidationMiddleware } from "../middlewares/schemaValidationMiddleware.js";
import cardCreateSchema from "../schemas/cardCreateSchema.js";
import cardActivateSchema from "../schemas/cardActivateSchema.js"

const cardRouter = Router();

cardRouter.post("/card/create", apiKeyValidationMiddleware, schemaValidationMiddleware(cardCreateSchema), controller.createCard);
cardRouter.put("/card/:id/activate", schemaValidationMiddleware(cardActivateSchema), controller.activateCard)

export default cardRouter;
