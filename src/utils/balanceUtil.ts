import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function calculateIfEnoughCreditForPurchase(cardId: number, amountRequired: any) {
  const balance = await getBalance(cardId);
  if (balance < amountRequired)
    throw { type: "unauthorized", message: "Insufficient Balance" };
}

export async function getBalance(cardId: number) {
  const payments = await paymentRepository.findByCardId(cardId);
  const recharges = await rechargeRepository.findByCardId(cardId);
  const balance = calculateBalance(payments, recharges);
  return balance;
}

export function calculateBalance(payments: any, recharges: any) {
  let balance = 0;

  recharges.forEach((recharge: any) => {
    balance += recharge.amount;
  });

  payments.forEach((payment: any) => {
    balance -= payment.amount;
  });

  return balance;
}
