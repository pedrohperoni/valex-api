import { Router } from "express";
import * as controller from "../controllers/shoppingController.js";
import { schemaValidationMiddleware } from "../middlewares/schemaValidationMiddleware.js";
import purchaseSchema from "../schemas/purchaseSchema.js";

const shoppingRouter = Router();

shoppingRouter.post("/shopping/purchase",schemaValidationMiddleware(purchaseSchema), controller.newPurchase);

export default shoppingRouter;
