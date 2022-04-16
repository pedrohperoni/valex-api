import { Router } from "express";
import * as controller from "../controllers/cardController.js";
import apiKeyValidationMiddleware from "../middlewares/apiKeyValidationMiddleware.js";
import { schemaValidationMiddleware } from "../middlewares/schemaValidationMiddleware.js";
import cardCreateSchema from "../schemas/cardCreateSchema.js";
import cardActivateSchema from "../schemas/cardActivateSchema.js"
import cardRechargeSchema from "../schemas/cardRechargeSchema.js"

const cardRouter = Router();

cardRouter.post("/card/create", apiKeyValidationMiddleware, schemaValidationMiddleware(cardCreateSchema), controller.createCard);
cardRouter.get("/card/:id", controller.getCardBalance)
cardRouter.put("/card/:id/activate", schemaValidationMiddleware(cardActivateSchema), controller.activateCard)

cardRouter.post("/card/:id/recharge", apiKeyValidationMiddleware, schemaValidationMiddleware(cardRechargeSchema), controller.rechargeCard)



export default cardRouter;
