import { Request, Response } from "express";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {
  const { employeeId, cardType } = req.body;

  const card = await cardService.createCard(employeeId, cardType);

  res.status(201).send(card);
}
