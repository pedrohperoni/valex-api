import { Request, Response } from "express";
import * as shoppingService from "../services/shoppingService.js";

export async function newPurchase(req: Request, res: Response) {
  const { amount, businessId, cardId, password } = req.body;

  await shoppingService.newPurchase(amount, businessId, cardId, password);
  res.sendStatus(200);
}
