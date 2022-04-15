import { Router } from "express";
import * as controller from "../controllers/cardController.js";

const cardRouter = Router();

cardRouter.post("/cards", controller.createCard);

export default cardRouter;
