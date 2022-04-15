import { Router } from "express";
import * as controller from "../controllers/cardController.js";
import apiKeyValidationMiddleware from "../middlewares/apiKeyValidationMiddleware.js";
import { schemaValidationMiddleware } from "../middlewares/schemaValidationMiddleware.js";
import cardSchema from "../schemas/cardSchema.js";

const cardRouter = Router();

cardRouter.post("/cards", apiKeyValidationMiddleware, schemaValidationMiddleware(cardSchema), controller.createCard);

export default cardRouter;
