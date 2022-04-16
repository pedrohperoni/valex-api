import { Router } from "express";
import cardRouter from "./cardRouter.js";
import shoppingRouter from "./shoppingRouter.js";

const router = Router();

router.use(cardRouter);
router.use(shoppingRouter);

export default router;
