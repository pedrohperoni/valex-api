import * as cardRepository from "../repositories/cardRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js"

import * as cardUtil from "../utils/cardUtil.js"
import dayjs from "dayjs";
import bcrypt from "bcrypt";

export async function newPurchase(
  amount: number,
  businessId: number,
  cardId: number,
  password: string
) {
  const card = await validateCard(cardId);
  await validateExpirationDate(cardId);
  await checkPasswordMatch(card, password)
  const business = await validateBusiness(businessId)
  await checkBusinessAndCardType(business.type, card.type)
  await cardUtil.calculateIfEnoughCreditForPurchase(cardId, amount)

  await paymentRepository.insert({cardId, businessId, amount})
}

async function validateCard(cardId: number) {
  const card = await cardRepository.findById(cardId);
  if (!card) throw { type: "not_found", message: "Card not found" };
  return card;
}

async function validateExpirationDate(card: any) {
  if (dayjs().format("MM/YY") > card.expirationDate)
    throw {
      type: "unauthorized",
      message: "Card is no longer valid (expired)",
    };
}

async function checkPasswordMatch(card: any, password: string) {
   if (!bcrypt.compareSync(password, card.password))
     throw { type: "unauthorized", message: "Wrong Password" };
 }

async function validateBusiness(businessId: number){
   const business = await businessRepository.findById(businessId);
   if(!business) throw { type: "not_found", message: "Business does not exist"}
   return business
 }

 async function checkBusinessAndCardType(businessType: string, cardType: string){
   if(businessType !== cardType) throw { type: "unauthorized", message: "Business and card types must match"}
 }
