import { Request, Response } from "express";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {
  const { employeeId, cardType } = req.body;

  await cardService.createCard(employeeId, cardType);

  res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
  const { password, securityCode } = req.body;
  const cardId = parseInt(req.params.id);

  await cardService.activateCard(cardId, securityCode, password);

  res.sendStatus(201);
}


export async function getCardBalance(req: Request, res: Response) {
   const cardId = parseInt(req.params.id)

   const cardData = await cardService.getCardBalance(cardId)
   res.status(201).send(cardData)

}