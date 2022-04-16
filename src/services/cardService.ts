import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as cardUtil from "../utils/cardUtil.js";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

// --------------------------- CARD CREATION ---------------------------

export async function createCard(
  employeeId: number,
  cardType: cardRepository.TransactionTypes
) {
  const employee = await validateEmployee(employeeId);
  await validateEmployeeCardType(employeeId, cardType);
  const cardNumber = faker.finance.creditCardNumber("mastercard");
  const cardholderName = formatNameToCardHolderName(employee.fullName);
  const cardExpirationDate = dayjs().add(5, "year").format("MM/YY");

  const cvc = faker.finance.creditCardCVV();
  //   console.log(cvc)
  //   const hashSecurityCode = bcrypt.hashSync(cvc, 10);
  const hashSecurityCode = bcrypt.hashSync(faker.finance.creditCardCVV(), 10);

  const Card: cardRepository.CardInsertData = {
    employeeId,
    number: cardNumber,
    cardholderName,
    securityCode: hashSecurityCode,
    expirationDate: cardExpirationDate,
    isVirtual: false,
    isBlocked: false,
    type: cardType,
  };

  await cardRepository.insert(Card);
}

async function validateEmployee(employeeId: number) {
  const employee = await employeeRepository.findById(employeeId);
  if (!employee) throw { type: "not_found", message: "Employee not found" };
  return employee;
}

async function validateEmployeeCardType(
  employeeId: number,
  cardType: cardRepository.TransactionTypes
) {
  const findCardByEmployeeAndCardType =
    await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);

  if (findCardByEmployeeAndCardType)
    throw {
      type: "unauthorized",
      message: `Employee already has a ${cardType} card`,
    };
  return;
}

function formatNameToCardHolderName(fullName: string) {
  const name: string[] = fullName.split(" ");
  let simplifiedName: string = name[0];
  for (let i = 1; i < name.length - 1; i++) {
    if (name[i].length >= 3) simplifiedName += ` ${name[i][0]}`;
  }
  simplifiedName += ` ${name[name.length - 1]}`;
  return simplifiedName.toUpperCase();
}

// --------------------------- CARD ACTIVATION ---------------------------

export async function activateCard(
  cardId: number,
  securityCode: string,
  password: string
) {
  const cardData = await validateCard(cardId);
  await validateExpirationDate(cardData);
  await checkIfCardIsAlreadyActive(cardData);
  await checkSecurityCodeMatch(cardData, securityCode);
  const hashPassword = bcrypt.hashSync(password, 10);

  await cardRepository.update(cardId, { password: hashPassword });
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

async function checkIfCardIsAlreadyActive(card: any) {
  if (card.password !== null) {
    throw { type: "conflict", message: "Card is already active" };
  }
}

async function checkSecurityCodeMatch(card: any, securityCode: string) {
  if (!bcrypt.compareSync(securityCode, card.securityCode))
    throw { type: "unauthorized", message: "Security code does not match" };
}

// --------------------------- CARD BALANCE AND TRANSACTIONS ---------------------------

export async function getCardBalance(id: number) {
  await validateCard(id);
  const payments = await paymentRepository.findByCardId(id);
  const recharges = await rechargeRepository.findByCardId(id);
  const balance: number = cardUtil.calculateBalance(payments, recharges);

  const cardData = {
    balance,
    payments,
    recharges,
  };
  console.log(cardData);
  return cardData;
}

// --------------------------- CARD RECHARGE ---------------------------

export async function rechargeCard(cardId: number, amount: number) {
  await validateCard(cardId);
  await validateExpirationDate(cardId);

  await rechargeRepository.insert({ cardId, amount });
}
