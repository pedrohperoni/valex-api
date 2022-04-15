import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

export async function createCard(
  employeeId: number,
  cardType: cardRepository.TransactionTypes
) {
  const employee = await validateEmployee(employeeId);
  await validateEmployeeCardType(employeeId, cardType);
  const cardNumber = faker.finance.creditCardNumber("mastercard");
  const cardholderName = formatNameToCardHolderName(employee.fullName);
  const cardExpirationDate = dayjs().add(5, "year").format("MM/YY");
  const CVC = bcrypt.hashSync(faker.finance.creditCardCVV(), 10);

  const Card: cardRepository.CardInsertData = {
    employeeId,
    number: cardNumber,
    cardholderName,
    securityCode: CVC,
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
